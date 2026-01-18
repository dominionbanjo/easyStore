import type { ColumnDef } from "@tanstack/react-table";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { IStoreProduct } from "@/types/product/productTypes";

export const productColumns: ColumnDef<IStoreProduct>[] = [
  /* ───────────── Product (LEFT ALIGNED) ───────────── */
  {
    accessorKey: "name",
    header: () => <div className="text-left">Product</div>,
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center gap-3 text-left">
          <img
            src={product.image?.url}
            alt={product.name}
            className="w-12 h-12 rounded-md object-cover border shrink-0"
          />
          <div className="min-w-0">
            <p className="font-medium line-clamp-1">{product.name}</p>
            <p className="text-xs text-muted-foreground">
              ID: #{product.id.slice(0, 8)}
            </p>
          </div>
        </div>
      );
    },
  },

  /* ───────────── Category (CENTERED) ───────────── */
  {
    accessorKey: "category_ref.name",
    header: () => <div className="text-center">Category</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.category_ref?.name ?? "—"}
      </div>
    ),
  },

  /* ───────────── Price (CENTERED) ───────────── */
  {
    accessorKey: "price",
    header: () => <div className="text-center">Price</div>,
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        ₦{Number(row.original.price).toLocaleString()}
      </div>
    ),
  },

  /* ───────────── Stock (CENTERED) ───────────── */
  {
    accessorKey: "stock",
    header: () => <div className="text-center">Stock</div>,
    cell: ({ row }) => (
      <div
        className={cn(
          "text-center font-medium",
          row.original.stock <= 0 ? "text-red-600" : "text-green-600",
        )}
      >
        {row.original.stock <= 0 ? "Out of Stock" : `${row.original.stock} pcs`}
      </div>
    ),
  },

  /* ───────────── Status (ACTIVE / INACTIVE) ───────────── */
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;

      const base =
        "inline-flex items-center justify-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full";

      if (status === "active") {
        return (
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={cn(
                base,
                "bg-green-50 text-green-700 border-green-200",
              )}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Active
            </Badge>
          </div>
        );
      }

      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={cn(base, "bg-red-50 text-red-700 border-red-200")}
          >
            <XCircle className="h-3.5 w-3.5" />
            Inactive
          </Badge>
        </div>
      );
    },
  },

  /* ───────────── Updated At (CENTERED) ───────────── */
  {
    accessorKey: "updated_at",
    header: () => <div className="text-center">Last Updated</div>,
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">
        {new Date(row.original.updated_at).toLocaleDateString()}
      </div>
    ),
  },

  /* ───────────── Actions (CENTERED) ───────────── */
  {
    id: "actions",
    header: () => <div className="text-center" />,
    cell: () => (
      <div className="flex justify-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    ),
  },
];
