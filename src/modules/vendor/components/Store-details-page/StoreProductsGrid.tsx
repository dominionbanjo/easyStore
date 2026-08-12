import type { RefObject } from "react";
import { ProductCard } from "@/components/shared/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PackageOpen, Filter, SearchX } from "lucide-react";
import { InfiniteListSkeletons } from "@/components/shared/InfiniteListSkeletons";
import { InfiniteListRetry } from "@/components/shared/InfiniteListRetry";
import type { IProduct } from "@/types/product/productTypes";

type Props = {
  products: IProduct[];
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  hasLoaded: boolean;
  isInitialError: boolean;
  pageLoadFailed: boolean;
  loadMore: () => void;
  sentinelRef: RefObject<HTMLDivElement | null>;
  searchQuery?: string;
  selectedCategory?: { id: string; name: string } | null;
  onBackToCategories?: () => void;
};

export function StoreProductsGrid({
  products,
  total,
  isLoading,
  isFetching,
  hasLoaded,
  isInitialError,
  pageLoadFailed,
  loadMore,
  sentinelRef,
  searchQuery,
  selectedCategory,
  onBackToCategories,
}: Props) {
  /* Skeleton whenever a fetch is in flight with no items yet — this covers
     the search-in-flight window where `useInfiniteList` resets items to []
     while RTK keeps the previous cache (isLoading stays false). */
  const showSkeleton =
    !hasLoaded && (isLoading || isFetching) && products.length === 0;

  const isSearching = Boolean(searchQuery?.trim());

  return (
    <div
      id="main-grid"
      className="max-w-7xl mx-auto space-y-12 pb-24"
    >
      {/* ─── CATEGORY HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <Filter className="w-6 h-6 text-primary" />
            {isSearching
              ? `Results for "${searchQuery}"`
              : selectedCategory
                ? selectedCategory.name
                : "All Collection"}
          </h2>
          <p className="text-muted-foreground font-medium">
            {hasLoaded
              ? `${total || products.length} ${
                  total === 1 ? "item" : "items"
                } found`
              : "Loading..."}
          </p>
        </div>

        {selectedCategory && (
          <Button
            variant="outline"
            className="rounded-sm border-primary/20 text-primary hover:bg-primary/5 font-bold group h-12 px-6"
            onClick={onBackToCategories}
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Categories
          </Button>
        )}
      </div>

      {/* ─── CONTENT ─── */}
      {showSkeleton ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4 px-0 sm:px-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[320px] rounded-sm" />
          ))}
        </div>
      ) : isInitialError ? (
        <div className="text-center py-32 bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl rounded-sm border border-zinc-200 dark:border-white/5 px-4 mx-2">
          <div className="w-20 h-20 bg-rose-500/10 dark:bg-rose-500/10 rounded-sm flex items-center justify-center mx-auto mb-6 ring-8 ring-rose-500/5">
            <SearchX className="w-10 h-10 text-rose-500" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            Couldn't load products
          </h3>
          <p className="text-muted-foreground mt-3 max-w-sm mx-auto font-medium text-sm md:text-base leading-relaxed">
            We ran into an error while fetching these products. Please try
            again.
          </p>
          <Button
            onClick={loadMore}
            className="mt-6 rounded-sm font-bold h-12 px-8"
          >
            Retry
          </Button>
        </div>
      ) : !hasLoaded ? null : !products.length ? (
        <div className="text-center py-32 bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl rounded-sm border border-zinc-200 dark:border-white/5 px-4 mx-2">
          <div className="w-20 h-20 bg-primary/10 dark:bg-emerald-500/10 rounded-sm flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5 dark:ring-emerald-500/5">
            <PackageOpen className="w-10 h-10 text-primary dark:text-emerald-400" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            {isSearching ? "No results found" : "No Products Found"}
          </h3>
          <p className="text-muted-foreground mt-3 max-w-sm mx-auto font-medium text-sm md:text-base leading-relaxed">
            {isSearching
              ? `We couldn't find any products matching "${searchQuery}" in this store. Try a different search term.`
              : "This inventory is currently empty for the selected criteria. Try exploring another category!"}
          </p>
          {selectedCategory && (
            <Button
              onClick={onBackToCategories}
              variant="link"
              className="mt-6 text-primary dark:text-emerald-400 font-black underline-offset-8 decoration-primary/30 hover:decoration-primary transition-all uppercase tracking-widest text-xs"
            >
              View categories
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 px-0 sm:px-2">
            {products.map((product) => (
              <div key={product.id}>
                <ProductCard
                  id={product.id}
                  slug={product.slug}
                  image={product.image as string}
                  name={product.name}
                  price={`₦${Number(product.price).toLocaleString("en-NG")}`}
                  discountPrice={
                    product.on_sale && product.discount_price
                      ? `₦${Number(product.discount_price).toLocaleString("en-NG")}`
                      : undefined
                  }
                  isOnSale={product.on_sale}
                  rating={Number(product.rating_average ?? 0)}
                  stock={product.stock ?? 0}
                  vendor={product.store_name}
                  storeSlug={product.store_slug}
                  isFavorite={product.is_in_wishlist}
                  options={product.options}
                  variants={product.variants?.map((v) => ({
                    ...v,
                    image_url: v.image_url ?? undefined,
                  }))}
                  category={
                    product.category ??
                    selectedCategory?.name ??
                    "Store Product"
                  }
                  showFooter={false}
                />
              </div>
            ))}
          </div>

          {/* ─── INFINITE SCROLL LOADING ─── */}
          {isFetching && <InfiniteListSkeletons count={8} />}

          {pageLoadFailed && <InfiniteListRetry onRetry={loadMore} />}

          {/* Sentinel always mounted so the observer can attach at any time */}
          <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
