import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InstallmentPlanView } from "@/types/installment/installmentTypes";
import { cn } from "@/lib/utils";

export const planStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className:
      "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30",
  },
  completed: {
    label: "Completed",
    className:
      "bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30",
  },
  defaulted: {
    label: "Defaulted",
    className:
      "bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30",
  },
  canceled: {
    label: "Canceled",
    className:
      "bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30",
  },
  refunding: {
    label: "Refunding",
    className:
      "bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/30",
  },
};

export const createInstallmentPlanColumns = (
  onView?: (plan: InstallmentPlanView) => void,
  onForceComplete?: (plan: InstallmentPlanView) => void,
  onForceCancel?: (plan: InstallmentPlanView) => void,
): ColumnDef<InstallmentPlanView>[] => [
  {
    accessorKey: "id",
    header: () => <div className="text-left">Plan / Order</div>,
    cell: ({ row }) => {
      const plan = row.original;
      return (
        <div className="text-left">
          <p className="font-semibold text-sm">{plan.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
            Order #{plan.order_id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "buyer",
    header: () => <div className="text-left">Buyer / Vendor</div>,
    cell: ({ row }) => {
      const plan = row.original;
      return (
        <div className="text-left">
          <p className="text-sm">Buyer {plan.buyer_id.slice(0, 8).toUpperCase()}</p>
          <p className="text-[10px] text-muted-foreground">
            Vendor {plan.vendor_id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "progress",
    header: () => <div className="text-left">Progress</div>,
    cell: ({ row }) => {
      const plan = row.original;
      const percent = Math.min(
        Math.round((plan.paid_kobo / Math.max(plan.total_kobo, 1)) * 100),
        100,
      );
      return (
        <div className="text-left min-w-[140px]">
          <p className="text-xs font-bold">
            ₦{(plan.paid_kobo / 100).toLocaleString()} / ₦
            {(plan.total_kobo / 100).toLocaleString()}
          </p>
          <div className="h-1.5 w-full rounded-sm bg-muted mt-1 overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {plan.installments_paid}/{plan.installments_total} payments
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => {
      const plan = row.original;
      const config = planStatusConfig[plan.status] ?? planStatusConfig.active;
      return (
        <Badge
          variant="outline"
          className={cn(
            "px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm border",
            config.className,
          )}
        >
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "next_due_date",
    header: () => <div className="text-left">Next Due</div>,
    cell: ({ row }) => {
      const plan = row.original;
      return (
        <p className="text-xs font-medium">
          {plan.next_due_date
            ? new Date(plan.next_due_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "—"}
        </p>
      );
    },
  },
  {
    accessorKey: "mode",
    header: () => <div className="text-left">Mode</div>,
    cell: ({ row }) => {
      const plan = row.original;
      return (
        <Badge
          variant="outline"
          className="text-[10px] font-bold uppercase tracking-widest rounded-sm"
        >
          {plan.mode === "auto" ? "Auto-Pay" : "Manual"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const plan = row.original;
      const isActive = plan.status === "active";
      return (
        <div className="flex items-center justify-end gap-1.5">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-[10px] font-black uppercase tracking-widest"
              onClick={() => onView(plan)}
            >
              View
            </Button>
          )}
          {isActive && onForceComplete && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-[10px] font-black uppercase tracking-widest text-emerald-600"
              onClick={() => onForceComplete(plan)}
            >
              Complete
            </Button>
          )}
          {isActive && onForceCancel && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-[10px] font-black uppercase tracking-widest text-rose-600"
              onClick={() => onForceCancel(plan)}
            >
              Refund
            </Button>
          )}
        </div>
      );
    },
  },
];
