import { Minus, Plus, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";
import { ProductShareButton } from "@/modules/website/components/products/ProductShareButton";

interface TitanInfoProps {
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

export function TitanInfo({
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
}: TitanInfoProps) {
  return (
    <div className="border border-zinc-800 bg-zinc-900/40 px-2.5 py-6 sm:p-6 rounded-sm relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--theme-primary)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

      <div className="text-[10px] text-[var(--theme-primary)] mb-4 flex justify-between">
        <span>ID: {uiProduct.id.toUpperCase()}</span>
        <span className={cn(currentStock <= 0 && "text-red-500 font-bold")}>
          STATUS: {currentStock > 0 ? "ONLINE" : "DEPLETED (OUT OF STOCK)"}
        </span>
      </div>

      <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white uppercase leading-none tracking-tight mb-2">
        {uiProduct.name}
      </h1>

      <div className="text-[var(--theme-primary)] flex items-end gap-3 mt-6 mb-8 font-bold tracking-tight flex-wrap">
        <span className="text-2xl sm:text-3xl md:text-4xl text-white">
          ₦{displayPrice?.toLocaleString()}
        </span>
        {displayOriginalPrice && (
          <span className="text-sm text-zinc-500 line-through mb-1">
            ₦{displayOriginalPrice.toLocaleString()}
          </span>
        )}
      </div>

      <div className="text-sm leading-relaxed text-zinc-400 border-l-2 border-zinc-800 pl-4 mb-8">
        {uiProduct.description}
      </div>

      {/* Config Options */}
      <div className="space-y-6">
        {uiProduct.options &&
          uiProduct.options.length > 0 &&
          uiProduct.options.map((option) => (
            <div key={option.name} className="space-y-3">
              <div className="text-xs text-zinc-500 uppercase flex justify-between">
                <span>PARAM: {option.name.toUpperCase()}</span>
                <span className="text-white">
                  {selectedOptions[option.name] || "NULL"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => (
                  <button
                    key={value}
                    onClick={() => selectOption(option.name, value)}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase transition-all border ${
                      selectedOptions[option.name] === value
                        ? "bg-[var(--theme-primary)] text-black border-[var(--theme-primary)]"
                        : "bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-white"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

        {uiProduct.colors.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs text-zinc-500 uppercase flex justify-between">
              <span>PARAM: COLOR</span>
              <span className="text-white">
                {uiProduct.colors.find((c) => c.id === selectedColor?.id)?.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {uiProduct.colors.map(
                (color: { id: string; name: string; hex: string }) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 flex items-center justify-center transition-all ${
                      selectedColor?.id === color.id
                        ? "border border-[var(--theme-primary)] scale-110"
                        : "border border-zinc-700 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div
                      className="w-5 h-5"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {uiProduct.sizes.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs text-zinc-500 uppercase flex justify-between">
              <span>PARAM: DIMENSION</span>
              <span className="text-white">{selectedSize || "NULL"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {uiProduct.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase transition-all border ${
                    selectedSize === size
                      ? "bg-[var(--theme-primary)] text-black border-[var(--theme-primary)]"
                      : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Execute (Cart) */}
      <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col gap-4">
        <div className="flex items-center justify-between border border-zinc-800 p-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-bold text-white text-base sm:text-lg">{quantity}</span>
          <button
            onClick={() =>
              setQuantity(Math.min(currentStock || 1, quantity + 1))
            }
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button
          disabled={currentStock <= 0 || addingToCart}
          onClick={handleAddToCart}
          className="w-full py-3 sm:py-4 bg-[var(--theme-primary)] text-black font-black uppercase tracking-widest hover:bg-[var(--theme-primary)]/80 transition-colors flex items-center justify-center gap-3 group disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:border-zinc-700"
        >
          {addingToCart ? (
            <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-sm animate-spin" />
          ) : currentStock <= 0 ? (
            <span>STOCK DEPLETED</span>
          ) : (
            <>
              <span>Execute: Add to Cart</span>
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </>
          )}
        </button>

        <button
          onClick={onMessageVendor}
          disabled={isMessagingLoading}
          className="w-full py-2.5 sm:py-3 border border-zinc-800 text-[10px] font-mono tracking-[0.2em] uppercase hover:bg-zinc-800/50 hover:border-[var(--theme-primary)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {isMessagingLoading ? (
             <div className="h-4 w-4 border-2 border-[var(--theme-primary)] border-t-transparent rounded-sm animate-spin" />
          ) : (
            <>
              <span>COMMS_INITIATE: MESSAGE VENDOR</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={toggleWishlist}
            className={cn(
              "py-2 border border-zinc-800 hover:bg-zinc-900 text-xs flex items-center justify-center gap-2 uppercase transition-colors",
              liked
                ? "text-[var(--theme-primary)] border-[var(--theme-primary)]"
                : "text-zinc-500",
            )}
          >
            <Heart className={cn("w-3 h-3", liked && "fill-current")} />{" "}
            {liked ? "Saved" : "Save Config"}
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
            label="Export Link"
            className="h-auto py-2 border border-zinc-800 hover:bg-zinc-900 text-xs text-zinc-500 hover:text-white uppercase transition-colors rounded-none gap-2"
            iconClassName="w-3 h-3"
          />
        </div>
      </div>
    </div>
  );
}
