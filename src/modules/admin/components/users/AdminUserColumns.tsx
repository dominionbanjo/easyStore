import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IAdminUser } from "@/services/adminApi";
import { UserRowActions } from "./UserRowActions";

const statusColors: Record<string, string> = {
  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  restricted:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  banned: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  pending: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
};

export const buildAdminUserColumns = (
  onViewDetails: (id: string) => void,
): ColumnDef<IAdminUser>[] => [
  {
    accessorKey: "name",
    header: () => (
      <div className="text-left font-bold text-foreground">User details</div>
    ),
    cell: ({ row }) => {
      const first = row.original.first_name || "";
      const last = row.original.last_name || "";
      const name = `${first} ${last}`.trim();
      return (
        <div className="text-left">
          <p className="font-semibold text-sm">{name || "Anonymous User"}</p>
          <p className="text-xs text-muted-foreground">
            @{row.original.username || "—"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => (
      <div className="text-left font-bold text-foreground">Email</div>
    ),
    cell: ({ row }) => (
      <div className="text-left">
        <span className="text-sm text-muted-foreground">
          {row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "account_type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize text-sm">{row.original.account_type}</span>
    ),
  },
  {
    accessorKey: "account_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.account_status || "pending";
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
    accessorKey: "email_verified",
    header: "Verified",
    cell: ({ row }) =>
      row.original.email_verified ? (
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <ShieldCheck className="h-3.5 w-3.5" /> Yes
        </span>
      ) : (
        <span className="flex items-center gap-1 text-muted-foreground text-xs">
          <AlertTriangle className="h-3.5 w-3.5" /> No
        </span>
      ),
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
        <UserRowActions user={row.original} onViewDetails={onViewDetails} />
      </div>
    ),
  },
];
