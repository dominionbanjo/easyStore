import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ProductDraftData } from "@/features/productDraftSlice";
import { Package, Trash2, History } from "lucide-react";

interface DraftRecoveryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: ProductDraftData | null;
  onContinue: () => void;
  onDiscard: () => void;
}

export function DraftRecoveryModal({
  open,
  onOpenChange,
  draft,
  onContinue,
  onDiscard,
}: DraftRecoveryModalProps) {
  if (!draft) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 via-background to-background p-8">
          <AlertDialogHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-[1.25rem] bg-primary/10 flex items-center justify-center mb-2">
              <History className="h-8 w-8 text-primary" />
            </div>
            
            <div className="text-center space-y-2">
              <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-foreground">
                Found Unfinished Draft
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground text-sm font-medium">
                You have a previous draft for <span className="text-foreground font-bold italic">"{draft.name || "Unnamed Product"}"</span>. Would you like to continue from where you left off?
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          {/* Draft Preview Snippet */}
          <div className="mt-6 p-4 rounded-2xl bg-muted/50 border border-border/40 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-background border border-border/40 flex items-center justify-center shrink-0">
                 {draft.image?.url ? (
                    <img src={draft.image.url} alt="" className="w-full h-full object-cover rounded-lg" />
                 ) : (
                    <Package className="h-5 w-5 text-muted-foreground/40" />
                 )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Last Edit</p>
                <p className="text-xs font-bold truncate">{draft.name || "Unnamed Product"}</p>
              </div>
          </div>

          <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
            <AlertDialogCancel
              onClick={onDiscard}
              className="flex-1 h-12 rounded-xl border-none bg-muted/50 hover:bg-red-50 hover:text-red-600 transition-all font-bold uppercase tracking-widest text-[10px] group"
            >
              <Trash2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Discard Draft
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onContinue}
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[10px]"
            >
              Continue Editing
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
