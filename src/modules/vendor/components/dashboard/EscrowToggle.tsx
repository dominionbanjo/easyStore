import { useState } from "react";
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
      <div className="flex items-start justify-between w-full gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold">Escrow Payments</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed mt-1 max-w-xl">
            When enabled, buyers can choose escrow at checkout — funds are
            held safely by us until they confirm delivery, then released to
            you. This builds buyer trust and protects you against disputes.
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