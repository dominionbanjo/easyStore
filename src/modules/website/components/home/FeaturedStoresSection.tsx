import { useRef } from "react";
import { Link } from "react-router-dom";
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
      className={`py-12 md:py-24 px-1 sm:px-6 overflow-hidden bg-slate-50/50 ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 text-left"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Trending Stores
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl">
              Discover top-rated sellers with exceptional products and service.
            </p>
            <div className="h-1.5 w-20 bg-primary rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/stores">
              <Button
                variant="ghost"
                className="group text-primary hover:text-primary hover:bg-primary/5"
              >
                View All Stores
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[280px] w-full rounded-3xl" />
              </div>
            ))}
          </div>
        ) : isError || isEmpty ? (
          <EmptyState
            icon={StoreIcon}
            title="No Stores Found"
            description="We're currently onboarding new sellers. Check back soon!"
            className="bg-muted/30 rounded-[3rem]"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
