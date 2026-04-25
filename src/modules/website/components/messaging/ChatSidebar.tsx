import React from "react";
import { cn } from "@/lib/utils";
import { Search, MessageSquare, Users, ChevronDown } from "lucide-react";
import type { IConversation } from "@/services/messagingApi";
import { formatDistanceToNow } from "date-fns";

interface ChatSidebarProps {
  conversations: IConversation[];
  activeConversationId: string | "chatroom" | null;
  onSelect: (id: string | "chatroom") => void;
  onlineUsers: Set<string>;
  chatroomUserCount: number;
  onShowConversationDetails: (conv: IConversation) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversationId,
  onSelect,
  onlineUsers,
  chatroomUserCount,
  onShowConversationDetails,
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-950 border-r border-border w-full lg:min-w-[300px] lg:max-w-[350px]">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Messages
        </h2>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-9 pr-4 py-2 bg-muted/30 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Public Chatroom Item */}
        <div
          onClick={() => onSelect("chatroom")}
          className={cn(
            "p-4 cursor-pointer transition-colors border-b border-border/50",
            activeConversationId === "chatroom"
              ? "bg-primary/10 border-l-4 border-l-primary"
              : "hover:bg-muted/50 border-l-4 border-l-transparent"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-sm bg-primary/20 flex items-center justify-center text-primary relative">
              <Users className="h-6 w-6" />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white dark:border-neutral-950 rounded-full py-0.5 px-1.5 text-[10px] text-white font-bold">
                {chatroomUserCount}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm truncate">Public Chatroom</h3>
              </div>
              <p className="text-xs text-muted-foreground truncate italic">
                Join the global community
              </p>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="px-4 py-2 text-[10px] uppercase font-bold text-muted-foreground tracking-wider bg-muted/20">
          Direct Messages
        </div>

        {conversations.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No conversations yet
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                if (activeConversationId === conv.id) {
                  onShowConversationDetails(conv);
                } else {
                  onSelect(conv.id);
                }
              }}
              className={cn(
                "p-4 cursor-pointer transition-colors border-b border-border/50",
                activeConversationId === conv.id
                  ? "bg-primary/10 border-l-4 border-l-primary"
                  : "hover:bg-muted/50 border-l-4 border-l-transparent"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="h-12 w-12 rounded-sm overflow-hidden border border-border">
                    {conv.other_participant.avatar ? (
                      <img
                        src={conv.other_participant.avatar}
                        alt={conv.other_participant.first_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center text-sm font-bold uppercase">
                        {conv.other_participant.first_name?.[0] || "?"}
                      </div>
                    )}
                  </div>
                  {onlineUsers.has(conv.other_participant.id) && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-white dark:border-neutral-950 rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex flex-col min-w-0">
                      <h3 className="font-bold text-sm truncate">
                        {conv.other_participant.first_name} {conv.other_participant.last_name}
                      </h3>
                      {conv.other_participant.store_name && (
                        <p className="text-[10px] text-primary/80 font-black uppercase tracking-widest truncate leading-tight">
                          {conv.other_participant.store_name}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {conv.last_message_at && (
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: false })}
                        </span>
                      )}
                      {activeConversationId === conv.id && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onShowConversationDetails(conv);
                          }}
                          className="p-1 hover:bg-primary/20 rounded-sm transition-colors text-primary"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                      "text-xs truncate",
                      conv.unread_count > 0 ? "text-foreground font-bold" : "text-muted-foreground"
                    )}>
                      {conv.last_message_preview || "No messages yet"}
                    </p>
                    {conv.unread_count > 0 && (
                      <div className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm min-w-[18px] text-center">
                        {conv.unread_count}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
