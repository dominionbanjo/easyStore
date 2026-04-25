import React from "react";
import { Modal } from "@/components/shared/Modal";
import type { IMessage } from "@/services/messagingApi";
import { format } from "date-fns";
import { 
  Check, 
  CheckCheck, 
  Clock, 
  User, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink
} from "lucide-react";
import SmartLink from "@/components/shared/SmartLink";

interface MessageDetailsModalProps {
  message: IMessage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MessageDetailsModal: React.FC<MessageDetailsModalProps> = ({
  message,
  isOpen,
  onClose,
}) => {
  if (!message) return null;

  const getStatusLabel = () => {
    if (message.status === "sending") return "Sending...";
    if (message.status === "failed") return "Failed to send";
    if (message.read_at) return "Read";
    if (message.delivered_at) return "Delivered";
    return "Sent";
  };

  const getStatusIcon = () => {
    if (message.status === "sending") return <Clock className="h-4 w-4 text-amber-500" />;
    if (message.status === "failed") return <ShieldCheck className="h-4 w-4 text-red-500" />;
    if (message.read_at) return <CheckCheck className="h-4 w-4 text-emerald-500" />;
    if (message.delivered_at) return <CheckCheck className="h-4 w-4 text-sky-500" />;
    return <Check className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Message Details"
      description="Detailed information about this message."
      className="max-w-[400px]"
    >
      <div className="p-1 flex flex-col gap-6">
        {/* Status Section */}
        <div className="bg-muted/30 rounded-sm p-4 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-neutral-900 rounded-sm border border-border shadow-sm">
              {getStatusIcon()}
              <span className="text-xs font-bold">{getStatusLabel()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" /> Sent
              </span>
              <span className="font-bold">{format(new Date(message.created_at), "MMM d, yyyy · HH:mm")}</span>
            </div>

            {message.delivered_at && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium flex items-center gap-2 text-sky-500">
                  <CheckCheck className="h-3.5 w-3.5 text-sky-500" /> Delivered
                </span>
                <span className="font-bold">{format(new Date(message.delivered_at), "HH:mm")}</span>
              </div>
            )}

            {message.read_at && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium flex items-center gap-2 text-emerald-500">
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> Read
                </span>
                <span className="font-bold">{format(new Date(message.read_at), "HH:mm")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sender Section */}
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block px-1">Sender</span>
          <div className="flex items-center gap-3 p-3 rounded-sm border border-border bg-white dark:bg-neutral-900">
            <div className="h-10 w-10 rounded-sm bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">{message.sender.first_name} {message.sender.last_name}</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                {message.sender.account_type} {message.sender.store_name ? `· ${message.sender.store_name}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block px-1">Message Content</span>
          <div className="p-4 rounded-sm border border-border bg-slate-50/50 dark:bg-black/20 text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {message.content}
          </div>
        </div>

        {/* Product Attachment if any */}
        {message.product_id && (
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block px-1">Attached Product</span>
            <SmartLink
              to={`/product/${message.product_slug}`}
              className="flex items-center gap-4 p-3 rounded-sm border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group"
            >
              {message.product_image && (
                <img src={message.product_image} alt="" className="h-12 w-12 rounded-sm object-cover border border-border" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">
                  {message.product_name}
                </p>
                <p className="text-[10px] flex items-center gap-1 text-primary font-bold uppercase tracking-widest mt-0.5">
                  View Link <ExternalLink className="h-2.5 w-2.5" />
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-primary/40" />
            </SmartLink>
          </div>
        )}
      </div>
    </Modal>
  );
};
