import { Truck, Info, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
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
  onMessageVendor?: () => void;
  isMessagingLoading?: boolean;
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
  onMessageVendor,
  isMessagingLoading,
}: BazaarBuyBoxProps) {
  return (
    <div className="w-full lg:w-[380px] xl:w-[420px] border border-slate-200/50 dark:border-neutral-800/50 rounded-sm px-6 py-8 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl sticky top-28 space-y-8 flex-shrink-0 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="space-y-1">
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Purchase</span>
        <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          ₦{displayPrice?.toLocaleString()}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-sm border border-indigo-100 dark:border-indigo-900/20">
          <Truck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div className="space-y-1">
            <span className="text-sm font-black text-indigo-700 dark:text-indigo-400 block uppercase tracking-wide">
              Priority Shipping
            </span>
            <span className="text-xs text-indigo-600/80 dark:text-indigo-400/60 block font-bold">
              Dispatching from {uiProduct.shipping.location}.
            </span>
          </div>
        </div>
        
        <div className="flex gap-4 p-4 bg-slate-50 dark:bg-neutral-800/50 rounded-sm border border-slate-100 dark:border-neutral-800/50">
          <Info className="w-6 h-6 text-slate-400 shrink-0" />
          <div className="space-y-1">
            <span
              className={cn(
                "text-sm font-black uppercase tracking-wide block",
                currentStock > 0
                  ? "text-slate-900 dark:text-white"
                  : "text-red-500",
              )}
            >
              {currentStock > 0 ? "Stock Available" : "Out of Stock"}
            </span>
             <span className="text-xs text-slate-400 block font-bold">
              {currentStock > 0 ? `Currently ${currentStock} units left.` : "Check back later for restock."}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between bg-slate-100 dark:bg-neutral-800 rounded-sm p-1.5 border border-slate-200 dark:border-neutral-800">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 flex items-center justify-center hover:bg-white dark:hover:bg-neutral-700 rounded-sm transition-all shadow-sm active:scale-95"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-black text-lg w-12 text-center">{quantity}</span>
          <button
            onClick={() =>
              setQuantity(Math.min(currentStock || 1, quantity + 1))
            }
            className="w-12 h-12 flex items-center justify-center hover:bg-white dark:hover:bg-neutral-700 rounded-sm transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          disabled={currentStock <= 0 || addingToCart}
          onClick={handleAddToCart}
          className="w-full py-4 bg-indigo-600 hover:opacity-90 text-white font-black rounded-sm transition-all text-base shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 disabled:bg-slate-200 dark:disabled:bg-neutral-800 disabled:text-slate-400 flex items-center justify-center gap-3"
        >
          {addingToCart ? (
            <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
          ) : currentStock <= 0 ? (
            "OUT OF STOCK"
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              ADD TO CART
            </>
          )}
        </button>
        
        <button
          disabled={currentStock <= 0}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-sm transition-all text-base shadow-lg active:scale-[0.98] disabled:opacity-50"
        >
          BUY IT NOW
        </button>

        <button
          onClick={onMessageVendor}
          disabled={isMessagingLoading}
          className="w-full py-4 border-2 border-slate-200 dark:border-neutral-800 hover:border-indigo-600 text-slate-800 dark:text-white font-black rounded-sm transition-all text-base active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isMessagingLoading ? (
             <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            "MESSAGE VENDOR"
          )}
        </button>
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-neutral-800">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <span className="text-slate-400">Sold by</span>
          <span className="text-indigo-600">{store.store_name}</span>
        </div>
         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <span className="text-slate-400">Returns</span>
          <span className="text-slate-700 dark:text-neutral-300">{uiProduct.shipping.returns || "30-Day Policy"}</span>
        </div>
      </div>

      <button
        onClick={toggleWishlist}
        className={cn(
          "w-full py-3 border rounded-sm text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95",
          liked
            ? "bg-indigo-600/10 text-indigo-600 border-indigo-600/30"
            : "border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-500",
        )}
      >
        <Heart className={cn("w-4 h-4", liked && "fill-current")} />{" "}
        {liked ? "Saved to Collection" : "Save for Later"}
      </button>
    </div>
  );
}
