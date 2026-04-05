import type { ColumnDef } from "@tanstack/react-table";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
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
import { useNavigate } from "react-router-dom";
import { ConfirmDeleteDialog } from "../components/ConfirmDeleteDialog";
import { useState } from "react";
import {
  useDeleteProductMutation,
  useUpdateProductOnSaleMutation,
  useUpdateProductStatusMutation,
} from "@/services/productApi";
import { useDispatch } from "react-redux";
import { clearProductDraft } from "@/features/productDraftSlice";

export const productColumns: ColumnDef<IStoreProduct>[] = [
  /* ───────────── Product (LEFT ALIGNED) ───────────── */
  {
    accessorKey: "name",
    header: () => <div className="text-left">Product</div>,
    cell: ({ row }) => {
      const product = row.original;
      const truncatedName =
        product.name.length > 18
          ? product.name.substring(0, 18) + "..."
          : product.name;

      return (
        <div className="flex items-center gap-2 text-left max-w-[140px] sm:max-w-[280px]">
          <img
            src={product.image?.url}
            alt={product.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover border shrink-0"
          />
          <div className="min-w-0 flex-1 overflow-hidden">
            <p
              className="font-semibold text-xs sm:text-sm truncate"
              title={product.name}
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
        "inline-flex items-center justify-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full";

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
    cell: ({ row }) => {
      const navigate = useNavigate();
      const dispatch = useDispatch();
      const product = row.original;

      const [open, setOpen] = useState(false);

      const [deleteProduct, { isLoading: deleting }] =
        useDeleteProductMutation();

      const [updateStatus, { isLoading: updatingStatus }] =
        useUpdateProductStatusMutation();

      const [updateOnSale, { isLoading: updatingOnSale }] =
        useUpdateProductOnSaleMutation();

      const isActive = product.status === "active";
      const isOnSale = product.on_sale === true;
      const hasDiscount = product.discount_price !== null;

      const handleDelete = async () => {
        try {
          await deleteProduct(product.id).unwrap();
          setOpen(false);
        } catch {
          // optional toast
        }
      };

      const handleToggleStatus = async () => {
        await updateStatus({
          id: product.id,
          status: isActive ? "inactive" : "active",
        }).unwrap();
      };

      const handleToggleOnSale = async () => {
        await updateOnSale({
          id: product.id,
          on_sale: !isOnSale,
        }).unwrap();
      };

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
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                <Eye className="h-4 w-4" />
                View
              </Button>

              {/* ✏️ EDIT */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  // Clear any stale draft so the new product loads fresh
                  dispatch(clearProductDraft());
                  navigate(`/products/${product.slug}/edit`);
                }}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>

              {/* 🟢 ACTIVE / 🔴 INACTIVE */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2",
                  isActive ? "text-red-600" : "text-green-600",
                )}
                disabled={updatingStatus}
                onClick={handleToggleStatus}
              >
                {isActive ? (
                  <>
                    <XCircle className="h-4 w-4" />
                    Set Inactive
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Set Active
                  </>
                )}

                {updatingStatus && (
                  <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                )}
              </Button>

              {/* 🏷️ ON SALE TOGGLE */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2",
                  isOnSale ? "text-orange-600" : "text-green-600",
                )}
                disabled={updatingOnSale || (!hasDiscount && !isOnSale)}
                onClick={handleToggleOnSale}
              >
                {isOnSale ? (
                  <>
                    <XCircle className="h-4 w-4" />
                    Remove from Sale
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Mark as On Sale
                  </>
                )}

                {updatingOnSale && (
                  <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                )}
              </Button>

              {/* 🗑 DELETE */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-destructive"
                onClick={() => setOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </PopoverContent>
          </Popover>

          {/* ❗ CONFIRM DELETE */}
          <ConfirmDeleteDialog
            open={open}
            loading={deleting}
            title="Delete product"
            description={`Are you sure you want to delete "${product.name}"?`}
            onConfirm={handleDelete}
            onClose={() => setOpen(false)}
          />
        </div>
      );
    },
  },
];
