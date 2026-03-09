import { Truck, Info, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { IProductStore } from "@/types/product/productTypes";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";

interface BazaarBuyBoxProps {
  store: IProductStore;
  uiProduct: UIProduct;
  displayPrice: number;
  displayOriginalPrice?: number | null;
  quantity: number;
  setQuantity: (q: number) => void;
  currentStock: number;
  handleAddToCart: () => void;
  toggleWishlist: () => void;
  liked: boolean;
  addingToCart: boolean;
}

export function BazaarBuyBox({
  store,
  uiProduct,
  displayPrice,
  quantity,
  setQuantity,
  currentStock,
  handleAddToCart,
  toggleWishlist,
  liked,
  addingToCart,
}: BazaarBuyBoxProps) {
  return (
    <div className="w-full lg:w-[400px] border border-slate-200 dark:border-zinc-800 rounded-xl p-5 bg-white dark:bg-zinc-900 shadow-sm sticky top-[100px] space-y-5">
      <div className="text-2xl font-black text-slate-900 dark:text-white">
        ₦{displayPrice?.toLocaleString()}
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex gap-2">
          <Truck className="w-5 h-5 text-slate-400 shrink-0" />
          <div>
            <span className="font-bold text-green-700 dark:text-green-500 block">
              {uiProduct.shipping.shippingCost}
            </span>
            <span className="text-slate-500 block">
              Delivery outside {uiProduct.shipping.location} may vary.
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-slate-400 shrink-0" />
          <div>
            <span
              className={cn(
                "font-medium",
                currentStock > 0
                  ? "text-slate-900 dark:text-white"
                  : "text-red-600 dark:text-red-400 font-bold",
              )}
            >
              {currentStock > 0 ? "In Stock." : "Currently Out of Stock."}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-3">
        <div className="flex items-center justify-between border border-slate-300 dark:border-zinc-700 rounded-lg p-1 bg-slate-50 dark:bg-zinc-800">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-md font-bold"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-bold w-12 text-center">{quantity}</span>
          <button
            onClick={() =>
              setQuantity(Math.min(currentStock || 1, quantity + 1))
            }
            className="px-4 py-2 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-md font-bold"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          disabled={currentStock <= 0 || addingToCart}
          onClick={handleAddToCart}
          className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-full shadow-sm transition-colors text-[15px] disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-zinc-800 disabled:text-slate-400 flex items-center justify-center gap-2"
        >
          {addingToCart ? (
            <div className="h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          ) : currentStock <= 0 ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
        <button
          disabled={currentStock <= 0}
          className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-sm transition-colors text-[15px] disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>

      <div className="text-xs text-slate-500 space-y-2 pt-4 border-t border-slate-200 dark:border-zinc-800">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-slate-400">Ships from</span>
          <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
            {store.store_name} LLC
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-slate-400">Sold by</span>
          <span className="font-medium text-[var(--theme-primary)] truncate">
            {store.store_name}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-slate-400">Returns</span>
          <span className="font-medium text-[var(--theme-primary)] truncate">
            {uiProduct.shipping.returns || "Eligible"}
          </span>
        </div>
      </div>

      <Separator />
      <button
        onClick={toggleWishlist}
        className={cn(
          "w-full py-2 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2",
          liked
            ? "bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] border-[var(--theme-primary)]"
            : "hover:bg-slate-50 dark:hover:bg-zinc-800",
        )}
      >
        <Heart className={cn("w-4 h-4", liked && "fill-current")} />{" "}
        {liked ? "Saved to List" : "Add to List"}
      </button>
    </div>
  );
}
