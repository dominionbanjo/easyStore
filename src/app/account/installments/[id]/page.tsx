import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import { useGetMyInstallmentPlanQuery } from "@/services/installmentsApi";
import { InstallmentPlanCard } from "@/modules/website/components/orders/InstallmentPlanCard";
import { InstallmentPaymentSchedule } from "@/components/shared/InstallmentPaymentSchedule";
import { Button } from "@/components/ui/button";
import { ACCOUNT_ROUTES } from "@/routes";

export default function InstallmentDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: plan, isLoading, isError } = useGetMyInstallmentPlanQuery(
    id ?? "",
    { skip: !id },
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/20 transition-colors duration-300">
        <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
          <div className="h-5 w-24 bg-muted rounded-sm animate-pulse" />
          <div className="p-6 rounded-sm border border-border/40 space-y-4 animate-pulse">
            <div className="h-4 w-1/2 bg-muted rounded-sm" />
            <div className="h-2 w-full bg-muted rounded-sm" />
            <div className="h-10 w-full bg-muted rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 space-y-4">
        <p className="text-sm font-bold text-rose-500">
          Payment plan unavailable
        </p>
        <Link to={ACCOUNT_ROUTES.INSTALLMENTS}>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-sm text-[10px] font-black uppercase tracking-widest"
          >
            Back to My Installments
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/20 transition-colors duration-300">
      <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="space-y-6 sm:space-y-8 max-w-2xl">
          {/* Back + Title */}
          <div className="flex items-center justify-between gap-4">
            <Link
              to={ACCOUNT_ROUTES.INSTALLMENTS}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              My Installments
            </Link>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Plan #{plan.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Payment Plan
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Track your balance, see when each installment is due, and pay
              ahead anytime.
            </p>
          </div>

          {/* Plan Summary + Actions */}
          <InstallmentPlanCard planId={plan.id} />

          {/* Full Payment Schedule / Trail */}
          <InstallmentPaymentSchedule payments={plan.payments} />

          {/* Order Link */}
          <Link
            to={`${ACCOUNT_ROUTES.ORDERS}/${plan.order_id}`}
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors py-2"
          >
            <Package className="h-4 w-4" />
            View Related Order
          </Link>
        </div>
      </div>
    </div>
  );
}
