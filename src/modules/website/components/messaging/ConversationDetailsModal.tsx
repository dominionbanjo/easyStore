import React from "react";
import { Modal } from "@/components/shared/Modal";
import type { IConversation } from "@/services/messagingApi";
import { 
  Store, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  MapPin,
  Calendar,
  Globe
} from "lucide-react";
import SmartLink from "@/components/shared/SmartLink";
import { format } from "date-fns";

interface ConversationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: IConversation | null;
}

export const ConversationDetailsModal: React.FC<ConversationDetailsModalProps> = ({
  isOpen,
  onClose,
  conversation,
}) => {
  if (!conversation) return null;
  const participant = conversation.other_participant;

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Chat Information"
      description="Details about your conversation and participant."
      className="max-w-[450px]"
    >
      <div className="flex flex-col gap-6 p-1">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-black/20 rounded-sm border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          
          <div className="h-24 w-24 rounded-full border-4 border-white dark:border-neutral-900 shadow-md overflow-hidden mb-4">
            {participant.avatar ? (
              <img src={participant.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-primary/10 flex items-center justify-center text-2xl font-black text-primary uppercase">
                {participant.first_name[0]}{participant.last_name[0]}
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-black">
            {participant.first_name} {participant.last_name}
          </h3>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
            @{participant.username} · {participant.account_type}
          </p>

          {participant.store_name && (
            <div className="mt-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-sm">
               <div className="flex items-center gap-2 text-primary font-black uppercase tracking-tighter text-[11px]">
                  <Store className="h-3.5 w-3.5" />
                  {participant.store_name}
               </div>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/20 rounded-sm border border-border/50">
            <span className="text-[9px] font-black uppercase text-muted-foreground block mb-1">Unread Messages</span>
            <span className="text-lg font-black text-primary">{conversation.unread_count || 0}</span>
          </div>
          <div className="p-3 bg-muted/20 rounded-sm border border-border/50">
            <span className="text-[9px] font-black uppercase text-muted-foreground block mb-1">Chat Started</span>
            <span className="text-xs font-black">{format(new Date(conversation.created_at), "MMM d, yyyy")}</span>
          </div>
        </div>

        {/* Store Access Section */}
        {participant.store_name && (
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block px-1">Vendor Actions</span>
            <SmartLink
              to={`/store/${participant.username}`}
              className="group flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border-2 border-primary/20 hover:border-primary rounded-sm transition-all shadow-sm"
              onClick={onClose}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary rounded-sm flex items-center justify-center text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black group-hover:text-primary transition-colors">Visit Official Store</p>
                  <p className="text-[10px] font-medium text-muted-foreground">View products, menus, and more</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-primary/40 group-hover:text-primary transition-colors" />
            </SmartLink>
          </div>
        )}

        {/* Quick Info */}
        <div className="space-y-2 px-1">
          <div className="flex items-center gap-3 text-xs py-2 border-b border-border/50">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="font-bold">Verified Eazystore User</span>
          </div>
          <div className="flex items-center gap-3 text-xs py-2 border-b border-border/50">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">Joined Eazystore {format(new Date(participant.created_at || new Date()), "MMMM yyyy")}</span>
          </div>
          <div className="flex items-center gap-3 text-xs py-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">Location data private for security</span>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-sm border border-amber-100 dark:border-amber-900/50 flex gap-3">
           <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
           <p className="text-[10px] leading-relaxed text-amber-900/80 dark:text-amber-200/80 font-medium">
             Keep your transactions on Eazystore to ensure purchase protection and safe delivery.
           </p>
        </div>
      </div>
    </Modal>
  );
};
