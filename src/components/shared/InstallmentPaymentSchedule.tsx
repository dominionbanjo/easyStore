import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InstallmentPaymentView } from "@/types/installment/installmentTypes";

const paymentStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  paid: {
    label: "Paid",
    className:
      "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30",
  },
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/30",
  },
  refunded: {
    label: "Refunded",
    className:
      "bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30",
  },
};

const formatDate = (value: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

interface InstallmentPaymentScheduleProps {
  payments?: InstallmentPaymentView[];
}

export function InstallmentPaymentSchedule({
  payments = [],
}: InstallmentPaymentScheduleProps) {
  return (
    <div className="rounded-sm border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-border/40">
        <p className="text-xs font-black uppercase tracking-widest text-foreground">
          Payment Schedule
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {payments.length} installment{payments.length === 1 ? "" : "s"}
        </p>
      </div>

      {payments.length === 0 ? (
        <p className="text-sm text-muted-foreground font-medium text-center py-8">
          No payments recorded for this plan yet.
        </p>
      ) : (
        <ul className="divide-y divide-border/40">
          {payments.map((payment) => {
            const config =
              paymentStatusConfig[payment.status] ?? paymentStatusConfig.pending;
            const isLate =
              payment.status === "paid" &&
              payment.due_date &&
              payment.paid_at &&
              new Date(payment.paid_at) > new Date(payment.due_date);
            return (
              <li
                key={payment.id}
                className="flex items-start justify-between gap-3 px-3 sm:px-4 py-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-sm flex items-center justify-center shrink-0 text-[10px] font-black",
                      payment.status === "paid"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : payment.status === "refunded"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {payment.index}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-black text-foreground">
                      ₦{(payment.amount_kobo / 100).toLocaleString()}
                      {payment.fee_kobo > 0 && (
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          {" "}
                          + ₦{(payment.fee_kobo / 100).toLocaleString()} fee
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                      Due {formatDate(payment.due_date)}
                      {payment.paid_at && (
                        <>
                          {" "}
                          · Paid {formatDate(payment.paid_at)}
                          {isLate && (
                            <span className="text-amber-500"> · Late</span>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-sm border",
                      config.className,
                    )}
                  >
                    {config.label}
                  </Badge>
                  {payment.status === "paid" && (
                    <span
                      className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        isLate ? "text-amber-500" : "text-emerald-600",
                      )}
                    >
                      {isLate ? "Late" : "On Time"}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
