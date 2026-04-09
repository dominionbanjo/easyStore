import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductGallery from "@/modules/website/components/products/ProductGallery";
import type { IProductStore } from "@/types/product/productTypes";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";

interface BazaarProductInfoProps {
  store: IProductStore;
  uiProduct: UIProduct;
  displayPrice: number;
  displayOriginalPrice: number | null | undefined;
  liked: boolean;
  selectedColor: { id: string; name: string; hex: string } | null;
  setSelectedColor: (
    color: { id: string; name: string; hex: string } | null,
  ) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  selectedOptions: Record<string, string>;
  selectOption: (name: string, value: string) => void;
  toggleWishlist: () => void;
}

export function BazaarProductInfo({
  store,
  uiProduct,
  displayPrice,
  displayOriginalPrice,
  liked,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  selectedOptions,
  selectOption,
  toggleWishlist,
}: BazaarProductInfoProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-sm  border border-slate-200 dark:border-zinc-800 px-2 py-6 sm:p-6 flex flex-col md:flex-row gap-6 md:gap-8">
      {/* Product Gallery (Compact for Bazaar) */}
      <div className="w-full md:w-5/12 shrink-0">
        <ProductGallery images={uiProduct.images} />
      </div>

      {/* Product Info (Dense) */}
      <div className="flex-1 space-y-4">
        <Link
          to={`/stores/${store.slug}`}
          className="text-sm font-bold text-[var(--theme-primary)] hover:underline"
        >
          Visit {store.store_name} Store
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
          {uiProduct.name}
        </h1>

        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-sm font-bold text-xs">
            {uiProduct.rating > 0 ? uiProduct.rating.toFixed(1) : "New"} ★
          </span>
          <span>|</span>
          <a
            href="#reviews"
            className="hover:text-[var(--theme-primary)] underline"
          >
            {uiProduct.reviewCount} Ratings
          </a>
        </div>

        <Separator />

        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              ₦{displayPrice?.toLocaleString()}
            </span>
          </div>
          {displayOriginalPrice && (
            <div className="text-sm text-slate-500">
              List Price:{" "}
              <span className="line-through">
                ₦{displayOriginalPrice.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Variant Selectors */}
        <div className="space-y-6">
          {uiProduct.options &&
            uiProduct.options.length > 0 &&
            uiProduct.options.map((option) => (
              <div key={option.name}>
                <span className="text-xs font-medium text-slate-500 block mb-2">
                  {option.name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <button
                      key={value}
                      onClick={() => selectOption(option.name, value)}
                      className={`px-4 py-2 text-sm border transition-all ${
                        selectedOptions[option.name] === value
                          ? "bg-slate-100 dark:bg-zinc-800 border-slate-900 dark:border-white font-bold"
                          : "border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-400"
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
              <span className="text-sm font-bold block mb-2">
                Color:{" "}
                <span className="text-slate-500 font-normal">
                  {
                    uiProduct.colors.find((c) => c.id === selectedColor?.id)
                      ?.name
                  }
                </span>
              </span>
              <div className="flex flex-wrap gap-2">
                {uiProduct.colors.map(
                  (color: { id: string; name: string; hex: string }) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-sm border-2 transition-all ${
                        selectedColor?.id === color.id
                          ? "border-[var(--theme-primary)] ring-2 ring-[var(--theme-primary)]/30 scale-110"
                          : "border-slate-300 dark:border-zinc-700 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ),
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-sm">
                  ★
                </span>
              ))}
              <span className="text-xs text-slate-500 ml-2">
                ({uiProduct.reviewCount} reviews)
              </span>
            </div>
            <button
              onClick={toggleWishlist}
              className={cn(
                "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors",
                liked
                  ? "text-[var(--theme-primary)]"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-current")} />
              {liked ? "Saved" : "Save"}
            </button>
          </div>

          {uiProduct.sizes.length > 0 && (
            <div>
              <span className="text-sm font-bold block mb-2">
                Size:{" "}
                <span className="text-slate-500 font-normal">
                  {selectedSize}
                </span>
              </span>
              <div className="flex flex-wrap gap-2">
                {uiProduct.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 border rounded-sm text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)] "
                        : "bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-300 dark:border-zinc-700 hover:bg-slate-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Highlights bullet points */}
        {uiProduct.highlights.length > 0 && (
          <div className="text-sm">
            <h3 className="font-bold mb-2">About this item</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 ml-1">
              {uiProduct.highlights
                .slice(0, 5)
                .map((point: string, idx: number) => (
                  <li key={idx} className="leading-snug">
                    {point}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
