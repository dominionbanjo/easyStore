import { useState, useEffect, useMemo } from "react";
import { 
  useGetUserConversationsQuery, 
  useGetConversationMessagesQuery, 
  useGetChatroomMessagesQuery,
  useSendDirectMessageMutation,
  useSendChatroomMessageMutation,
  useMarkConversationReadMutation,
  type IMessage,
  type IConversation
} from "@/services/messagingApi";
import { useMessagingSocket } from "@/services/useMessagingSocket";
import { ChatSidebar } from "@/modules/website/components/messaging/ChatSidebar";
import { MessageList } from "@/modules/website/components/messaging/MessageList";
import { MessageInput } from "@/modules/website/components/messaging/MessageInput";
import { ProductPicker } from "@/modules/website/components/messaging/ProductPicker";
import { MessageDetailsModal } from "@/modules/website/components/messaging/MessageDetailsModal";
import { ConversationDetailsModal } from "@/modules/website/components/messaging/ConversationDetailsModal";
import type { IProduct } from "@/types/product/productTypes";
import { ShieldAlert, Info, MessageSquare, ChevronLeft, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const MessagesPage = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [activeTab, setActiveTab] = useState<string | "chatroom" | null>(null);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [attachedProduct, setAttachedProduct] = useState<IProduct | null>(null);
  const [failedMessages, setFailedMessages] = useState<IMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
  const [isConvDetailsModalOpen, setIsConvDetailsModalOpen] = useState(false);
  
  // Persistent Storage Key
  const STORAGE_KEY = "eazystore_unsent_messages";

  // Load unsent messages on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const unsent = JSON.parse(saved) as IMessage[];
        setFailedMessages(unsent);
        // Auto-retry each once if online
        unsent.forEach(msg => handleRetry(msg, true));
      } catch (e) {
        console.error("Failed to parse unsent messages", e);
      }
    }
  }, []);

  // Save to localStorage whenever failedMessages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(failedMessages));
  }, [failedMessages]);

  const { data: convData } = useGetUserConversationsQuery();
  const { data: chatroomData, isFetching: isFetchingChatroom } = useGetChatroomMessagesQuery({}, {
    skip: activeTab !== "chatroom"
  });
  const { data: directData, isFetching: isFetchingDirect } = useGetConversationMessagesQuery(
    { id: activeTab as string },
    { skip: !activeTab || activeTab === "chatroom" }
  );

  const [sendDirect] = useSendDirectMessageMutation();
  const [sendChatroom] = useSendChatroomMessageMutation();
  const [markRead] = useMarkConversationReadMutation();

  const socket = useMessagingSocket(activeTab);

  const conversations = convData?.data || [];
  const apiMessages = activeTab === "chatroom" ? chatroomData?.data?.items || [] : directData?.data?.items || [];
  
  // Filter failed messages for current context
  const currentContextFailed = useMemo(() => failedMessages.filter(m => 
    activeTab === "chatroom" ? m.is_public : m.conversation_id === activeTab
  ), [failedMessages, activeTab]);

  const isLoadingMessages = activeTab === "chatroom" ? isFetchingChatroom : isFetchingDirect;
  const activeConversation = conversations.find(c => c.id === activeTab);

  // Combine and deduplicate
  const activeMessages = useMemo(() => {
    const combined = [...apiMessages];
    currentContextFailed.forEach(fm => {
      if (!combined.find(am => am.localId === fm.localId || am.id === fm.id)) {
        combined.push(fm);
      }
    });
    return combined;
  }, [apiMessages, currentContextFailed]);

  // Real-time management
  useEffect(() => {
    if (!activeTab) return;

    if (activeTab === "chatroom") {
      socket.joinChatroom();
      return () => socket.leaveChatroom();
    } else {
      socket.joinConversation(activeTab);
      markRead(activeTab);
      return () => socket.leaveConversation(activeTab);
    }
  }, [activeTab]);

  const handleSendMessage = async (content: string, product?: IProduct | null) => {
    const tempId = `temp-${Date.now()}`;
    const payload: any = { content, local_id: tempId };
    
    if (product) {
      payload.product_id = product.id;
      payload.product_name = product.name;
      payload.product_slug = product.slug;
      
      const imageUrl = product.image ? (typeof product.image === "string" ? product.image : (product.image as any).url) : null;
      if (imageUrl) {
        payload.product_image = imageUrl;
      }
    }

    try {
      if (activeTab === "chatroom") {
        await sendChatroom(payload).unwrap();
      } else if (activeTab) {
        await sendDirect({
          id: activeTab,
          ...payload
        }).unwrap();
      }
      setAttachedProduct(null);
    } catch (err) {
      console.error("Failed to send message:", err);
      
      const failedMsg: IMessage = {
        id: tempId,
        localId: tempId,
        content: payload.content,
        sender_id: currentUser?.id,
        conversation_id: activeTab === "chatroom" ? null : activeTab,
        is_public: activeTab === "chatroom",
        status: "failed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender: currentUser as any,
        ...payload
      };
      
      setFailedMessages(prev => [...prev, failedMsg]);
    }
  };

  const handleRetry = async (message: IMessage, isAuto = false) => {
    const payload = {
      content: message.content,
      product_id: message.product_id || undefined,
      product_name: message.product_name || undefined,
      product_image: message.product_image || undefined,
      product_slug: message.product_slug || undefined,
    };

    try {
      if (message.is_public) {
        await sendChatroom(payload).unwrap();
      } else if (message.conversation_id) {
        await sendDirect({
          id: message.conversation_id,
          ...payload
        }).unwrap();
      }
      setFailedMessages(prev => prev.filter(m => m.localId !== message.localId));
    } catch (err) {
      if (!isAuto) console.error("Manual retry failed:", err);
    }
  };

  const handleTyping = () => {
    if (!activeTab) return;
    socket.startTyping(activeTab === "chatroom" ? { chatroom: true } : { conversation_id: activeTab });
  };

  const handleStopTyping = () => {
    if (!activeTab) return;
    socket.stopTyping(activeTab === "chatroom" ? { chatroom: true } : { conversation_id: activeTab });
  };

  return (
    <div className="flex bg-slate-50/50 dark:bg-black/20 min-h-[calc(100vh-64px)] pt-16">
      <div className="container mx-auto px-4 py-8 flex gap-6 h-[calc(100vh-128px)]">
        {/* Sidebar */}
        <div className={cn(
          "w-full lg:w-80 shadow-sm rounded-sm overflow-hidden border border-border bg-white dark:bg-neutral-950",
          activeTab && "hidden lg:block"
        )}>
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeTab}
            onSelect={setActiveTab}
            onlineUsers={socket.onlineUsers}
            chatroomUserCount={socket.chatroomUserCount}
            onShowConversationDetails={(conv) => {
              setSelectedConversation(conv);
              setIsConvDetailsModalOpen(true);
            }}
          />
        </div>

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col bg-white dark:bg-neutral-950 shadow-sm rounded-sm overflow-hidden border border-border",
          !activeTab && "hidden lg:flex"
        )}>
          {activeTab ? (
            <>
              {/* Chat Header for Mobile */}
              <div className="lg:hidden flex items-center gap-3 p-4 border-b border-border bg-white dark:bg-neutral-950 sticky top-0 z-10">
                <button 
                  onClick={() => setActiveTab(null)}
                  className="p-1 -ml-1 hover:bg-muted rounded-sm transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate text-sm">
                    {activeTab === "chatroom" ? "Public Chatroom" : 
                      activeConversation?.other_participant 
                        ? `${activeConversation.other_participant.first_name} ${activeConversation.other_participant.last_name}`
                        : "Conversation"}
                  </h3>
                  {activeTab !== "chatroom" && activeConversation?.other_participant?.store_name && (
                    <p className="text-[9px] text-primary font-black uppercase tracking-widest truncate -mt-0.5">
                      {activeConversation.other_participant.store_name}
                    </p>
                  )}
                  <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5">
                    {activeTab === "chatroom" ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {socket.chatroomUserCount} members online
                      </>
                    ) : (
                      <>
                        <span className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          socket.onlineUsers.has(activeConversation?.other_participant?.id || "") ? "bg-emerald-500" : "bg-zinc-300"
                        )} />
                        {socket.onlineUsers.has(activeConversation?.other_participant?.id || "") ? "Active now" : "Offline"}
                      </>
                    )}
                  </p>
                </div>
                {activeTab !== "chatroom" && activeConversation && (
                  <button 
                    onClick={() => {
                      setSelectedConversation(activeConversation);
                      setIsConvDetailsModalOpen(true);
                    }}
                    className="p-2 hover:bg-muted rounded-full transition-colors text-primary"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Header Info/Alerts */}
              <div className="bg-muted/30 p-2 text-center border-b border-border">
                {activeTab === "chatroom" ? (
                  <div className="flex items-center justify-center gap-2">
                    <Info className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium">Public community chat. Please be respectful.</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <ShieldAlert className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-600">Safe Payment Warning: Never pay outside of Eazystore.</span>
                  </div>
                )}
              </div>

              {/* Message History */}
              <MessageList
                messages={activeMessages}
                isLoading={isLoadingMessages}
                typingUsers={socket.typingUsers[activeTab] || []}
                isChatroom={activeTab === "chatroom"}
                onRetry={handleRetry}
                onShowDetails={(msg) => {
                  setSelectedMessage(msg);
                  setIsDetailsModalOpen(true);
                }}
              />

              {/* Input */}
              <MessageInput
                onSend={handleSendMessage}
                onTyping={handleTyping}
                onStopTyping={handleStopTyping}
                onOpenProductPicker={() => setIsProductPickerOpen(true)}
                attachedProduct={attachedProduct}
                onClearProduct={() => setAttachedProduct(null)}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Messages</h2>
              <p className="text-muted-foreground max-w-sm">
                Select a conversation or join the public chatroom to start messaging.
              </p>
            </div>
          )}
        </div>
      </div>

      <ProductPicker
        isOpen={isProductPickerOpen}
        onClose={() => setIsProductPickerOpen(false)}
        onSelect={(p) => {
          setAttachedProduct(p);
          setIsProductPickerOpen(false);
        }}
      />

      <MessageDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        message={selectedMessage}
      />

      <ConversationDetailsModal
        isOpen={isConvDetailsModalOpen}
        onClose={() => setIsConvDetailsModalOpen(false)}
        conversation={selectedConversation}
      />
    </div>
  );
};

export default MessagesPage;
