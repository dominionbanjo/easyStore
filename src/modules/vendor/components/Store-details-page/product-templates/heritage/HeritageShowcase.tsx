import { ShieldCheck, RotateCcw, Heart, Minus, Plus } from "lucide-react";
import ProductGallery from "@/modules/website/components/products/ProductGallery";
import { cn } from "@/lib/utils";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";

interface HeritageShowcaseProps {
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
}

export function HeritageShowcase({
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
}: HeritageShowcaseProps) {
  return (
    <div className="bg-white dark:bg-[#1E1A17] rounded-sm md:rounded-sm px-1 py-6 md:p-12 lg:p-16 -[#3D352B]/5 border border-[#EADDCE] dark:border-[#3D352B]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery: Gentle Borders */}
        <div className="w-full">
          <div className="rounded-sm overflow-hidden border border-[#EADDCE] dark:border-[#3D352B] bg-[#FAF7F2] dark:bg-[#2C2622] p-2">
            <ProductGallery images={uiProduct.images} />
          </div>
        </div>

        {/* Info Container */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2C2622] dark:text-white leading-[1.15] mb-4">
              {uiProduct.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <div className="flex items-center gap-4 text-2xl text-[var(--theme-primary)] font-bold">
                <span>₦{displayPrice?.toLocaleString()}</span>
                {displayOriginalPrice && (
                  <span className="text-base text-[#8C7A6B] line-through font-normal">
                    ₦{displayOriginalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-widest px-3 py-1 rounded-sm border",
                  currentStock > 0
                    ? "border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/10"
                    : "border-red-200 text-red-700 bg-red-50 dark:bg-red-900/10 font-bold",
                )}
              >
                {currentStock > 0 ? "Handcrafted: Available" : "Sold Out"}
              </span>
            </div>
          </div>

          <div className="prose prose-stone dark:prose-invert font-sans text-[#5C5042] dark:text-[#C4BCB3] leading-relaxed">
            <p>{uiProduct.description}</p>
          </div>

          {/* Artisanal Separator */}
          <div className="flex items-center justify-center gap-4 py-4 opacity-50">
            <div className="w-16 h-[1px] bg-[#8C7A6B]" />
            <span className="text-2xl text-[#8C7A6B]">✺</span>
            <div className="w-16 h-[1px] bg-[#8C7A6B]" />
          </div>

          {/* Handcrafted Variants */}
          <div className="space-y-6 font-sans">
            {uiProduct.options &&
              uiProduct.options.length > 0 &&
              uiProduct.options.map((option) => (
                <div key={option.name}>
                  <span className="text-sm font-bold text-[#2C2622] dark:text-white block mb-3 uppercase tracking-widest">
                    {option.name}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        onClick={() => selectOption(option.name, value)}
                        className={`px-6 py-2.5 rounded-sm text-sm font-medium transition-all border ${
                          selectedOptions[option.name] === value
                            ? "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)] "
                            : "bg-[#FAF7F2] dark:bg-[#2C2622] text-[#5C5042] dark:text-[#EAE3DB] border-[#EADDCE] dark:border-[#5C5042] hover:bg-white dark:hover:bg-[#3D352B]"
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
                <span className="text-sm font-bold text-[#2C2622] dark:text-white block mb-3 uppercase tracking-widest">
                  Colorways
                </span>
                <div className="flex flex-wrap gap-3">
                  {uiProduct.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-sm border-4 transition-all ${
                        selectedColor?.id === color.id
                          ? "border-white dark:border-[#1E1A17] ring-2 ring-[var(--theme-primary)] scale-110 "
                          : "border-transparent ring-1 ring-[#EADDCE] dark:ring-[#3D352B]"
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
                <span className="text-sm font-bold text-[#2C2622] dark:text-white block mb-3 uppercase tracking-widest">
                  Proportions
                </span>
                <div className="flex flex-wrap gap-2">
                  {uiProduct.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2.5 rounded-sm text-sm font-medium transition-all border ${
                        selectedSize === size
                          ? "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)] "
                          : "bg-[#FAF7F2] dark:bg-[#2C2622] text-[#5C5042] dark:text-[#EAE3DB] border-[#EADDCE] dark:border-[#5C5042] hover:bg-white dark:hover:bg-[#3D352B]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Basket Actions */}
          <div className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
              <div className="flex items-center justify-between border-2 border-[#EADDCE] dark:border-[#5C5042] rounded-sm px-2 py-1 bg-[#FAF7F2] dark:bg-[#2C2622] h-16 md:h-auto">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-sm hover:bg-[#EADDCE] dark:hover:bg-[#3D352B] flex items-center justify-center font-bold text-[#5C5042] dark:text-[#EAE3DB] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold font-sans text-lg w-10 text-center text-[#2C2622] dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(currentStock || 1, quantity + 1))
                  }
                  className="w-10 h-10 rounded-sm hover:bg-[#EADDCE] dark:hover:bg-[#3D352B] flex items-center justify-center font-bold text-[#5C5042] dark:text-[#EAE3DB] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                disabled={currentStock <= 0 || addingToCart}
                onClick={handleAddToCart}
                className="w-full h-16 px-8 bg-[var(--theme-primary)] text-white font-bold rounded-sm font-sans tracking-wide uppercase  -[var(--theme-primary)]/20 hover:opacity-90 transition-all hover:translate-y-[-2px] hover: flex items-center justify-center gap-2 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-500 disabled: disabled:translate-y-0"
              >
                {addingToCart ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-sm animate-spin" />
                ) : currentStock <= 0 ? (
                  "Sold Out"
                ) : (
                  <>
                    Add to Basket — ₦
                    {((displayPrice || 0) * quantity).toLocaleString()}
                  </>
                )}
              </button>
            </div>

            <button
              onClick={toggleWishlist}
              className={cn(
                "w-full py-2 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold transition-all",
                liked
                  ? "text-[var(--theme-primary)]"
                  : "text-[#8C7A6B] hover:text-[#2C2622]",
              )}
            >
              <Heart className={cn("w-4 h-4", liked && "fill-current")} />
              {liked ? "Applied to Wishlist" : "Wishlist"}
            </button>
          </div>

          {/* Handcrafted Details */}
          <div className="pt-8 border-t border-[#EADDCE] dark:border-[#3D352B] grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-sans">
            <div className="flex gap-3 text-[#5C5042] dark:text-[#C4BCB3]">
              <ShieldCheck className="w-5 h-5 text-[var(--theme-primary)] shrink-0" />
              <p>Crafted with care, authenticity guaranteed.</p>
            </div>
            <div className="flex gap-3 text-[#5C5042] dark:text-[#C4BCB3]">
              <RotateCcw className="w-5 h-5 text-[var(--theme-primary)] shrink-0" />
              <p>Returns accepted within standard period.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
