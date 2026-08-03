import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IAdminUser } from "@/services/adminApi";
import { VendorRowActions } from "./VendorRowActions";

const statusColors: Record<string, string> = {
  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  restricted:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  banned: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  pending: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
};

export const buildAdminVendorColumns = (
  onViewDetails: (id: string) => void,
): ColumnDef<IAdminUser>[] => [
  {
    accessorKey: "store_name",
    header: () => (
      <div className="text-left font-bold text-foreground">Store</div>
    ),
    cell: ({ row }) => {
      const store = row.original.store;
      return (
        <div className="flex items-center gap-3 text-left">
          <div className="h-9 w-9 rounded-sm bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden border border-border/20">
            {store?.logo ? (
              <img
                src={store.logo}
                alt={store.store_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Store className="h-5 w-5 text-muted-foreground/50" />
            )}
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-sm text-foreground tracking-tight">
              {store?.store_name || "No Store"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "owner",
    header: () => (
      <div className="text-left font-bold text-foreground">Owner</div>
    ),
    cell: ({ row }) => {
      const first = row.original.first_name || "";
      const last = row.original.last_name || "";
      return (
        <div className="text-left">
          <p className="text-sm font-bold text-foreground">
            {`${first} ${last}`.trim() || "Unknown"}
          </p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "store.status",
    header: "Store Status",
    cell: ({ row }) => {
      const status = row.original.store?.status || "pending";
      return (
        <span
          className={cn(
            "px-2 py-1 rounded-sm text-xs font-semibold",
            statusColors[status],
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const store = row.original.store;
      return (
        <span className="text-sm text-muted-foreground">
          {[store?.address_city, store?.address_state, store?.address_country]
            .filter(Boolean)
            .join(", ") || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => format(new Date(row.original.created_at), "MMM d, yyyy"),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <VendorRowActions user={row.original} onViewDetails={onViewDetails} />
      </div>
    ),
  },
];
