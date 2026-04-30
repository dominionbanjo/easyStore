import { ShoppingCart, Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";
import { ProductShareButton } from "@/modules/website/components/products/ProductShareButton";

interface VanguardMainProps {
  uiProduct: UIProduct;
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

export function VanguardMain({
  uiProduct,
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
}: VanguardMainProps) {
  return (
    <main className="max-w-[1400px] mx-auto px-1.5 sm:px-6 pt-6 sm:pt-8 md:px-12 pb-16 font-sans">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Left: Sticky Info */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-8 self-start space-y-10 order-2 lg:order-1">
          <div>
            <p className="text-[var(--theme-primary)] font-medium mb-3 tracking-widest uppercase text-xs">
              {uiProduct.category}
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-zinc-900 dark:text-white mb-6 leading-tight font-serif">
              {uiProduct.name}
            </h1>
            <div className="flex items-end gap-4 text-2xl font-light">
              <span className="text-zinc-900 dark:text-white">
                ₦{displayPrice?.toLocaleString()}
              </span>
              {displayOriginalPrice && (
                <span className="text-zinc-400 line-through text-lg mb-0.5">
                  ₦{displayOriginalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {/* Stock status */}
            <div className="mt-4 flex items-center gap-2">
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-sm",
                  currentStock > 0 ? "bg-emerald-500" : "bg-red-500",
                )}
              />
              <span
                className={cn(
                  "text-[10px] tracking-widest uppercase font-medium",
                  currentStock > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500 dark:text-red-300",
                )}
              >
                {currentStock > 0 ? "Available Now" : "Currently Out of Stock"}
              </span>
            </div>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
            {uiProduct.description}
          </p>

          <div className="space-y-8 pt-6 border-t border-zinc-100 dark:border-zinc-900">
            {/* Dynamic Product Options */}
            {uiProduct.options &&
              uiProduct.options.length > 0 &&
              uiProduct.options.map((option) => (
                <div key={option.name}>
                  <h3 className="text-xs tracking-widest uppercase font-medium mb-4 text-zinc-400">
                    {option.name}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        onClick={() => selectOption(option.name, value)}
                        className={`min-w-[4rem] px-4 py-2 border rounded-none text-[10px] tracking-[0.2em] uppercase transition-all ${
                          selectedOptions[option.name] === value
                            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                            : "bg-transparent text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 font-light"
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
                <h3 className="text-xs tracking-widest uppercase font-medium mb-4 text-zinc-400">
                  Color
                </h3>
                <div className="flex flex-wrap gap-4">
                  {uiProduct.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-sm border transition-all ${
                        selectedColor?.id === color.id
                          ? "border-zinc-900 dark:border-white scale-110 "
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {uiProduct.sizes.length > 0 && (
              <div>
                <h3 className="text-xs tracking-widest uppercase font-medium mb-4 text-zinc-400">
                  Size
                </h3>
                <div className="flex flex-wrap gap-3">
                  {uiProduct.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-4 py-2 border rounded-none text-xs tracking-widest uppercase transition-all ${
                        selectedSize === size
                          ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                          : "bg-transparent text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 flex flex-col gap-4">
            <button
              disabled={currentStock <= 0 || addingToCart}
              onClick={handleAddToCart}
              className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors uppercase tracking-[0.2em] text-sm font-medium disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-500 dark:disabled:text-zinc-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {addingToCart ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-sm animate-spin" />
              ) : currentStock <= 0 ? (
                "OUT OF STOCK"
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart — ₦{displayPrice?.toLocaleString()}
                </>
              )}
            </button>
            <button
              onClick={onMessageVendor}
              disabled={isMessagingLoading}
              className="w-full py-4 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors uppercase tracking-[0.2em] text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isMessagingLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Message Vendor"
              )}
            </button>
            <div className="flex items-center justify-between mt-4 border-t border-zinc-100 dark:border-zinc-900 pt-6">
              <button
                onClick={toggleWishlist}
                className={cn(
                  "flex items-center gap-2 text-xs uppercase tracking-widest transition-colors",
                  liked
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white",
                )}
              >
                <Heart className={cn("w-4 h-4", liked && "fill-current")} />{" "}
                {liked ? "Saved" : "Save"}
              </button>
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
                label="Share"
                className="h-auto p-0 hover:bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium text-xs uppercase tracking-widest gap-2"
              />
            </div>
          </div>
        </div>

        {/* Right: Oversized Images */}
        <div className="w-full lg:w-2/3 space-y-4 order-1 lg:order-2">
          {uiProduct.images.length > 0 ? (
            uiProduct.images.map((img: string, idx: number) => (
              <div
                key={idx}
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 flex justify-center"
              >
                <img
                  src={img}
                  alt={`${uiProduct.name} - View ${idx + 1}`}
                  className="w-full object-cover max-h-[800px]"
                />
              </div>
            ))
          ) : (
            <div className="w-full aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
              <span className="font-serif text-zinc-400">
                No Image Available
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
