import type { ColumnDef } from "@tanstack/react-table";
import type { SalesRecord } from "@/services/salesHistoryApi";

export const salesHistoryColumns: ColumnDef<SalesRecord>[] = [
  {
    id: "date",
    header: "Date",
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{new Date(row.original.created_at).toLocaleDateString()}</span>,
  },
  {
    id: "time",
    header: "Time",
    cell: ({ row }) => <span className="text-sm">{new Date(row.original.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>,
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.items;
      const count = items?.reduce((sum: number, i: { quantity: number }) => sum + i.quantity, 0) ?? 0;
      const names = items?.slice(0, 2).map((i: { name: string }) => i.name).join(", ") ?? "";
      return (
        <div>
          <span className="text-sm font-medium">{count} item{count !== 1 ? "s" : ""}</span>
          {names && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{names}{items?.length > 2 ? "..." : ""}</p>}
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => <span className="text-sm font-semibold">₦{(row.original.total / 100).toLocaleString()}</span>,
  },
  {
    accessorKey: "staff_name",
    header: "Staff",
    cell: ({ row }) => <span className="text-sm">{row.original.staff_name || "Vendor"}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => <span className="text-sm">{new Date(row.original.created_at).toLocaleString()}</span>,
  },
];
