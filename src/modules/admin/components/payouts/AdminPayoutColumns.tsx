import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import type { IAdminPayout } from "@/services/adminApi";
import { cn } from "@/lib/utils";

export const buildAdminPayoutColumns = (
  onAction?: (payout: IAdminPayout) => void,
  isHistory: boolean = false
): ColumnDef<IAdminPayout>[] => {
  const columns: ColumnDef<IAdminPayout>[] = [
    {
      header: "Vendor",
      accessorKey: "vendor",
      cell: ({ row }) => {
        const vendor = row.original.vendor;
        const bank = row.original.vendor_bank;
        return (
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm text-foreground">
              {bank?.store_name || "Unknown Store"}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest truncate max-w-[150px]">
              {vendor?.email}
            </span>
          </div>
        );
      },
    },
    {
      header: "Bank Details",
      accessorKey: "vendor_bank",
      cell: ({ row }) => {
        const bank = row.original.vendor_bank;
        if (!bank)
          return <span className="text-muted-foreground italic text-xs">No details</span>;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-black uppercase tracking-tight truncate max-w-[180px]">
              {bank.account_name || "N/A"}
            </span>
            <span className="text-[11px] font-bold text-primary">
              {bank.account_number} — {bank.bank_name}
            </span>
          </div>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount_kobo",
      cell: ({ row }) => {
        const payout = row.original;
        // amount_kobo is the canonical column for the admin list
        const rawAmount = payout.amount_kobo || 0;
        const amount = rawAmount / 100;
        return (
          <span className="font-black text-sm text-emerald-600">
            ₦{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      header: isHistory ? "Paid At" : "Requested At",
      accessorKey: isHistory ? "updated_at" : "created_at",
      cell: ({ row }) => {
        const dateVal = isHistory ? row.original.updated_at : row.original.created_at;
        let formattedDate = "N/A";
        
        if (dateVal) {
          try {
            formattedDate = format(new Date(dateVal), "MMM d, yyyy HH:mm");
          } catch {
            console.error("Invalid date value:", dateVal);
          }
        }

        return (
          <span className="text-xs font-medium text-muted-foreground">
            {formattedDate}
          </span>
        );
      },
    },
  ];

  if (!isHistory && onAction) {
    columns.push({
      header: "Action",
      id: "actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="default"
          className="h-8 rounded-sm text-[10px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onAction(row.original);
          }}
        >
          Mark Paid
        </Button>
      ),
    });
  } else if (isHistory) {
      columns.push({
          header: "Status",
          accessorKey: "status",
          cell: ({ row }) => {
              const status = row.original.status;
              return (
                  <span className={cn(
                      "px-2 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-widest",
                      status === "success" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : status === "failed" || status === "reversed"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                  )}>
                      {status.replace(/_/g, " ")}
                  </span>
              )
          }
      })
  }

  return columns;
};
