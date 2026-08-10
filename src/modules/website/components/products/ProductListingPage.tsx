import type { RefObject } from "react";
import type { LucideIcon } from "lucide-react";
import ProductGridCard from "@/components/shared/ProductGridCard";
import { Skeleton } from "@/components/ui/skeleton";
import { InfiniteListSkeletons } from "@/components/shared/InfiniteListSkeletons";
import { InfiniteListRetry } from "@/components/shared/InfiniteListRetry";
import {
  SearchFiltersSidebar,
  MobileSearchFilters,
} from "@/modules/website/components/search/Sidebar";
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
  total?: number;
  filters?: Record<string, string[]>;
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
  total,
  filters = {},
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
          <div className="flex flex-wrap items-baseline gap-x-3">
            <p className="text-sm text-muted-foreground max-w-2xl">
              {subtitle}
            </p>
            {typeof total === "number" && total > 0 && (
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                {total.toLocaleString("en-NG")} products
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full mx-auto px-4 py-4 md:py-6">
        <div className="lg:hidden mt-4 p-1 bg-zinc-100/50 dark:bg-white/5 rounded-full flex items-center">
          <MobileSearchFilters products={products} filters={filters} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 mt-4 lg:mt-6">
          {/* Filters sidebar */}
          <SearchFiltersSidebar products={products} filters={filters} />

          {/* Results */}
          <div>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
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
                <div
                  ref={sentinelRef}
                  className="h-px w-full"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
