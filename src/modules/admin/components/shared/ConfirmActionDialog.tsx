import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmActionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmLoadingText?: string;
  /** tailwind classes for the confirm button */
  confirmVariant?: "default" | "destructive" | "outline" | "secondary";
}

export function ConfirmActionDialog({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  description,
  confirmLabel = "Confirm",
  confirmLoadingText = "Processing...",
  confirmVariant = "destructive",
}: ConfirmActionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText={confirmLoadingText}
          >
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
