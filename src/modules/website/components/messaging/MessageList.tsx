import React, { useEffect, useRef } from "react";
import type { IMessage } from "@/services/messagingApi";
import { MessageSkeleton } from "./MessageSkeleton";
import { MessageItem } from "./MessageItem";
import { MessageSquare, Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import { format, isToday, isYesterday, startOfDay } from "date-fns";
import type { RootState } from "@/store";

interface MessageListProps {
  messages: IMessage[];
  isLoading: boolean;
  typingUsers: string[];
  isChatroom?: boolean;
  onRetry?: (message: IMessage) => void;
  onShowDetails: (message: IMessage) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  typingUsers,
  isChatroom,
  onRetry,
  onShowDetails,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.user.currentUser);

  const lastMessagesLengthRef = useRef(0);

  // Immediate scroll to bottom on mount/messages change
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const isInitialLoad = lastMessagesLengthRef.current === 0 && messages.length > 0;
    const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 300;
    const lastMessage = messages[messages.length - 1];
    const sentByMe = lastMessage?.sender_id === user?.id;

    if (isInitialLoad || isNearBottom || sentByMe) {
      container.scrollTop = container.scrollHeight;
    }

    lastMessagesLengthRef.current = messages.length;
  }, [messages, typingUsers, user?.id]);

  if (isLoading && messages.length === 0) {
    return <MessageSkeleton />;
  }

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 flex flex-col custom-scrollbar bg-slate-50/30 dark:bg-neutral-900/10"
    >
      {messages.length === 0 && !isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/40">
          <div className="p-8 rounded-full bg-muted/30 mb-4 border border-border/5">
            <MessageSquare className="h-10 w-10" />
          </div>
          <p className="text-sm font-bold tracking-tight">No messages yet</p>
          <p className="text-xs mt-1 font-medium">Be the first to say hello!</p>
        </div>
      )}

      {(() => {
        const groups: { date: Date; messages: IMessage[] }[] = [];
        messages.forEach((msg) => {
          const msgDate = startOfDay(new Date(msg.created_at));
          const existingGroup = groups.find((g) => g.date.getTime() === msgDate.getTime());
          if (existingGroup) {
            existingGroup.messages.push(msg);
          } else {
            groups.push({ date: msgDate, messages: [msg] });
          }
        });

        return groups.map((group) => (
          <React.Fragment key={group.date.getTime()}>
            {/* Date Header */}
            <div className="flex items-center justify-center my-6 sticky top-0 z-10">
              <div className="px-3 py-1 rounded-sm bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-border/20 shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {isToday(group.date) 
                  ? "Today" 
                  : isYesterday(group.date) 
                    ? "Yesterday" 
                    : format(group.date, "MMMM d, yyyy")}
              </div>
            </div>

            {/* Group Messages */}
            <div className="flex flex-col gap-1">
              {group.messages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  isOwn={msg.sender_id === user?.id}
                  isChatroom={isChatroom}
                  onShowDetails={onShowDetails}
                  onRetry={onRetry}
                />
              ))}
            </div>
          </React.Fragment>
        ));
      })()}

      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground italic mb-4 animate-pulse">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></span>
          </div>
          {isChatroom && (
            typingUsers.length === 1 ? "Someone is typing..." : "Multiple people are typing..."
          )}
        </div>
      )}
    </div>
  );
};
