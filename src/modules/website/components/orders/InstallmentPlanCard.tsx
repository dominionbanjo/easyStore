import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Wallet,
  CreditCard,
  CalendarClock,
  XCircle,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetMyInstallmentPlanQuery,
  usePayInstallmentMutation,
  usePayoffInstallmentMutation,
  useCancelInstallmentPlanMutation,
} from "@/services/installmentsApi";
import { extractErrorMessage } from "@/utils/errorHandler";

interface InstallmentPlanCardProps {
  planId: string;
}

const planStatusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  active: {
    label: "Active Plan",
    color: "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30",
    icon: <Wallet className="h-3.5 w-3.5" />,
  },
  completed: {
    label: "Fully Paid",
    color: "bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  defaulted: {
    label: "Defaulted & Refunded",
    color: "bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30",
    icon: <ShieldAlert className="h-3.5 w-3.5" />,
  },
  canceled: {
    label: "Canceled & Refunded",
    color: "bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  refunding: {
    label: "Refunding…",
    color: "bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/30",
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  },
};

export function InstallmentPlanCard({ planId }: InstallmentPlanCardProps) {
  const navigate = useNavigate();
  const { data: plan, isLoading, isError } = useGetMyInstallmentPlanQuery(
    planId,
  );
  const [pay, { isLoading: isPaying }] = usePayInstallmentMutation();
  const [payoff, { isLoading: isPayingOff }] = usePayoffInstallmentMutation();
  const [cancel, { isLoading: isCanceling }] = useCancelInstallmentPlanMutation();

  const redirectToPayment = (paymentUrl?: string) => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      toast.error("Payment link unavailable — please try again");
    }
  };

  const handlePay = async () => {
    try {
      const result = await pay(planId).unwrap();
      redirectToPayment(result.payment_url);
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to initialize payment"));
    }
  };

  const handlePayoff = async () => {
    try {
      const result = await payoff(planId).unwrap();
      redirectToPayment(result.payment_url);
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to initialize payoff"));
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this plan? All money paid will be refunded to your original payment method.")) {
      return;
    }
    try {
      await cancel(planId).unwrap();
      toast.success("Plan canceled — refund initiated");
      navigate("/account/orders", { replace: true });
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to cancel plan"));
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 rounded-sm border-border/40 space-y-4 animate-pulse">
        <div className="h-4 w-1/2 bg-muted rounded-sm" />
        <div className="h-2 w-full bg-muted rounded-sm" />
        <div className="h-10 w-full bg-muted rounded-sm" />
      </Card>
    );
  }

  if (isError || !plan) {
    return (
      <Card className="p-6 rounded-sm border-border/40 text-center space-y-2">
        <p className="text-sm font-bold text-muted-foreground">
          Payment plan unavailable
        </p>
      </Card>
    );
  }

  const config = planStatusConfig[plan.status] ?? planStatusConfig.active;
  const percent = Math.min(
    Math.round((plan.paid_kobo / Math.max(plan.total_kobo, 1)) * 100),
    100,
  );
  const isActive = plan.status === "active";
  const nextDue =
    plan.next_due_date
      ? new Date(plan.next_due_date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  return (
    <Card className="p-6 rounded-sm border-border/40 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Payment Plan
        </p>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${config.color}`}
        >
          {config.icon}
          {config.label}
        </span>
      </div>

      <div>
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-xl font-black text-foreground">
              ₦{(plan.paid_kobo / 100).toLocaleString()}
              <span className="text-sm text-muted-foreground font-semibold">
                {" "}
                / ₦{(plan.total_kobo / 100).toLocaleString()}
              </span>
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">
              {plan.installments_paid} of {plan.installments_total} installments
              paid · {plan.mode === "auto" ? "Auto-Pay" : "Manual"}
            </p>
          </div>
          <span className="text-2xl font-black text-primary">{percent}%</span>
        </div>
        <div className="h-2 w-full rounded-sm bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {isActive && (
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted/40 border border-border/40 px-3 py-2 rounded-sm">
          <CalendarClock className="h-4 w-4 text-primary shrink-0" />
          Next installment due: {nextDue}
        </div>
      )}

      {!isActive && (
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
          {plan.status === "completed"
            ? "This plan is fully paid. The vendor has been notified and your order is being prepared."
            : "This plan was ended. Any money paid has been (or is being) refunded to your original payment method, and the product is back on the market."}
        </p>
      )}

      {isActive && (
        <div className="space-y-2.5">
          <Button
            onClick={handlePay}
            disabled={isPaying || isPayingOff}
            className="w-full h-11 rounded-sm text-xs font-black uppercase tracking-widest bg-primary hover:bg-primary/90"
          >
            {isPaying ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CreditCard className="h-4 w-4 mr-2" />
            )}
            Pay Next Installment
          </Button>
          <Button
            variant="outline"
            onClick={handlePayoff}
            disabled={isPaying || isPayingOff}
            className="w-full h-11 rounded-sm text-xs font-black uppercase tracking-widest"
          >
            {isPayingOff ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Wallet className="h-4 w-4 mr-2" />
            )}
            Pay Remaining Balance
          </Button>
          <button
            onClick={handleCancel}
            disabled={isCanceling}
            className="w-full text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors py-2"
          >
            {isCanceling ? "Canceling…" : "Cancel Plan (Full Refund)"}
          </button>
        </div>
      )}
    </Card>
  );
}
