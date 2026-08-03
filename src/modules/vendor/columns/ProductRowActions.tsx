import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { IStoreProduct } from "@/types/product/productTypes";
import { ConfirmDeleteDialog } from "../components/ConfirmDeleteDialog";
import {
  useDeleteProductMutation,
  useUpdateProductOnSaleMutation,
  useUpdateProductStatusMutation,
} from "@/services/productApi";
import { clearProductDraft } from "@/features/productDraftSlice";
import { getAppPath, getWebsitePath } from "@/utils/subdomain";
import { ProductShareAction } from "../components/dashboard/ProductShareAction";

export function ProductRowActions({ product }: { product: IStoreProduct }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
            onClick={() => {
              const path = getWebsitePath(`/product/${product.slug}`);
              if (path?.startsWith("http")) {
                window.location.href = path;
              } else if (path) {
                navigate(path);
              }
            }}
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          <ProductShareAction product={product} />

          {/* ✏️ EDIT */}

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => {
              // Clear any stale draft so the new product loads fresh
              dispatch(clearProductDraft());
              navigate(getAppPath(`/products/${product.slug}/edit`));
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
}
