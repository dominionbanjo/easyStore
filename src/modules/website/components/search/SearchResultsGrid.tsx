import type { RefObject } from "react";
import { ProductCard } from "@/components/shared/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { InfiniteListSkeletons } from "@/components/shared/InfiniteListSkeletons";
import { InfiniteListRetry } from "@/components/shared/InfiniteListRetry";
import type { IProduct } from "@/types/product/productTypes";

interface SearchResultsGridProps {
  products: IProduct[];
  isLoading: boolean;
  isFetching: boolean;
  isInitialError: boolean;
  pageLoadFailed: boolean;
  hasLoaded: boolean;
  loadMore: () => void;
  sentinelRef: RefObject<HTMLDivElement | null>;
  debouncedQuery: string;
}

export function SearchResultsGrid({
  products,
  isLoading,
  isFetching,
  isInitialError,
  pageLoadFailed,
  hasLoaded,
  loadMore,
  sentinelRef,
  debouncedQuery,
}: SearchResultsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-sm" />
        ))}
      </div>
    );
  }

  if (isInitialError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl rounded-sm border border-zinc-200 dark:border-white/5  px-8">
        <div className="w-24 h-24 bg-rose-500/10 dark:bg-rose-500/10 rounded-sm flex items-center justify-center mb-8 ring-8 ring-rose-500/5">
          <div className="text-3xl">⚠️</div>
        </div>
        <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">
          Search Error
        </h3>
        <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
          We encountered an error while searching for products. Please try again
          later.
        </p>
      </div>
    );
  }

  if (!hasLoaded) {
    return null;
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl rounded-sm border border-zinc-200 dark:border-white/5  px-8">
        <div className="w-24 h-24 bg-primary/10 dark:bg-emerald-500/10 rounded-sm flex items-center justify-center mb-8 ring-8 ring-primary/5 dark:ring-emerald-500/5">
          <div className="text-4xl text-primary dark:text-emerald-400">🔍</div>
        </div>
        <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">
          No matches found
        </h3>
        <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed italic">
          We couldn't find any products matching "{debouncedQuery}" with your
          current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            slug={product.slug}
            name={product.name}
            price={`₦${product.price.toLocaleString("en-NG")}`}
            discountPrice={
              product.on_sale && product.discount_price
                ? `₦${product.discount_price.toLocaleString("en-NG")}`
                : undefined
            }
            isOnSale={product.on_sale}
            image={product.image as string}
            category={product.category || ""}
            rating={Number(product.rating_average ?? 0)}
            stock={product.stock}
            isFavorite={product.is_in_wishlist}
            options={product.options}
            variants={product.variants?.map((v) => ({
              ...v,
              image_url: v.image_url ?? undefined,
            }))}
            vendor={product.store_name}
            storeSlug={product.store_slug}
          />
        ))}
      </div>

      {/* Infinite scroll loading */}
      {isFetching && <InfiniteListSkeletons count={8} />}

      {pageLoadFailed && <InfiniteListRetry onRetry={loadMore} />}

      {/* Sentinel always mounted so the observer can attach at any time */}
      <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
    </div>
  );
}
