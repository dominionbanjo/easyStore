import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Messages3 } from "iconsax-react";
import { Button } from "@/components/ui/button";
import ProductGallery from "@/modules/website/components/products/ProductGallery";
import type { IProductStore } from "@/types/product/productTypes";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";

interface BazaarProductInfoProps {
  store: IProductStore;
  uiProduct: UIProduct;
  displayPrice: number;
  displayOriginalPrice: number | null | undefined;
  selectedColor: { id: string; name: string; hex: string } | null;
  setSelectedColor: (
    color: { id: string; name: string; hex: string } | null,
  ) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  selectedOptions: Record<string, string>;
  selectOption: (name: string, value: string) => void;
  onMessageVendor?: () => void;
}

export function BazaarProductInfo({
  store,
  uiProduct,
  displayPrice,
  displayOriginalPrice,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  selectedOptions,
  selectOption,
  onMessageVendor,
}: BazaarProductInfoProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[32px] border border-slate-200/50 dark:border-neutral-800/50 px-4 py-8 sm:p-10 flex flex-col md:flex-row gap-8 md:gap-12 shadow-sm animate-in fade-in slide-in-from-left-4 duration-700">
      {/* Product Gallery (More Spacious) */}
      <div className="w-full md:w-5/12 shrink-0">
        <div className="sticky top-28">
           <ProductGallery images={uiProduct.images} />
        </div>
      </div>

      {/* Product Info (Premium Typography) */}
      <div className="flex-1 space-y-6">
        <Link
          to={`/stores/${store.slug}`}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-indigo-600 hover:opacity-80 transition-opacity"
        >
          <div className="w-6 h-1 bg-indigo-600" />
          Visit {store.store_name} Store
        </Link>

        {onMessageVendor && (
          <Button
            onClick={onMessageVendor}
            variant="outline"
            className="rounded-2xl gap-2 font-bold border-slate-200 dark:border-neutral-800"
          >
            <Messages3 variant="Bold" color="currentColor" className="w-5 h-5" />
            Message Store
          </Button>
        )}
        
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
          {uiProduct.name}
        </h1>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full font-black text-xs border border-yellow-400/20">
            {uiProduct.rating > 0 ? uiProduct.rating.toFixed(1) : "New"} ★
          </div>
          <span className="text-slate-200 dark:text-neutral-800">|</span>
          <a
            href="#reviews"
            className="text-slate-500 hover:text-indigo-600 font-bold transition-colors"
          >
            {uiProduct.reviewCount} Verified Ratings
          </a>
        </div>

        <Separator className="opacity-50" />

        <div className="space-y-2">
           <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exclusive Price</div>
          <div className="flex items-baseline gap-4">
            <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              ₦{displayPrice?.toLocaleString()}
            </span>
            {displayOriginalPrice && (
               <span className="text-lg text-slate-400 line-through font-medium">
                ₦{displayOriginalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Variant Selectors */}
        <div className="space-y-8 pt-4">
          {uiProduct.options &&
            uiProduct.options.length > 0 &&
            uiProduct.options.map((option) => (
              <div key={option.name} className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Select {option.name}
                </span>
                <div className="flex flex-wrap gap-3">
                  {option.values.map((value) => (
                    <button
                      key={value}
                      onClick={() => selectOption(option.name, value)}
                      className={`px-6 py-3 rounded-2xl text-sm font-bold border transition-all active:scale-95 ${
                        selectedOptions[option.name] === value
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg"
                          : "bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:border-indigo-600"
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
              <div className="flex justify-between items-center">
                 <span className="text-xs font-black uppercase tracking-widest text-slate-400">Color Variation</span>
                 <span className="text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-neutral-800 px-3 py-1 rounded-lg">
                    {uiProduct.colors.find((c) => c.id === selectedColor?.id)?.name || "Select"}
                 </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {uiProduct.colors.map(
                  (color: { id: string; name: string; hex: string }) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-2xl border-4 transition-all active:scale-90 ${
                        selectedColor?.id === color.id
                          ? "border-indigo-600 ring-4 ring-indigo-600/20 scale-110 shadow-lg"
                          : "border-white dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 shadow-sm"
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
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Size Breakdown</span>
              <div className="flex flex-wrap gap-3">
                {uiProduct.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[60px] h-12 flex items-center justify-center border rounded-2xl text-sm font-black transition-all active:scale-95 ${
                      selectedSize === size
                        ? "bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-600/20"
                        : "bg-white dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-800 hover:border-indigo-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator className="opacity-50" />

        {/* Highlights bullet points */}
        {uiProduct.highlights.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Specifications & Info</h3>
            <ul className="space-y-3">
              {uiProduct.highlights
                .slice(0, 5)
                .map((point: string, idx: number) => (
                  <li key={idx} className="flex gap-3 text-sm font-medium text-slate-600 dark:text-neutral-400 leading-snug">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-2" />
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
