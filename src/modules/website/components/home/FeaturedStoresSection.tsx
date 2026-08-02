import { useRef } from "react";
import SmartLink from "@/components/shared/SmartLink";
import { ArrowRight, Store as StoreIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetStoresQuery } from "@/services/storeApi";
import StoreCard from "@/components/shared/StoreCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";

interface FeaturedStoresSectionProps {
  className?: string;
}

export default function FeaturedStoresSection({
  className = "",
}: FeaturedStoresSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch trending stores (weighted ranking: sales, rating, active products)
  const { data, isLoading, isError } = useGetStoresQuery({
    limit: 12,
    page: 1,
    sort: "trending",
  });

  const stores = data?.data.items ?? [];
  const isEmpty = !isLoading && !isError && stores.length === 0;

  return (
    <section
      ref={containerRef}
      className={`pt-8 md:pt-16 pb-8 md:pb-24 px-1 sm:px-6 overflow-hidden bg-slate-50/50 dark:bg-neutral-950 transition-colors duration-300 ${className}`}
    >
      <div className="w-full mx-auto space-y-6">
        <div className="flex flex-col gap-4 px-1">
          <div
            className="space-y-3 text-left"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Trending Stores
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Discover top-rated sellers with exceptional products and service.
            </p>

            <SmartLink to="/stores">
              <Button
                variant="ghost"
                className="group text-primary hover:text-primary hover:bg-primary/5 p-0 h-auto font-bold text-base"
              >
                View All Stores
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SmartLink>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[240px] w-full rounded-sm" />
              </div>
            ))}
          </div>
        ) : isError || isEmpty ? (
          <EmptyState
            icon={StoreIcon}
            title="No Stores Found"
            description="We're currently onboarding new sellers. Check back soon!"
            className="bg-muted/30 rounded-sm"
          />
        ) : (
          <div
            className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
          >
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                id={store.id}
                name={store.store_name}
                slug={store.slug}
                description={store.description}
                logo={store.logo}
                coverImage={store.cover_image}
                rating={Number(store.rating_average ?? 0)}
                totalProducts={store.total_products}
                address={store.address}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
