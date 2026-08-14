import { Loader2, Wallet } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InstallmentPaymentSchedule } from "@/components/shared/InstallmentPaymentSchedule";
import { planStatusConfig } from "@/modules/admin/columns/installmentColumns";
import { cn } from "@/lib/utils";
import { useGetVendorInstallmentPlanQuery } from "@/services/installmentsApi";

interface VendorInstallmentDetailsModalProps {
  planId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VendorInstallmentDetailsModal({
  planId,
  open,
  onOpenChange,
}: VendorInstallmentDetailsModalProps) {
  const { data: plan, isLoading, isError } = useGetVendorInstallmentPlanQuery(
    planId ?? "",
    { skip: !planId || !open },
  );

  const config = plan
    ? (planStatusConfig[plan.status] ?? planStatusConfig.active)
    : null;
  const percent = plan
    ? Math.min(
        Math.round((plan.paid_kobo / Math.max(plan.total_kobo, 1)) * 100),
        100,
      )
    : 0;
  const nextDue = plan?.next_due_date
    ? new Date(plan.next_due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Installment Plan Details"
      description={
        plan
          ? `Plan #${plan.id.slice(0, 8).toUpperCase()} · Order #${plan.order_id.slice(0, 8).toUpperCase()}`
          : "Loading plan…"
      }
      className="sm:max-w-lg"
      contentClassName="p-4 sm:p-5 space-y-5"
    >
      {isLoading ? (
        <div className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      ) : isError || !plan || !config ? (
        <div className="py-12 text-center space-y-3">
          <p className="text-sm font-bold text-rose-500">
            Failed to load plan details
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-sm text-[10px] font-black uppercase tracking-widest"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="rounded-sm border border-border/40 bg-card/50 backdrop-blur-sm p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-sm bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Wallet className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-foreground">
                    {plan.installments_paid}/{plan.installments_total}{" "}
                    installments paid
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {plan.mode === "auto" ? "Auto-Pay" : "Manual"} · Buyer{" "}
                    {plan.buyer_id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm border shrink-0",
                  config.className,
                )}
              >
                {config.label}
              </Badge>
            </div>

            <div>
              <div className="flex items-end justify-between mb-1.5">
                <p className="text-xl font-black text-foreground">
                  ₦{(plan.paid_kobo / 100).toLocaleString()}
                  <span className="text-sm text-muted-foreground font-semibold">
                    {" "}
                    / ₦{(plan.total_kobo / 100).toLocaleString()}
                  </span>
                </p>
                <span className="text-lg font-black text-primary">
                  {percent}%
                </span>
              </div>
              <div className="h-2 w-full rounded-sm bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {plan.status === "active" && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Next due: {nextDue ?? "—"} — delivery stays on hold until fully
                paid
              </p>
            )}
          </div>

          {/* Payment Schedule / Trail */}
          <InstallmentPaymentSchedule payments={plan.payments} />
        </>
      )}
    </Modal>
  );
}
