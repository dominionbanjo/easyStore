import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useUpdateStoreMutation } from "@/services/storeApi";

interface InstallmentsToggleProps {
  storeId: string;
  installmentsEnabled: boolean;
}

export function InstallmentsToggle({
  storeId,
  installmentsEnabled,
}: InstallmentsToggleProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingValue, setPendingValue] = useState(false);
  const [updateStore, { isLoading }] = useUpdateStoreMutation();

  const handleToggle = (checked: boolean) => {
    setPendingValue(checked);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    const formData = new FormData();
    formData.append("installments_enabled", String(pendingValue));
    await updateStore({ id: storeId, data: formData }).unwrap();
    setShowConfirm(false);
  };

  return (
    <>
      <div className="flex items-start justify-between w-full gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold">Pay in Installments</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed mt-1 max-w-xl">
            When enabled, buyers can start installment plans at checkout —
            they pay a deposit now and the rest on a schedule (auto-pay or
            manual with reminders). The product stays reserved for them and
            you only ship once it is fully paid. Then turn on Installments on
            each product you want to offer it for.
          </p>
        </div>
        <Switch
          checked={installmentsEnabled}
          onCheckedChange={handleToggle}
        />
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleConfirm}
        title={
          pendingValue ? "Enable Installments" : "Disable Installments"
        }
        description={
          pendingValue
            ? "Buyers will be able to pay in parts at checkout for your installment-enabled products. You ship only when the plan is fully paid."
            : "Disabling installments stops buyers from starting new plans. Existing active plans keep running to completion as agreed."
        }
        confirmText={pendingValue ? "Yes, Enable" : "Yes, Disable"}
        variant={pendingValue ? "default" : "warning"}
        isLoading={isLoading}
      />
    </>
  );
}
