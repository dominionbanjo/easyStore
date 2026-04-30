import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import type { IOrder } from "@/services/ordersApi";
import { Badge } from "@/components/ui/badge";

export const buildAdminOrderColumns = (): ColumnDef<IOrder>[] => [
  {
    header: "Order Ref",
    accessorKey: "id",
    cell: ({ row }) => (
      <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
        <span className="truncate max-w-[80px]">
          {row.original.id?.substring(0, 8).toUpperCase()}
        </span>
        <ExternalLink className="h-3 w-3 shrink-0" />
      </span>
    ),
  },
  {
    header: "Buyer",
    accessorKey: "buyer",
    cell: ({ row }) => (
      <div className="flex flex-col text-left min-w-[150px]">
        <span className="text-xs font-bold text-foreground truncate max-w-[180px]">
          {row.original.buyer ? `${row.original.buyer.first_name} ${row.original.buyer.last_name}` : "Guest"}
        </span>
        <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">
          {row.original.buyer?.email || "N/A"}
        </span>
      </div>
    ),
  },
  {
    header: "Store",
    accessorKey: "vendor",
    cell: ({ row }) => (
      <div className="flex flex-col text-left min-w-[150px]">
        <span className="text-xs font-bold text-foreground truncate max-w-[180px]">
          {row.original.vendor?.store?.store_name || "Unknown"}
        </span>
        <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">
          {row.original.vendor?.email || "N/A"}
        </span>
      </div>
    ),
  },
  {
    header: "Amount",
    accessorKey: "total",
    cell: ({ row }) => {
      const amount = (row.original.total || 0) / 100;
      return (
        <span className="font-black text-sm tracking-tight">
          ₦{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === "completed" || status === "delivered" || status === "paid"
              ? "default"
              : status === "pending" || status === "processing"
              ? "secondary"
              : "outline"
          }
          className="rounded-sm uppercase text-[9px] font-black tracking-widest px-2"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    header: "Payment",
    accessorKey: "payment_status",
    cell: ({ row }) => {
      const status = row.original.payment_status;
      return (
        <Badge
          variant={status === "success" ? "default" : "outline"}
          className={status === "success" ? "bg-emerald-500 hover:bg-emerald-600 rounded-sm uppercase text-[9px] font-black tracking-widest px-2" : "rounded-sm uppercase text-[9px] font-black tracking-widest px-2"}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    header: "Date",
    accessorKey: "created_at",
    cell: ({ row }) => (
      <span className="text-[11px] text-muted-foreground font-medium">
        {format(new Date(row.original.created_at), "MMM d, yyyy")}
      </span>
    ),
  },
];
