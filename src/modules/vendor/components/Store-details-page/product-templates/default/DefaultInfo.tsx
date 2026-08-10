import { Star, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";
import { ProductShareButton } from "@/modules/website/components/products/ProductShareButton";

interface DefaultInfoProps {
  uiProduct: UIProduct;
  quantity: number;
  setQuantity: (q: number) => void;
  liked: boolean;
  selectedColor: { id: string; name: string; hex: string } | null;
  setSelectedColor: (
    color: { id: string; name: string; hex: string } | null,
  ) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  addingToCart: boolean;
  displayPrice: number;
  displayOriginalPrice: number | null | undefined;
  currentStock: number;
  selectedOptions: Record<string, string>;
  selectOption: (name: string, value: string) => void;
  handleAddToCart: () => void;
  toggleWishlist: () => void;
  onMessageVendor?: () => void;
  isMessagingLoading?: boolean;
}

export function DefaultInfo({
  uiProduct,
  quantity,
  setQuantity,
  liked,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  addingToCart,
  displayPrice,
  displayOriginalPrice,
  currentStock,
  selectedOptions,
  selectOption,
  handleAddToCart,
  toggleWishlist,
  onMessageVendor,
  isMessagingLoading,
}: DefaultInfoProps) {
  return (
    <div className="w-full px-1.5 py-6 md:p-10 lg:p-12 flex flex-col justify-center">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">
            {uiProduct.category}
          </div>
          {uiProduct.rating > 0 && (
            <div className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{uiProduct.rating.toFixed(1)}</span>
              <span>({uiProduct.reviewCount})</span>
            </div>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white mb-6 leading-[1.15] tracking-tight">
          {uiProduct.name}
        </h1>

        <div className="flex items-end gap-4 flex-wrap">
          <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--theme-primary)] tabular-nums tracking-tight">
            ₦{displayPrice?.toLocaleString()}
          </span>
          {displayOriginalPrice && (
            <span className="text-base sm:text-xl text-zinc-400 line-through tabular-nums mb-1 font-medium">
              ₦{displayOriginalPrice.toLocaleString()}
            </span>
          )}
          {displayOriginalPrice && (
            <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-sm ml-2 mb-2">
              SALE
            </span>
          )}
        </div>
      </div>

      <Separator className="my-8 bg-zinc-100 dark:bg-zinc-800" />

      {/* Variants */}
      <div className="space-y-8">
        {uiProduct.options &&
          uiProduct.options.length > 0 &&
          uiProduct.options.map((option) => (
            <div key={option.name}>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
                {option.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {option.values.map((value) => (
                  <button
                    key={value}
                    onClick={() => selectOption(option.name, value)}
                    className={`min-w-[4rem] px-6 py-3 rounded-sm text-sm font-bold transition-all  ${
                      selectedOptions[option.name] === value
                        ? "bg-[var(--theme-primary)] text-white -[var(--theme-primary)]/25"
                        : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-[var(--theme-primary)]/50"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

        {uiProduct.colors.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                Color
              </h3>
              <span className="text-sm text-zinc-500 font-medium">
                {uiProduct.colors.find((c) => c.id === selectedColor?.id)?.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              {uiProduct.colors.map(
                (color: { id: string; name: string; hex: string }) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-sm border-2 transition-all ${
                      selectedColor?.id === color.id
                        ? "border-[var(--theme-primary)] ring-2 ring-[var(--theme-primary)]/10 scale-110 "
                        : "border-slate-200 dark:border-zinc-800 hover:border-slate-300"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name}
                  />
                ),
              )}
            </div>
          </div>
        )}

        {uiProduct.sizes.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
              Size
            </h3>
            <div className="flex flex-wrap gap-3">
              {uiProduct.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[4rem] px-6 py-3 rounded-sm text-sm font-bold transition-all  ${
                    selectedSize === size
                      ? "bg-[var(--theme-primary)] text-white -[var(--theme-primary)]/25"
                      : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-[var(--theme-primary)]/50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-6 mt-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center justify-between border-2 border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 p-1 w-full sm:w-40 shrink-0 h-11 sm:h-12">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-base text-zinc-900 dark:text-white w-10 text-center">
              {quantity}
            </span>
            <button
              onClick={() =>
                setQuantity(Math.min(currentStock || 1, quantity + 1))
              }
              className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 border-2 border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 p-1">
            <button
              disabled={currentStock <= 0 || addingToCart}
              onClick={handleAddToCart}
              className="w-full h-11 sm:h-12 bg-[var(--theme-primary)] text-white font-bold text-sm sm:text-base rounded-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 disabled:translate-y-0 disabled:"
            >
              {addingToCart ? (
                <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white rounded-sm animate-spin" />
              ) : currentStock <= 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onMessageVendor}
          disabled={isMessagingLoading}
          className="w-full h-11 sm:h-12 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold rounded-sm hover:border-[var(--theme-primary)] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {isMessagingLoading ? (
            <div className="h-5 w-5 border-2 border-[var(--theme-primary)] border-t-transparent rounded-sm animate-spin" />
          ) : (
            "Message Vendor"
          )}
        </button>

        <div className="flex items-center justify-center sm:justify-start gap-4 pt-2">
          <button
            onClick={toggleWishlist}
            className={cn(
              "flex items-center gap-2 text-sm font-semibold transition-colors",
              liked
                ? "text-[var(--theme-primary)]"
                : "text-zinc-500 hover:text-[var(--theme-primary)]",
            )}
          >
            <Heart className={cn("w-4 h-4", liked && "fill-current")} />
            {liked ? "Saved to Wishlist" : "Save for Later"}
          </button>
          <div className="w-1 h-1 rounded-sm bg-zinc-300 dark:bg-zinc-700" />
          <ProductShareButton
            product={{
              id: uiProduct.id,
              name: uiProduct.name,
              price: displayPrice,
              originalPrice: displayOriginalPrice,
              image: uiProduct.images[0],
              vendor: uiProduct.vendor || "EazyStore",
              storeSlug: uiProduct.storeSlug || "",
              slug: uiProduct.slug,
            }}
            variant="ghost"
            label="Share Product"
            className="h-auto p-0 hover:bg-transparent text-zinc-500 hover:text-[var(--theme-primary)] font-semibold text-sm gap-2"
          />
        </div>

        {/* Stock Indicator */}
        <div
          className={`text-sm font-medium flex items-center gap-2 ${currentStock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
        >
          <div
            className={`w-2 h-2 rounded-sm ${currentStock > 0 ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
          />
          {currentStock > 0
            ? `${currentStock} items available`
            : "Out of stock"}
        </div>
      </div>
    </div>
  );
}
