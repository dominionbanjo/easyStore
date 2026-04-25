import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { messagingApi } from "./messagingApi";
import type { AppDispatch } from "@/store";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useMessagingSocket = (currentConversationId?: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [chatroomUserCount, setChatroomUserCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({}); // contextId -> userIds[]
  
  const socketRef = useRef<Socket | null>(null);
  const activeChatIdRef = useRef<string | null>(null);

  useEffect(() => {
    activeChatIdRef.current = currentConversationId || null;
  }, [currentConversationId]);

  const dispatch = useDispatch<AppDispatch>();

  const connect = useCallback(() => {
    const token = Cookies.get("token");
    if (!token || socketRef.current?.connected) return;

    const socket = io(`${SOCKET_URL}/messaging`, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to messaging socket");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from messaging socket");
    });

    // --- Presence ---
    socket.on("user_online", ({ user_id }) => {
      setOnlineUsers((prev) => new Set(prev).add(user_id));
    });

    socket.on("user_offline", ({ user_id }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(user_id);
        return next;
      });
    });

    // --- Chatroom ---
    socket.on("chatroom_user_count", ({ count }) => {
      setChatroomUserCount(count);
    });

    // --- Real-time Messages ---
    socket.on("new_direct_message", (message) => {
      // Optimistically update RTK Query cache
      dispatch(
        messagingApi.util.updateQueryData(
          "getConversationMessages",
          { id: message.conversation_id },
          (draft) => {
            if (draft?.data?.items) {
              const incomingLocalId = (message as any).local_id;
              const exists = draft.data.items.find(m => 
                m.id === message.id || (incomingLocalId && m.localId === incomingLocalId)
              );
              if (!exists) {
                draft.data.items.push(message);
              } else if (incomingLocalId) {
                // Update existing record
                const index = draft.data.items.findIndex(m => m.localId === incomingLocalId);
                if (index !== -1) {
                  draft.data.items[index] = { ...message, status: "sent" };
                }
              }
            }
          }
        )
      );
      
      // Update conversations list (last message preview)
      dispatch(messagingApi.util.invalidateTags(["Messaging"]));

      // --- AUTO ACKNOWLEDGE ---
      // 1. Mark as delivered immediately
      socket.emit("mark_delivered", { message_id: message.id });

      // 2. If we are currently viewing this conversation, mark as read
      if (activeChatIdRef.current === message.conversation_id) {
        socket.emit("read_conversation", { conversation_id: message.conversation_id });
      }
    });

    socket.on("new_chatroom_message", (message) => {
      dispatch(
        messagingApi.util.updateQueryData(
          "getChatroomMessages",
          {},
          (draft) => {
            if (draft?.data?.items) {
              const incomingLocalId = (message as any).local_id;
              const exists = draft.data.items.find(m => 
                m.id === message.id || (incomingLocalId && m.localId === incomingLocalId)
              );
              if (!exists) {
                draft.data.items.push(message);
              } else if (incomingLocalId) {
                // Update existing record
                const index = draft.data.items.findIndex(m => m.localId === incomingLocalId);
                if (index !== -1) {
                  draft.data.items[index] = { ...message, status: "sent" };
                }
              }
            }
          }
        )
      );
    });

    // --- Typing Indicators ---
    socket.on("user_typing", ({ user_id, conversation_id }) => {
      setTypingUsers((prev) => {
        const existing = prev[conversation_id] || [];
        if (existing.includes(user_id)) return prev;
        return { ...prev, [conversation_id]: [...existing, user_id] };
      });
    });

    socket.on("user_stopped_typing", ({ user_id, conversation_id }) => {
      setTypingUsers((prev) => {
        const existing = prev[conversation_id] || [];
        return {
          ...prev,
          [conversation_id]: existing.filter((id) => id !== user_id),
        };
      });
    });

    // --- Message Status Updates ---
    socket.on("message_delivered", ({ message_id }) => {
      // Find which conversation this message belongs to and update its status
      // We'd have to search all conversations or just the active one
      if (activeChatIdRef.current) {
        dispatch(
          messagingApi.util.updateQueryData("getConversationMessages", { id: activeChatIdRef.current }, (draft) => {
            const msg = draft?.data?.items?.find(m => m.id === message_id);
            if (msg) {
              msg.delivered_at = new Date().toISOString();
            }
          })
        );
      }
    });

    socket.on("conversation_read", ({ conversation_id, read_at }) => {
      // Mark all messages as read in this conversation
      dispatch(
        messagingApi.util.updateQueryData("getConversationMessages", { id: conversation_id }, (draft) => {
          if (draft?.data?.items) {
            draft.data.items.forEach(m => {
              if (!m.read_at) m.read_at = read_at;
            });
          }
        })
      );
      dispatch(messagingApi.util.invalidateTags(["Messaging"]));
    });

    socketRef.current = socket;
  }, [dispatch]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // --- Actions ---
  const joinConversation = (conversation_id: string) => {
    socketRef.current?.emit("join_conversation", { conversation_id });
  };

  const leaveConversation = (conversation_id: string) => {
    socketRef.current?.emit("leave_conversation", { conversation_id });
  };

  const joinChatroom = () => {
    socketRef.current?.emit("join_chatroom");
  };

  const leaveChatroom = () => {
    socketRef.current?.emit("leave_chatroom");
  };

  const startTyping = (context: { conversation_id: string } | { chatroom: true }) => {
    socketRef.current?.emit("typing_start", context);
  };

  const stopTyping = (context: { conversation_id: string } | { chatroom: true }) => {
    socketRef.current?.emit("typing_stop", context);
  };

  const markDelivered = (message_id: string) => {
    socketRef.current?.emit("mark_delivered", { message_id });
  };

  const readConversation = (conversation_id: string) => {
    socketRef.current?.emit("read_conversation", { conversation_id });
  };

  return {
    isConnected,
    onlineUsers,
    chatroomUserCount,
    typingUsers,
    joinConversation,
    leaveConversation,
    joinChatroom,
    leaveChatroom,
    startTyping,
    stopTyping,
    markDelivered,
    readConversation,
  };
};
