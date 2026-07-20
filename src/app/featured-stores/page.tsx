import { Store } from "lucide-react";
import { useGetStoresQuery } from "@/services/storeApi";
import StoreCard from "@/components/shared/StoreCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedStoresPage() {
  const { data: stores, isLoading } = useGetStoresQuery({ limit: 12 });

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 md:pt-28 pb-16 md:pb-24 px-4 mb-12">
        <div className="absolute top-0 center w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent dark:from-emerald-900/10" />

        <div className="w-full mx-auto text-center relative z-10 transition-colors">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/5 dark:bg-emerald-500/10 text-primary dark:text-emerald-400 font-bold text-sm mb-8 border border-primary/10 dark:border-emerald-500/20">
            <Store className="w-4 h-4" />
            <span>Top Rated Sellers</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-foreground">
            Featured <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 dark:from-emerald-400 dark:to-teal-500">
              Stores
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Explore the best sellers on EazyStore. Hand-picked for quality,
            reliability, and excellent service.
          </p>
        </div>
      </section>

      {/* Stores Grid */}
      <div className="w-full mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-sm" />
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {stores?.data?.items?.map((store) => (
              <div key={store.id}>
                <StoreCard
                  id={store.id}
                  name={store.store_name}
                  slug={store.slug}
                  description={store.description}
                  logo={store.logo}
                  rating={Number(store.rating_average)}
                  totalProducts={store.total_products}
                  address={store.address}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
