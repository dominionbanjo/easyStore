import { useEffect } from "react";
import { useMessaging } from "./messagingContextCore";

/**
 * Compatibility wrapper for the legacy useMessagingSocket hook.
 * Now utilizes the global MessagingContext.
 */
export const useMessagingSocket = (currentConversationId?: string | null) => {
  const messaging = useMessaging();

  useEffect(() => {
    if (currentConversationId) {
      messaging.setActiveConversationId(currentConversationId);
    } else {
      messaging.setActiveConversationId(null);
    }
    
    // Cleanup if needed
    return () => {
      // We don't necessarily want to null it on unmount if multiple components use it
      // but usually the main view component is the one setting it.
    };
  }, [currentConversationId, messaging]);

  return {
    isConnected: messaging.isConnected,
    onlineUsers: messaging.onlineUsers,
    chatroomUserCount: messaging.chatroomUserCount,
    typingUsers: messaging.typingUsers,
    joinConversation: messaging.joinConversation,
    leaveConversation: messaging.leaveConversation,
    joinChatroom: messaging.joinChatroom,
    leaveChatroom: messaging.leaveChatroom,
    startTyping: messaging.startTyping,
    stopTyping: messaging.stopTyping,
    markDelivered: messaging.markDelivered,
    readConversation: messaging.readConversation,
  };
};
