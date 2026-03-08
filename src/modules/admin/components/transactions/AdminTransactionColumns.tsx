import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  MoreVertical,
  Receipt,
  Wallet,
  AlertTriangle,
  XCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { IAdminTransaction } from "@/services/adminApi";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  reversed: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
};

export const buildAdminTransactionColumns = (
  onViewDetails: (tx: IAdminTransaction) => void,
  onAction: (tx: IAdminTransaction, action: "refund" | "flag") => void,
): ColumnDef<IAdminTransaction>[] => [
  {
    accessorKey: "reference",
    header: () => (
      <div className="text-left font-bold text-foreground">Reference</div>
    ),
    cell: ({ row }) => {
      const ref =
        row.original.reference || row.original.id.substring(0, 8).toUpperCase();
      return (
        <div className="text-left">
          <span className="font-mono text-xs font-semibold uppercase bg-muted/60 px-1.5 py-0.5 rounded tracking-tighter">
            {ref}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: () => (
      <div className="text-left font-bold text-foreground">Customer</div>
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user)
        return (
          <div className="text-left">
            <span className="text-muted-foreground text-xs italic">Guest</span>
          </div>
        );
      return (
        <div className="text-left min-w-[140px]">
          <p className="text-sm font-semibold text-foreground leading-none">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-xs text-muted-foreground mt-1 lowercase font-medium">
            @{user.username || "—"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "vendor",
    header: () => (
      <div className="text-left font-bold text-foreground">Vendor / Store</div>
    ),
    cell: ({ row }) => {
      const store = row.original.vendor?.store;
      if (!store)
        return (
          <div className="text-left">
            <span className="text-muted-foreground text-xs font-medium">
              Platform
            </span>
          </div>
        );
      return (
        <div className="text-left min-w-[160px]">
          <p className="text-sm font-semibold text-foreground leading-none">
            {store.store_name}
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-medium italic">
            {store.category || "—"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="capitalize font-bold text-[10px] px-2 py-0 h-5 border-border/60 bg-muted/20"
      >
        {row.original.type.replace(/_/g, " ")}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = row.original.amount / 100;
      return (
        <div className="text-right">
          <span className="font-black text-sm tracking-tight">
            <span className="text-xs text-muted-foreground mr-0.5 font-bold">
              {row.original.currency}
            </span>
            {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
            statusColors[status] || "bg-muted text-muted-foreground",
          )}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-[11px] text-muted-foreground font-medium leading-tight">
        <p className="text-foreground">
          {format(new Date(row.original.created_at), "MMM d, yyyy")}
        </p>
        <p className="opacity-70">
          {format(new Date(row.original.created_at), "HH:mm")}
        </p>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted/80"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Transaction Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => onViewDetails(row.original)}
            >
              <Eye className="h-4 w-4 text-blue-500" />
              View Full Details
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Receipt className="h-4 w-4 text-primary" />
              Print Receipt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-yellow-600 cursor-pointer"
              onClick={() => onAction(row.original, "flag")}
            >
              <AlertTriangle className="h-4 w-4" />
              Flag for Review
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-red-600 cursor-pointer font-medium"
              onClick={() => onAction(row.original, "refund")}
            >
              <XCircle className="h-4 w-4" />
              Process Refund
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
