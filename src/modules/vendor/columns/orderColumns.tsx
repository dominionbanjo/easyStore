import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Eye, Truck, CheckCircle2, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import type { IOrder } from "@/services/ordersApi";
import { getStatusConfig } from "../utils/statusUtils";

export const createOrderColumns = (
  onViewDetails?: (order: IOrder) => void,
): ColumnDef<IOrder>[] => [
  /* ───────────── Order ID (LEFT ALIGNED) ───────────── */
  {
    accessorKey: "id",
    header: () => <div className="text-left">Order ID</div>,
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="text-left max-w-[100px] sm:max-w-none">
          <p className="font-semibold text-xs sm:text-sm">
            #{order.id.slice(0, 8)}
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      );
    },
  },

  /* ───────────── Items (CENTERED) ───────────── */
  {
    accessorKey: "order_items",
    header: () => <div className="text-center">Items</div>,
    cell: ({ row }) => {
      const items = row.original.order_items;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        ₦{(Number(row.original.total) / 100).toLocaleString()}
      </div>
    ),
  },

  /* ───────────── Payment Status (CENTERED) ───────────── */
  {
    accessorKey: "payment_status",
    header: () => <div className="text-center">Payment</div>,
    cell: ({ row }) => {
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
    cell: ({ row }) => {
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
    cell: ({ row }) => {
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
    cell: ({ row }) => {
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
