import { useState } from "react";
import { Loader2, ChevronDown, Wallet } from "lucide-react";
import { useGetVendorInstallmentPlansQuery } from "@/services/installmentsApi";
import { cn } from "@/lib/utils";
import { planStatusConfig } from "@/modules/admin/columns/installmentColumns";

export function VendorInstallmentsView() {
  const { data, isLoading } = useGetVendorInstallmentPlansQuery();
  const [open, setOpen] = useState(false);

  const plans = data?.data ?? [];
  const activePlans = plans.filter((p) => p.status === "active");
  const hasPlans = plans.length > 0;

  return (
    <div className="rounded-sm border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 px-3 sm:px-4 py-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-sm bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Wallet className="h-4 w-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-widest text-foreground">
              Plans in Progress
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              {isLoading
                ? "Loading…"
                : activePlans.length > 0
                  ? `${activePlans.length} active installment plan${activePlans.length > 1 ? "s" : ""} awaiting full payment`
                  : hasPlans
                    ? "No active plans"
                    : "Buyers can pay for your installment-enabled products over time"}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="border-t border-border/40 p-3 sm:p-4 space-y-3">
          {isLoading ? (
            <div className="h-16 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            </div>
          ) : !hasPlans ? (
            <p className="text-sm text-muted-foreground font-medium text-center py-6">
              No installment plans yet. Enable installments on your products to
              let buyers pay in parts.
            </p>
          ) : (
            plans.map((plan) => {
              const percent = Math.min(
                Math.round(
                  (plan.paid_kobo / Math.max(plan.total_kobo, 1)) * 100,
                ),
                100,
              );
              const config =
                planStatusConfig[plan.status] ?? planStatusConfig.active;
              const isOverdue =
                plan.status === "active" &&
                plan.next_due_date &&
                new Date(plan.next_due_date) < new Date();
              return (
                <div
                  key={plan.id}
                  className="rounded-sm border border-border/40 bg-background p-3 sm:p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-foreground truncate">
                        Order #{plan.order_id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {plan.installments_paid}/{plan.installments_total}{" "}
                        payments · {plan.mode === "auto" ? "Auto-Pay" : "Manual"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest border",
                        config.className,
                      )}
                    >
                      {config.label}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-end justify-between mb-1">
                      <p className="text-sm font-black text-foreground">
                        ₦{(plan.paid_kobo / 100).toLocaleString()}
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          {" "}
                          / ₦{(plan.total_kobo / 100).toLocaleString()}
                        </span>
                      </p>
                      <span className="text-xs font-black text-primary">
                        {percent}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-sm bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {plan.next_due_date && (
                    <p
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        isOverdue
                          ? "text-rose-500"
                          : "text-muted-foreground",
                      )}
                    >
                      {isOverdue ? "Overdue — " : "Next due "}
                      {new Date(plan.next_due_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {isOverdue && " — delivery stays on hold until fully paid"}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
