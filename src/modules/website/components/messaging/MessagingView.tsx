import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  useGetUserConversationsQuery,
  useGetConversationMessagesQuery,
  useGetChatroomMessagesQuery,
  useSendDirectMessageMutation,
  useSendChatroomMessageMutation,
  useMarkConversationReadMutation,
  type IMessage,
  type IConversation,
  type IParticipant,
} from "@/services/messagingApi";
import { useMessagingSocket } from "@/services/useMessagingSocket";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ProductPicker } from "./ProductPicker";
import { MessageDetailsModal } from "./MessageDetailsModal";
import { ConversationDetailsModal } from "./ConversationDetailsModal";
import type { IProduct } from "@/types/product/productTypes";
import {
  ShieldAlert,
  Info,
  MessageSquare,
  ChevronLeft,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

interface MessagingViewProps {
  basePath: string; // e.g. "/account/messages" or "/vendor/messages"
  containerClassName?: string;
}

interface SendMessagePayload {
  content: string;
  local_id: string;
  product_id?: string;
  product_name?: string;
  product_slug?: string;
  product_image?: string;
}

export const MessagingView = ({ basePath, containerClassName }: MessagingViewProps) => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [activeTab, setActiveTab] = useState<string | "chatroom" | null>(
    id && !id.startsWith(":") ? id : null,
  );
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [attachedProduct, setAttachedProduct] = useState<IProduct | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<IConversation | null>(null);
  const [isConvDetailsModalOpen, setIsConvDetailsModalOpen] = useState(false);

  const STORAGE_KEY = "eazystore_unsent_messages";

  const [failedMessages, setFailedMessages] = useState<IMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const lastProcessedPrefill = useRef<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(failedMessages));
  }, [failedMessages]);

  useEffect(() => {
    if (id?.startsWith(":")) {
      navigate(basePath, { replace: true });
    }
  }, [id, navigate, basePath]);

  // ─── Data Fetching ────────────────────────────────────────────────────────
  const {
    data: convData,
    isFetching: isFetchingConversations,
  } = useGetUserConversationsQuery();

  const { data: chatroomData, isFetching: isFetchingChatroom } =
    useGetChatroomMessagesQuery({}, { skip: activeTab !== "chatroom" });

  // RTK Query caches per-arg: each unique `id` gets its own cache entry.
  // `isFetching` is true only while the first request for a given id is in flight —
  // subsequent visits to the same id use the cache instantly (isFetching = false).
  const {
    isFetching: isFetchingDirect,
    currentData: directCurrentData, // currentData is undefined while fetching a NEW id
  } = useGetConversationMessagesQuery(
    { id: activeTab as string },
    { skip: !activeTab || activeTab === "chatroom" },
  );

  const [sendDirect] = useSendDirectMessageMutation();
  const [sendChatroom] = useSendChatroomMessageMutation();
  const [markRead] = useMarkConversationReadMutation();

  const socket = useMessagingSocket(activeTab || undefined);
  const socketRef = useRef(socket);
  socketRef.current = socket;

  // ─── Derived State ────────────────────────────────────────────────────────
  const conversations = useMemo(() => convData?.data || [], [convData?.data]);

  // `currentData` is only populated when data belongs to the CURRENT arg (id).
  // While switching to a new conversation, directCurrentData is undefined → we show skeletons.
  // Once the data for the new id arrives (or is served from cache), it's set immediately.
  const apiMessages = useMemo(() => {
    if (activeTab === "chatroom") return chatroomData?.data?.items || [];
    // Use currentData (not data) — this ensures we never show messages from a previous id
    return directCurrentData?.data?.items || [];
  }, [activeTab, chatroomData, directCurrentData]);

  const currentContextFailed = useMemo(
    () =>
      failedMessages.filter((m) =>
        activeTab === "chatroom" ? m.is_public : m.conversation_id === activeTab
      ),
    [failedMessages, activeTab]
  );

  const activeMessages = useMemo(() => {
    const combined = [...apiMessages];
    currentContextFailed.forEach((fm) => {
      if (!combined.find((am) => am.localId === fm.localId || am.id === fm.id)) {
        combined.push(fm);
      }
    });
    return combined;
  }, [apiMessages, currentContextFailed]);

  const activeConversation = useMemo(() =>
    conversations.find((c) => c.id === activeTab),
  [conversations, activeTab]);

  // Show skeleton loaders:
  // - For chatroom: only on first load (no cached data yet)
  // - For direct: when currentData is undefined (fetch in flight for a new id, or truly no cache)
  const isLoadingMessages =
    activeTab === "chatroom"
      ? isFetchingChatroom && !chatroomData
      : isFetchingDirect && !directCurrentData;

  // ─── Socket & Effects ─────────────────────────────────────────────────────
  useEffect(() => {
    if (id !== activeTab) {
      setActiveTab(id || null);
    }

    if (!activeTab) return;

    if (activeTab === "chatroom") {
      socketRef.current.joinChatroom();
      return () => socketRef.current.leaveChatroom();
    } else {
      socketRef.current.joinConversation(activeTab);

      // Only mark as read if there are actually unread messages.
      // Calling markRead unconditionally invalidates the "Messaging" tag
      // every time you switch chats, causing unnecessary refetches.
      const conv = conversations.find((c) => c.id === activeTab);
      if (conv && conv.unread_count > 0) {
        markRead(activeTab);
      }

      return () => socketRef.current.leaveConversation(activeTab);
    }
  }, [activeTab, id, markRead, conversations]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(
    async (content: string, product?: IProduct | null) => {
      const tempId = `temp-${Date.now()}`;
      const payload: SendMessagePayload = { content, local_id: tempId };
      if (product) {
        payload.product_id = product.id;
        payload.product_name = product.name;
        payload.product_slug = product.slug;
        const imageUrl = product.image
          ? typeof product.image === "string"
            ? product.image
            : product.image.url
          : null;
        if (imageUrl) payload.product_image = imageUrl;
      }

      try {
        if (activeTab === "chatroom") {
          await sendChatroom(payload).unwrap();
        } else if (activeTab) {
          await sendDirect({ id: activeTab, ...payload }).unwrap();
        }
        setAttachedProduct(null);
      } catch {
        const sender: IParticipant = {
          id: currentUser?.id ?? "",
          first_name: currentUser?.first_name ?? "",
          last_name: currentUser?.last_name ?? "",
          email: currentUser?.email ?? "",
          username: currentUser?.username ?? "",
          avatar: currentUser?.avatar ?? null,
          account_type: currentUser?.account_type ?? "user",
        };
        const failedMsg: IMessage = {
          id: tempId,
          localId: tempId,
          content,
          sender_id: currentUser?.id ?? "",
          recipient_id: null,
          conversation_id: activeTab === "chatroom" ? null : activeTab,
          is_public: activeTab === "chatroom",
          product_id: payload.product_id ?? null,
          product_name: payload.product_name ?? null,
          product_image: payload.product_image ?? null,
          product_slug: payload.product_slug ?? null,
          delivered_at: null,
          read_at: null,
          status: "failed",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          sender,
        };
        setFailedMessages((prev) => [...prev, failedMsg]);
      }
    },
    [activeTab, currentUser, sendChatroom, sendDirect, setAttachedProduct, setFailedMessages],
  );

  const handleRetry = useCallback(
    async (message: IMessage, isAuto = false) => {
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
          await sendDirect({ id: message.conversation_id, ...payload }).unwrap();
        }
        setFailedMessages((prev) => prev.filter((m) => m.localId !== message.localId));
      } catch (err) {
        if (!isAuto) console.error("Manual retry failed:", err);
      }
    },
    [sendChatroom, sendDirect, setFailedMessages],
  );

  // Restore unsent/failed messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const unsent = JSON.parse(saved) as IMessage[];
        setFailedMessages(unsent);
        unsent.forEach((msg) => handleRetry(msg, true));
      } catch {
        console.error("Failed to parse unsent messages");
      }
    }
  }, [handleRetry]);

  // Handle prefill from URL params (e.g. shared product links)
  useEffect(() => {
    const prefill = searchParams.get("prefill");
    const productPayloadStr = searchParams.get("product_payload");
    
    if (prefill && activeTab && activeTab !== "chatroom" && lastProcessedPrefill.current !== prefill) {
      lastProcessedPrefill.current = prefill;
      
      let productDetails: IProduct | null = null;
      if (productPayloadStr) {
        try {
          productDetails = JSON.parse(decodeURIComponent(productPayloadStr));
        } catch {
          console.error("Failed to parse product payload from URL");
        }
      }

      handleSendMessage(decodeURIComponent(prefill), productDetails);
      
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("prefill");
      newParams.delete("product_payload");
      const targetUrl = id ? `${basePath}/${id}` : basePath;
      const queryStr = newParams.toString();
      navigate(`${targetUrl}${queryStr ? "?" + queryStr : ""}`, { replace: true });
    }
  }, [searchParams, activeTab, id, navigate, basePath, handleSendMessage]);

  const handleTyping = () => {
    if (!activeTab) return;
    socket.startTyping(activeTab === "chatroom" ? { chatroom: true } : { conversation_id: activeTab });
  };

  const handleStopTyping = () => {
    if (!activeTab) return;
    socket.stopTyping(activeTab === "chatroom" ? { chatroom: true } : { conversation_id: activeTab });
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className={cn("flex bg-slate-50/50 dark:bg-black/20 min-h-[calc(100vh-64px)]", containerClassName)}>
      <div className="container mx-auto px-4 py-8 flex gap-6 h-[calc(100vh-128px)]">
        {/* Sidebar */}
        <div className={cn("w-full lg:w-80 shadow-sm rounded-sm overflow-hidden border border-border bg-white dark:bg-neutral-950", activeTab && "hidden lg:block")}>
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeTab}
            onSelect={(selectedId) => navigate(`${basePath}/${selectedId}`)}
            onlineUsers={socket.onlineUsers}
            chatroomUserCount={socket.chatroomUserCount}
            onShowConversationDetails={(conv) => {
              setSelectedConversation(conv);
              setIsConvDetailsModalOpen(true);
            }}
            isLoading={isFetchingConversations && conversations.length === 0}
          />
        </div>

        {/* Chat Area */}
        <div className={cn("flex-1 flex flex-col bg-white dark:bg-neutral-950 shadow-sm rounded-sm overflow-hidden border border-border", !activeTab && "hidden lg:flex")}>
          {activeTab ? (
            <>
              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-between p-4 border-b border-border bg-white dark:bg-neutral-950">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary font-bold uppercase">
                    {activeTab === "chatroom" ? "#" : activeConversation?.other_participant?.first_name?.[0] || "?"}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-sm leading-tight">
                      {activeTab === "chatroom" ? "Public Chatroom" : activeConversation ? `${activeConversation.other_participant.first_name} ${activeConversation.other_participant.last_name}` : "Conversation"}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={cn("h-1.5 w-1.5 rounded-full", (activeTab === "chatroom" || socket.onlineUsers.has(activeConversation?.other_participant?.id || "")) ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-zinc-300")} />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {activeTab === "chatroom" ? `${socket.chatroomUserCount} Online` : socket.onlineUsers.has(activeConversation?.other_participant?.id || "") ? "Active Now" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeTab !== "chatroom" && activeConversation && (
                    <button
                      onClick={() => { setSelectedConversation(activeConversation); setIsConvDetailsModalOpen(true); }}
                      className="p-2 hover:bg-muted rounded-sm transition-colors text-muted-foreground"
                      title="Conversation Info"
                    >
                      <Info className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => navigate(basePath)}
                    className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-sm transition-colors text-muted-foreground"
                    title="Close Chat"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Header */}
              <div className="lg:hidden flex items-center gap-3 p-4 border-b border-border bg-white dark:bg-neutral-950 sticky top-0 z-10">
                <button onClick={() => navigate(basePath)} className="p-1 -ml-1 hover:bg-muted rounded-sm transition-colors text-foreground">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate text-sm">
                    {activeTab === "chatroom" ? "Public Chatroom" : activeConversation?.other_participant ? `${activeConversation.other_participant.first_name} ${activeConversation.other_participant.last_name}` : "Conversation"}
                  </h3>
                  {activeTab !== "chatroom" && activeConversation?.other_participant?.store_name && (
                    <p className="text-[9px] text-primary font-black uppercase tracking-widest truncate -mt-0.5">{activeConversation.other_participant.store_name}</p>
                  )}
                  <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5">
                    {activeTab === "chatroom" ? (
                      <><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{socket.chatroomUserCount} members online</>
                    ) : (
                      <><span className={cn("h-1.5 w-1.5 rounded-full", socket.onlineUsers.has(activeConversation?.other_participant?.id || "") ? "bg-emerald-500" : "bg-zinc-300")} />{socket.onlineUsers.has(activeConversation?.other_participant?.id || "") ? "Active now" : "Offline"}</>
                    )}
                  </p>
                </div>
                {activeTab !== "chatroom" && activeConversation && (
                  <button onClick={() => { setSelectedConversation(activeConversation); setIsConvDetailsModalOpen(true); }} className="p-2 hover:bg-muted rounded-full transition-colors text-primary">
                    <ChevronDown className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Warning Banner */}
              <div className="bg-muted/10 p-1.5 text-center border-b border-border shadow-inner">
                {activeTab === "chatroom" ? (
                  <div className="flex items-center justify-center gap-2"><Info className="h-3 w-3 text-primary" /><span className="text-[10px] font-bold uppercase tracking-tight opacity-70">Public community chat. Please be respectful.</span></div>
                ) : (
                  <div className="flex items-center justify-center gap-2"><ShieldAlert className="h-3 w-3 text-emerald-500" /><span className="text-[10px] font-bold uppercase tracking-tight text-emerald-600/70">Safe Payment Warning: Never pay outside of Eazystore.</span></div>
                )}
              </div>

              {/* Message List — key=activeTab forces a full remount on conversation change */}
              <MessageList
                key={activeTab}
                messages={activeMessages}
                isLoading={isLoadingMessages}
                typingUsers={socket.typingUsers[activeTab] || []}
                isChatroom={activeTab === "chatroom"}
                onRetry={handleRetry}
                onShowDetails={(msg) => { setSelectedMessage(msg); setIsDetailsModalOpen(true); }}
              />

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
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6"><MessageSquare className="h-10 w-10 text-primary" /></div>
              <h2 className="text-2xl font-bold mb-2">Your Messages</h2>
              <p className="text-muted-foreground max-w-sm">Select a conversation or join the public chatroom to start messaging.</p>
            </div>
          )}
        </div>
      </div>

      <ProductPicker isOpen={isProductPickerOpen} onClose={() => setIsProductPickerOpen(false)} onSelect={(p) => { setAttachedProduct(p); setIsProductPickerOpen(false); }} />
      <MessageDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} message={selectedMessage} />
      <ConversationDetailsModal isOpen={isConvDetailsModalOpen} onClose={() => setIsConvDetailsModalOpen(false)} conversation={selectedConversation} />
    </div>
  );
};
