import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { 
  ArrowUpRight, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { IPayout } from "@/services/payoutsApi";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500",
  },
  pending_manual: {
    label: "Pending",
    icon: Clock,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500",
  },
  success: {
    label: "Paid",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500",
  },
  failed: {
    label: "Failed",
    icon: AlertCircle,
    className: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500",
  },
  reversed: {
    label: "Reversed",
    icon: AlertCircle,
    className: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-500",
  },
};

export const createPayoutColumns = (
  onViewDetails?: (payout: IPayout) => void,
  onViewOrder?: (orderId: string) => void,
): ColumnDef<IPayout>[] => [
  {
    accessorKey: "id",
    header: "Reference",
    cell: ({ row }) => {
      const payout = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-bold text-sm font-mono truncate max-w-[120px]">
            {payout.transfer_reference 
              ? `#${payout.transfer_reference.slice(0, 8).toUpperCase()}` 
              : `PAY-${payout.id.slice(0, 8).toUpperCase()}`}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
            Order #{payout.order_id?.slice(0, 8).toUpperCase() || "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-black text-sm text-foreground">
        ₦{(row.original.amount / 100).toLocaleString()}
      </span>
    ),
  },
  {
    id: "order_type",
    header: "Type",
    cell: ({ row }) => {
      const payout = row.original;
      const isEscrow = !!payout.escrow_id || payout.payout_type === "manual";
      return (
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border",
          isEscrow 
            ? "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" 
            : "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        )}>
          {isEscrow ? "Escrow" : "Direct"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
      const Icon = config.icon;
      return (
        <Badge variant="secondary" className={cn("gap-1.5 font-bold uppercase tracking-tighter px-2 h-6", config.className)}>
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "payout_type",
    header: "Method",
    cell: ({ row }) => (
      <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest bg-muted/40 px-2 py-0.5 rounded-full">
        {row.original.payout_type}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {format(new Date(row.original.created_at), "MMM dd, yyyy")}
        </span>
        <span className="text-xs text-muted-foreground">
          {format(new Date(row.original.created_at), "hh:mm a")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const payout = row.original;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1.5 space-y-1 rounded-sm border-border/40">
              <DropdownMenuItem 
                className="gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer"
                onClick={() => onViewDetails?.(payout)}
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                Details
              </DropdownMenuItem>
              {payout.order_id && (
                <DropdownMenuItem 
                  className="gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer"
                  onClick={() => onViewOrder?.(payout.order_id!)}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Order
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
