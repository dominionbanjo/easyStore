import { useRef } from "react";
import SmartLink from "@/components/shared/SmartLink";
import { motion } from "framer-motion";
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

  // Fetch stores - limit to 4 for the homepage display
  const { data, isLoading, isError } = useGetStoresQuery({
    limit: 4,
    page: 1,
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
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
          </motion.div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[280px] w-full rounded-sm" />
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                id={store.id}
                name={store.store_name}
                slug={store.slug}
                description={store.description}
                logo={store.logo}
                rating={Number(store.rating_average ?? 0)}
                totalProducts={store.total_products}
                address={store.address}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
