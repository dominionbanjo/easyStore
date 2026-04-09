import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface LogoutConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function LogoutConfirmModal({
  open,
  onClose,
  onConfirm,
  isLoading,
}: LogoutConfirmModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

        {/* Modal */}
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <Card className="w-full max-w-sm rounded-sm">
            <CardHeader className="flex flex-col items-center gap-2 text-center">
              <div className="h-12 w-12 rounded-sm bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Confirm Logout</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 text-center">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to log out? You’ll need to sign in again
                to access your account.
              </p>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  disabled={isLoading}
                  onClick={onConfirm}
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
