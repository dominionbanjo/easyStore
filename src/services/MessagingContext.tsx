import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { messagingApi } from "./messagingApi";
import type { AppDispatch, RootState } from "@/store";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface MessagingContextType {
  isConnected: boolean;
  onlineUsers: Set<string>;
  chatroomUserCount: number;
  typingUsers: Record<string, string[]>;
  socket: Socket | null;
  joinConversation: (id: string) => void;
  leaveConversation: (id: string) => void;
  joinChatroom: () => void;
  leaveChatroom: () => void;
  startTyping: (context: { conversation_id: string } | { chatroom: true }) => void;
  stopTyping: (context: { conversation_id: string } | { chatroom: true }) => void;
  markDelivered: (message_id: string) => void;
  readConversation: (conversation_id: string) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
}

const MessagingContext = createContext<MessagingContextType | null>(null);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [chatroomUserCount, setChatroomUserCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const activeChatIdRef = useRef<string | null>(null);

  useEffect(() => {
    activeChatIdRef.current = activeConversationId;
  }, [activeConversationId]);

  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const connect = useCallback(() => {
    const token = Cookies.get("token");
    if (!token || !isAuthenticated || socketRef.current?.connected) return;

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

    socket.on("online_users_list", ({ user_ids }) => {
      setOnlineUsers(new Set(user_ids));
    });

    socket.on("chatroom_user_count", ({ count }) => {
      setChatroomUserCount(count);
    });

    socket.on("new_direct_message", (message) => {
      // Update specific conversation cache
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
                const index = draft.data.items.findIndex(m => m.localId === incomingLocalId);
                if (index !== -1) {
                  draft.data.items[index] = { ...message, status: "sent" };
                }
              }
            }
          }
        )
      );
      
      // Invalidate global conversations list to update unread counts and previews
      dispatch(messagingApi.util.invalidateTags(["Messaging"]));

      // Auto-acknowledge delivery
      socket.emit("mark_delivered", { message_id: message.id });

      // If viewing, mark as read
      if (activeChatIdRef.current === message.conversation_id) {
        socket.emit("read_conversation", { conversation_id: message.conversation_id });
        // Optimistically clear in list
        dispatch(
          messagingApi.util.updateQueryData("getUserConversations", undefined, (draft) => {
            const conv = draft?.data?.find(c => c.id === message.conversation_id);
            if (conv) conv.unread_count = 0;
          })
        );
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

    socket.on("message_delivered", () => {
      dispatch(messagingApi.util.invalidateTags(["Messaging"]));
    });

    socket.on("conversation_read", ({ conversation_id, read_at }) => {
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
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    }
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, connect]);

  // Handle auto-read when active tab changes
  useEffect(() => {
    if (activeConversationId && socketRef.current) {
        socketRef.current.emit("read_conversation", { conversation_id: activeConversationId });
        
        // Optimistically clear unread count in conversations list
        dispatch(
          messagingApi.util.updateQueryData("getUserConversations", undefined, (draft) => {
            const conv = draft?.data?.find(c => c.id === activeConversationId);
            if (conv) {
              conv.unread_count = 0;
            }
          })
        );
    }
  }, [activeConversationId, dispatch]);

  const value = useMemo(() => ({
    isConnected,
    onlineUsers,
    chatroomUserCount,
    typingUsers,
    socket: socketRef.current,
    joinConversation: (id: string) => socketRef.current?.emit("join_conversation", { conversation_id: id }),
    leaveConversation: (id: string) => socketRef.current?.emit("leave_conversation", { conversation_id: id }),
    joinChatroom: () => socketRef.current?.emit("join_chatroom"),
    leaveChatroom: () => socketRef.current?.emit("leave_chatroom"),
    startTyping: (ctx: any) => socketRef.current?.emit("typing_start", ctx),
    stopTyping: (ctx: any) => socketRef.current?.emit("typing_stop", ctx),
    markDelivered: (id: string) => socketRef.current?.emit("mark_delivered", { message_id: id }),
    readConversation: (id: string) => socketRef.current?.emit("read_conversation", { conversation_id: id }),
    activeConversationId,
    setActiveConversationId
  }), [isConnected, onlineUsers, chatroomUserCount, typingUsers, activeConversationId]);

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>;
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) throw new Error("useMessaging must be used within a MessagingProvider");
  return context;
};
