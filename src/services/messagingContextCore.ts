import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";
import type { IMessage } from "./messagingApi";

export interface SocketMessagePayload extends IMessage {
  local_id?: string;
}

export type TypingContext = { conversation_id: string } | { chatroom: true };

export interface MessagingContextType {
  isConnected: boolean;
  onlineUsers: Set<string>;
  chatroomUserCount: number;
  typingUsers: Record<string, string[]>;
  socket: Socket | null;
  joinConversation: (id: string) => void;
  leaveConversation: (id: string) => void;
  joinChatroom: () => void;
  leaveChatroom: () => void;
  startTyping: (context: TypingContext) => void;
  stopTyping: (context: TypingContext) => void;
  markDelivered: (message_id: string) => void;
  readConversation: (conversation_id: string) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
}

export const MessagingContext = createContext<MessagingContextType | null>(
  null,
);

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) throw new Error("useMessaging must be used within a MessagingProvider");
  return context;
};
