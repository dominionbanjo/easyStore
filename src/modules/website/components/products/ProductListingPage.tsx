import type { RefObject } from "react";
import type { LucideIcon } from "lucide-react";
import ProductGridCard from "@/components/shared/ProductGridCard";
import { Skeleton } from "@/components/ui/skeleton";
import { InfiniteListSkeletons } from "@/components/shared/InfiniteListSkeletons";
import { InfiniteListRetry } from "@/components/shared/InfiniteListRetry";
import type { IProduct } from "@/types/product/productTypes";

interface ProductListingPageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badgeText: string;
  isLoading: boolean;
  isFetching: boolean;
  isInitialError: boolean;
  pageLoadFailed: boolean;
  hasLoaded: boolean;
  loadMore: () => void;
  products: IProduct[];
  sentinelRef: RefObject<HTMLDivElement | null>;
}

export default function ProductListingPage({
  title,
  subtitle,
  icon: Icon,
  badgeText,
  isLoading,
  isFetching,
  isInitialError,
  pageLoadFailed,
  hasLoaded,
  loadMore,
  products,
  sentinelRef,
}: ProductListingPageProps) {
  const isEmpty = hasLoaded && !products.length && !isFetching;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 pb-24">
      {/* Compact Header Bar */}
      <div className="bg-white dark:bg-neutral-900 border-b border-border/60 dark:border-white/10">
        <div className="w-full mx-auto px-4 py-4 md:py-5 space-y-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-primary/10 text-primary text-[11px] md:text-xs font-black uppercase tracking-wider flex-shrink-0">
              <Icon className="w-3.5 h-3.5" />
              {badgeText}
            </span>
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight truncate">
              {title}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full mx-auto px-4 py-4 md:py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-sm" />
            ))}
          </div>
        ) : isInitialError || isEmpty ? (
          <div className="text-center py-24 text-muted-foreground">
            No products found in this collection right now.
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
              {products.map((product) => (
                <div key={product.id}>
                  <ProductGridCard data={product} />
                </div>
              ))}
            </div>

            {/* Infinite scroll loading — skeletons appear, replaced by products */}
            {isFetching && <InfiniteListSkeletons count={8} />}

            {pageLoadFailed && <InfiniteListRetry onRetry={loadMore} />}

            {/* Sentinel always mounted so the observer can attach at any time */}
            <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}
