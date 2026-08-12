import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Messages3 } from "iconsax-react";
import { Button } from "@/components/ui/button";
import ProductGallery from "@/modules/website/components/products/ProductGallery";
import type { IProductStore } from "@/types/product/productTypes";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";
import { ProductShareButton } from "@/modules/website/components/products/ProductShareButton";

interface BazaarProductInfoProps {
  store: IProductStore;
  uiProduct: UIProduct;
  displayPrice: number;
  displayOriginalPrice: number | null | undefined;
  selectedOptions: Record<string, string>;
  selectOption: (name: string, value: string) => void;
  onMessageVendor?: () => void;
  isMessagingLoading?: boolean;
}

export function BazaarProductInfo({
  store,
  uiProduct,
  displayPrice,
  displayOriginalPrice,
  selectedOptions,
  selectOption,
  onMessageVendor,
  isMessagingLoading,
}: BazaarProductInfoProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-sm border border-slate-200/50 dark:border-neutral-800/50 px-4 py-8 sm:p-10 flex flex-col md:flex-row gap-8 md:gap-12 shadow-sm animate-in fade-in slide-in-from-left-4 duration-700">
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

        <div className="flex flex-wrap items-center gap-3">
          {onMessageVendor && (
            <Button
              onClick={onMessageVendor}
              disabled={isMessagingLoading}
              variant="outline"
              className="rounded-sm gap-2 font-bold border-slate-200 dark:border-neutral-800 disabled:opacity-50"
            >
              {isMessagingLoading ? (
                <div className="h-5 w-5 border-2 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Messages3 variant="Bold" color="currentColor" className="w-5 h-5" />
              )}
              {isMessagingLoading ? "Connecting..." : "Message Store"}
            </Button>
          )}

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
            variant="outline"
            label="Share Product"
            className="rounded-sm gap-2 font-bold border-slate-200 dark:border-neutral-800"
          />
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
          {uiProduct.name}
        </h1>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-sm font-black text-xs border border-yellow-400/20">
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
          <div className="flex items-baseline gap-4 flex-wrap">
            <span className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              ₦{displayPrice?.toLocaleString()}
            </span>
            {displayOriginalPrice && (
               <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
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
                      className={`px-6 py-3 rounded-sm text-sm font-bold border transition-all active:scale-95 ${
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
