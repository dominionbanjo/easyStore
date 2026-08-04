import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IStoreProduct } from "@/types/product/productTypes";
import { ProductRowActions } from "./ProductRowActions";

export const productColumns: ColumnDef<IStoreProduct>[] = [
  /* ───────────── Product (LEFT ALIGNED) ───────────── */
  {
    accessorKey: "name",
    header: () => <div className="text-left">Product</div>,
    cell: ({ row }) => {
      const product = row.original;
      const displayName = product.name || "Untitled draft";
      const truncatedName =
        displayName.length > 18
          ? displayName.substring(0, 18) + "..."
          : displayName;

      return (
        <div className="flex items-center gap-2 text-left max-w-[140px] sm:max-w-[280px]">
          {product.image?.url ? (
            <img
              src={product.image.url}
              alt={displayName}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm object-cover border shrink-0"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm object-cover border shrink-0 bg-muted flex items-center justify-center text-muted-foreground/40">
              <FileText className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0 flex-1 overflow-hidden">
            <p
              className="font-semibold text-xs sm:text-sm truncate"
              title={displayName}
            >
              {truncatedName}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              ID: #{product.id.slice(0, 8)}
            </p>
          </div>
        </div>
      );
    },
    size: 140,
  },

  /* ───────────── Category (LEFT ALIGNED) ───────────── */
  {
    accessorKey: "category_ref.name",
    header: () => <div className="text-left">Category</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.category_ref?.name ?? "—"}</div>
    ),
    size: 150,
  },

  /* ───────────── Price (CENTERED) ───────────── */
  {
    accessorKey: "price",
    header: () => <div className="text-center">Price</div>,
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        {row.original.price != null
          ? `₦${Number(row.original.price).toLocaleString()}`
          : "—"}
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
          row.original.is_out_of_stock ? "text-red-600" : "text-green-600",
        )}
      >
        {row.original.is_out_of_stock
          ? "Out of Stock"
          : `${row.original.stock} pcs`}
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
        "inline-flex items-center justify-center gap-1.5 text-xs font-medium px-2 py-1 rounded-sm";

      if (status === "active") {
        return (
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={cn(
                base,
                "bg-emerald-100 text-emerald-800 border-emerald-200",
              )}
            >
              <CheckCircle className="h-3 w-3" />
              Active
            </Badge>
          </div>
        );
      }

      if (status === "draft") {
        return (
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={cn(base, "bg-amber-50 text-amber-700 border-amber-200")}
            >
              <FileText className="h-3 w-3" />
              Draft
            </Badge>
          </div>
        );
      }

      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={cn(base, "bg-rose-50 text-rose-700 border-rose-100")}
          >
            <XCircle className="h-3 w-3" />
            Hidden
          </Badge>
        </div>
      );
    },
  },
  /* ───────────── On Sale (CENTERED) ───────────── */
  {
    accessorKey: "on_sale",
    header: () => <div className="text-center">On Sale</div>,
    cell: ({ row }) => {
      const onSale = row.original.on_sale;

      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={cn(
              "font-medium",
              onSale
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-50 text-slate-600 border-slate-200",
            )}
          >
            {onSale ? "True" : "False"}
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
    cell: ({ row }) => <ProductRowActions product={row.original} />,
  },
];
