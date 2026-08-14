import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { createInstallmentPlanColumns } from "@/modules/admin/columns/installmentColumns";
import {
  useGetAdminInstallmentPlansQuery,
  useForceCompletePlanMutation,
  useForceCancelPlanMutation,
} from "@/services/installmentsApi";
import type { InstallmentPlanView } from "@/types/installment/installmentTypes";
import { extractErrorMessage } from "@/utils/errorHandler";

export default function AdminInstallmentsPage() {
  const { data, isLoading, isError, refetch } =
    useGetAdminInstallmentPlansQuery();
  const [forceComplete] = useForceCompletePlanMutation();
  const [forceCancel] = useForceCancelPlanMutation();

  const handleForceComplete = async (plan: InstallmentPlanView) => {
    if (
      !window.confirm(
        `Force-complete plan ${plan.id.slice(0, 8).toUpperCase()}? Use only when the buyer paid outside the system.`,
      )
    ) {
      return;
    }
    try {
      await forceComplete(plan.id).unwrap();
      toast.success("Plan force-completed");
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to complete plan"));
    }
  };

  const handleForceCancel = async (plan: InstallmentPlanView) => {
    if (
      !window.confirm(
        `Force-cancel plan ${plan.id.slice(0, 8).toUpperCase()}? All paid installments will be refunded.`,
      )
    ) {
      return;
    }
    try {
      await forceCancel(plan.id).unwrap();
      toast.success("Plan canceled — refunds initiated");
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to cancel plan"));
    }
  };
  const columns = createInstallmentPlanColumns(
    undefined,
    handleForceComplete,
    handleForceCancel,
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="h-9 rounded-sm text-[10px] font-black uppercase tracking-widest"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-2" />
          Refresh
        </Button>
      </div>

      <Card className="rounded-sm border-border/40">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : isError ? (
            <div className="h-64 flex items-center justify-center text-sm font-bold text-rose-500">
              Failed to load installment plans
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data?.data ?? []}
              isLoading={isLoading}
              emptyMessage="No installment plans yet"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
