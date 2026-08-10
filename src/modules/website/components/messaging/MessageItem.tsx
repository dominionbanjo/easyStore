import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { IMessage } from "@/services/messagingApi";
import { format } from "date-fns";
import { Check, CheckCheck, MoreVertical, ExternalLink, Info, RotateCcw, AlertCircle, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import SmartLink from "@/components/shared/SmartLink";
import { OptimizedImage } from "@/components/shared/OptimizedImage";

interface MessageItemProps {
  message: IMessage;
  isOwn: boolean;
  isChatroom?: boolean;
  onShowDetails: (message: IMessage) => void;
  onRetry?: (message: IMessage) => void;
}

export const MessageItem = React.memo(({
  message,
  isOwn,
  isChatroom,
  onShowDetails,
  onRetry,
}: MessageItemProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col mb-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
        isOwn ? "items-end self-end" : "items-start self-start"
      )}
    >
      {!isOwn && (
        <span className="text-[10px] text-muted-foreground ml-2 mb-1">
          {message.sender.first_name} {message.sender.last_name}
        </span>
      )}

      <div
        className={cn(
          "relative group flex gap-2",
          isOwn ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div
          onClick={() => onShowDetails(message)}
          className={cn(
            "rounded-sm px-4 py-3 shadow-sm cursor-pointer hover:brightness-95 transition-all active:scale-[0.98]",
            isOwn
              ? "bg-primary text-primary-foreground"
              : "bg-white dark:bg-neutral-900 border border-border text-foreground"
          )}
        >
          {/* Content */}
          <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>

          {/* Product Attachment */}
          {message.product_id && (
            <div className={cn(
              "mt-3 p-2 rounded-sm border flex gap-3 min-w-[200px]",
              isOwn 
                ? "bg-white/10 border-white/20 text-white" 
                : "bg-muted/50 border-border text-foreground"
            )}>
              {message.product_image && (
                <OptimizedImage 
                  src={message.product_image} 
                  alt={message.product_name || ""} 
                  recipe="THUMBNAIL"
                  aspectRatio="1 / 1"
                  wrapperClassName="h-12 w-12 rounded-sm"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">
                  {message.product_name || "Product"}
                </p>
                <div className="flex mt-1">
                  <SmartLink 
                    to={`/product/${message.product_slug}`}
                    className="text-[10px] flex items-center gap-1 opacity-80 hover:opacity-100 font-medium"
                  >
                    View product <ExternalLink className="h-2 w-2" />
                  </SmartLink>
                </div>
              </div>
            </div>
          )}

          {/* Meta (Time + Status) */}
          <div className={cn(
            "flex items-center gap-1 mt-1 justify-end",
            isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            <span className="text-[10px]">
              {format(new Date(message.created_at), "HH:mm")}
            </span>
            {isOwn && !isChatroom && (
              <span className="flex">
                {message.status === "sending" ? (
                  <Loader2 className="h-2.5 w-2.5 animate-spin text-primary-foreground/50" />
                ) : message.status === "failed" ? (
                  <AlertCircle className="h-3.3 w-3 text-red-100" />
                ) : message.read_at ? (
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-300 drop-shadow-sm" />
                ) : message.delivered_at ? (
                  <CheckCheck className="h-3.5 w-3.5 text-sky-200" />
                ) : (
                  <Check className="h-3.5 w-3.5 text-white/60" />
                )}
              </span>
            )}
            {isChatroom && isOwn && (
               <span className="flex">
                 {message.status === "sending" ? (
                    <Loader2 className="h-2.5 w-2.5 animate-spin text-primary-foreground/50" />
                 ) : message.status === "failed" ? (
                    <AlertCircle className="h-3 w-3 text-red-100" />
                 ) : (
                    <span className="text-[8px] font-black tracking-tighter text-emerald-300">SENT</span>
                 )}
               </span>
            )}
            {isChatroom && message.read_count !== undefined && message.read_count > 0 && (
              <span className="text-[10px] flex items-center gap-0.5 ml-1">
                <CheckCheck className="h-3 w-3 text-emerald-400" />
                {message.read_count}
              </span>
            )}
          </div>
        </div>

        {/* Retry Button for Failed */}
        {isOwn && message.status === "failed" && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onRetry?.(message)}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 self-center"
            title="Retry sending"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}

        {/* Action Button */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
          <Popover open={showDropdown} onOpenChange={setShowDropdown}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align={isOwn ? "end" : "start"} className="w-32 p-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-xs rounded-sm h-8"
                onClick={() => {
                  setShowDropdown(false);
                  onShowDetails(message);
                }}
              >
                <Info className="h-3 w-3 mr-2" /> Message Info
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
});
