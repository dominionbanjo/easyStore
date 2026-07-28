import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useUpdateStoreMutation } from "@/services/storeApi";

interface EscrowToggleProps {
  storeId: string;
  escrowEnabled: boolean;
}

export function EscrowToggle({ storeId, escrowEnabled }: EscrowToggleProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingValue, setPendingValue] = useState(false);
  const [updateStore, { isLoading }] = useUpdateStoreMutation();

  const handleToggle = (checked: boolean) => {
    setPendingValue(checked);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    const formData = new FormData();
    formData.append("escrow_enabled", String(pendingValue));
    await updateStore({ id: storeId, data: formData }).unwrap();
    setShowConfirm(false);
  };

  return (
    <>
      <div className="p-4 rounded-sm border border-border/40 bg-card hover:bg-muted/30 transition-colors flex items-center gap-4 group">
        <div className="h-10 w-10 rounded-sm bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">Escrow Payments</p>
          <p className="text-xs text-muted-foreground leading-tight">
            {escrowEnabled
              ? "Buyers can pay via escrow at checkout"
              : "Buyers can only pay directly"}
          </p>
        </div>
        <Switch checked={escrowEnabled} onCheckedChange={handleToggle} />
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleConfirm}
        title={pendingValue ? "Enable Escrow Payments" : "Disable Escrow Payments"}
        description={
          pendingValue
            ? "Escrow helps build buyer trust by holding funds until delivery is confirmed. Buyers will see the escrow option during checkout."
            : "Disabling escrow may reduce buyer confidence. Buyers will only be able to pay directly, which means funds go straight to you without a holding period."
        }
        confirmText={pendingValue ? "Yes, Enable" : "Yes, Disable"}
        variant={pendingValue ? "default" : "warning"}
        isLoading={isLoading}
      />
    </>
  );
}