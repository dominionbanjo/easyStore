import type { ColumnDef } from "@tanstack/react-table";
import {
  MoreVertical,
  Eye,
  Truck,
  CheckCircle2,
  Package,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import type { IOrder } from "@/services/ordersApi";
import { getStatusConfig } from "../utils/statusUtils";

const CopyableRef = ({ value }: { value: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    toast.success("Reference copied");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5 group/id">
      <span className="font-semibold text-xs sm:text-sm">
        #{value.slice(0, 8).toUpperCase()}
      </span>
      <button
        onClick={handleCopy}
        className="p-1 opacity-0 group-hover/id:opacity-100 hover:bg-muted rounded-sm transition-all text-muted-foreground hover:text-foreground"
      >
        {isCopied ? (
          <Check className="h-3 w-3 text-emerald-600" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </button>
    </div>
  );
};

export const createOrderColumns = (
  onViewDetails?: (order: IOrder) => void,
): ColumnDef<IOrder>[] => [
  /* ───────────── Order ID (LEFT ALIGNED) ───────────── */
  {
    accessorKey: "id",
    header: () => <div className="text-left">Reference</div>,
    cell: ({ row }: { row: any }) => {
      const order = row.original;
      const ref = order.payment_reference || order.id;

      return (
        <div className="text-left">
          <CopyableRef value={ref} />
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      );
    },
  },

  /* ───────────── Customer (LEFT ALIGNED) ───────────── */
  {
    accessorKey: "buyer",
    header: () => <div className="text-left">Customer</div>,
    cell: ({ row }: { row: any }) => {
      const buyer = row.original.buyer;

      return (
        <div className="text-left">
          {buyer ? (
            <>
              <p className="font-semibold text-sm">
                {buyer.first_name} {buyer.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                {buyer.email}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Guest/Unknown</p>
          )}
        </div>
      );
    },
  },

  /* ───────────── Items (CENTERED) ───────────── */
  {
    accessorKey: "order_items",
    header: () => <div className="text-center">Items</div>,
    cell: ({ row }: { row: any }) => {
      const items = row.original.order_items;
      const totalItems = items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0,
      );

      return (
        <div className="flex justify-center">
          <Badge variant="outline" className="gap-1.5">
            <Package className="h-3 w-3" />
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </Badge>
        </div>
      );
    },
  },

  /* ───────────── Total (CENTERED) ───────────── */
  {
    accessorKey: "total",
    header: () => <div className="text-center">Total</div>,
    cell: ({ row }: { row: any }) => (
      <div className="text-center font-semibold">
        ₦{(Number(row.original.total) / 100).toLocaleString()}
      </div>
    ),
  },

  /* ───────────── Payment Status (CENTERED) ───────────── */
  {
    accessorKey: "payment_status",
    header: () => <div className="text-center">Payment</div>,
    cell: ({ row }: { row: any }) => {
      const status = row.original.payment_status;
      const config = getStatusConfig(status, "payment");
      const Icon = config.icon;

      return (
        <div className="flex justify-center">
          <Badge variant="outline" className={config.className}>
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      );
    },
  },

  /* ───────────── Order Status (CENTERED) ───────────── */
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }: { row: any }) => {
      const status = row.original.status;
      const config = getStatusConfig(status, "order");
      const Icon = config.icon;

      return (
        <div className="flex justify-center">
          <Badge variant="outline" className={config.className}>
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      );
    },
  },

  /* ───────────── Delivery Status (CENTERED) ───────────── */
  {
    accessorKey: "delivery.delivery_status",
    header: () => <div className="text-center">Delivery</div>,
    cell: ({ row }: { row: any }) => {
      const delivery = row.original.delivery;

      if (!delivery) {
        return (
          <div className="text-center text-muted-foreground text-xs">—</div>
        );
      }

      const status = delivery.delivery_status;
      const config = getStatusConfig(status, "delivery");
      const Icon = config.icon;

      return (
        <div className="flex justify-center">
          <Badge variant="outline" className={config.className}>
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      );
    },
  },

  /* ───────────── Actions (CENTERED) ───────────── */
  {
    id: "actions",
    header: () => <div className="text-center" />,
    cell: ({ row }: { row: any }) => {
      const order = row.original;

      return (
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-48 p-1.5 space-y-1">
              {/* 👁 VIEW */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => onViewDetails?.(order)}
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>

              {/* 📦 MARK AS SHIPPED */}
              {(order.status === "paid" || order.status === "processing") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-blue-600"
                >
                  <Truck className="h-4 w-4" />
                  Mark as Shipped
                </Button>
              )}

              {/* ✅ MARK AS DELIVERED */}
              {order.status === "shipped" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-green-600"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark as Delivered
                </Button>
              )}
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  },
];
