import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Store, Package, SearchX, GraduationCap } from "lucide-react";
import { useGetZoneQuery, useGetZoneStoresQuery, useGetZoneProductsQuery } from "@/services/schoolZoneApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/Pagination";
import StoreCard from "@/components/shared/StoreCard";
import ProductGridCard from "@/components/shared/ProductGridCard";
import { cn } from "@/lib/utils";

type Tab = "stores" | "products";

interface ZoneMarketplaceProps {
  identifier: string;
}

export default function ZoneMarketplace({ identifier }: ZoneMarketplaceProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>("stores");

  const { data: zoneResponse, isLoading: isZoneLoading } = useGetZoneQuery(identifier);

  const page = Number(searchParams.get("page") ?? 1);
  const q = searchParams.get("q") ?? "";

  const storesArgs = useMemo(
    () => ({ identifier, page, limit: 20, q }),
    [identifier, page, q]
  );
  const productsArgs = useMemo(
    () => ({ identifier, page, limit: 20, q }),
    [identifier, page, q]
  );

  const {
    data: storesData,
    isLoading: isStoresLoading,
    isFetching: isStoresFetching,
  } = useGetZoneStoresQuery(storesArgs, { skip: tab !== "stores" });

  const {
    data: productsData,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
  } = useGetZoneProductsQuery(productsArgs, { skip: tab !== "products" });

  const zone = zoneResponse?.data;
  const stores = storesData?.data.items ?? [];
  const products = productsData?.data.items ?? [];
  const pagination =
    tab === "stores" ? storesData?.data.pagination : productsData?.data.pagination;

  const isLoading = isZoneLoading || (tab === "stores" ? isStoresLoading : isProductsLoading);
  const isFetching = tab === "stores" ? isStoresFetching : isProductsFetching;

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (!q.trim()) {
      next.delete("q");
    } else {
      next.set("q", q.trim());
    }
    next.set("page", "1");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value.trim()) {
      next.delete("q");
    } else {
      next.set("q", value.trim());
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ───────────────── LOADING ───────────────── */

  if (isZoneLoading) {
    return (
      <section className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 transition-colors duration-300">
        <Skeleton className="h-64 w-full rounded-none" />
        <div className="w-full mx-auto px-6 py-12 space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[200px] w-full rounded-sm" />
                <div className="space-y-2 p-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!zone) {
    return (
      <section className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center max-w-md mx-auto px-6 py-24">
          <div className="w-24 h-24 bg-primary/10 rounded-sm flex items-center justify-center mb-8 mx-auto ring-8 ring-primary/5">
            <SearchX className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">
            School zone not found
          </h3>
          <p className="text-muted-foreground font-medium leading-relaxed mb-8">
            This zone doesn't exist or is no longer active.
          </p>
          <Link
            to="/zones"
            className="inline-block px-8 py-3 bg-primary text-white font-black rounded-sm uppercase tracking-widest text-xs hover:scale-105 transition-all active:scale-95"
          >
            Browse all zones
          </Link>
        </div>
      </section>
    );
  }

  const bannerImage = zone.cover_image || "/images/defaultbanner.png";

  /* ───────────────── RENDER ───────────────── */

  return (
    <section className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 transition-colors duration-300 pb-24">
      {/* ─── ZONE BANNER ─── */}
      <div
        className="relative h-52 md:h-64 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0">
          <div className="w-full mx-auto px-6 pb-8 flex flex-col sm:flex-row sm:items-end gap-4">
            {zone.logo && (
              <img
                src={zone.logo}
                alt={zone.name}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-sm object-cover border-2 border-white/80 shadow-lg bg-white"
              />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest mb-1">
                <GraduationCap className="h-4 w-4" />
                <span>School Zone</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight line-clamp-2">
                {zone.name}
              </h1>
              {zone.tagline && (
                <p className="text-white/80 font-medium mt-1 line-clamp-1">
                  {zone.tagline}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="w-full mx-auto px-6 py-8">
        {/* Zone meta */}
        <div className="mb-8 space-y-4">
          {zone.description && (
            <p className="text-muted-foreground font-medium leading-relaxed max-w-3xl">
              {zone.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-sm text-xs font-bold text-primary">
              <Store className="h-3.5 w-3.5" />
              {zone.member_count} stores
            </span>
            {zone.state && (
              <span className="inline-flex items-center gap-1.5 bg-secondary/30 px-3 py-1.5 rounded-sm text-xs font-semibold text-muted-foreground">
                {[zone.location, zone.state].filter(Boolean).join(", ")}
              </span>
            )}
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-border/50 pb-4">
          <div className="flex items-center gap-1 bg-secondary/30 rounded-sm p-1 w-fit">
            <button
              onClick={() => setTab("stores")}
              className={cn(
                "px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5",
                tab === "stores"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Store className="h-3.5 w-3.5" />
              Stores
            </button>
            <button
              onClick={() => setTab("products")}
              className={cn(
                "px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5",
                tab === "products"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Package className="h-3.5 w-3.5" />
              Products
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={`Search ${tab === "stores" ? "stores" : "products"}...`}
              className="w-full sm:w-72 px-4 py-2.5 rounded-sm border border-border/60 bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* ─── LIST ─── */}
        {isLoading || isFetching ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[200px] w-full rounded-sm" />
                <div className="space-y-2 p-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : tab === "stores" ? (
          stores.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                {stores.map((store) => (
                  <div key={store.id} className="h-full">
                    <StoreCard
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
                  </div>
                ))}
              </div>
              {pagination && pagination.pages > 1 && (
                <div className="mt-16 border-t border-border/50 pt-8 flex justify-center">
                  <Pagination
                    page={pagination.page}
                    pages={pagination.pages}
                    hasNext={pagination.hasNext}
                    hasPrev={pagination.hasPrev}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No stores yet"
              message="Vendors haven't joined this zone yet. Check back soon!"
            />
          )
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
              {products.map((product) => (
                <div key={product.id}>
                  <ProductGridCard data={product} />
                </div>
              ))}
            </div>
            {pagination && pagination.pages > 1 && (
              <div className="mt-16 border-t border-border/50 pt-8 flex justify-center">
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No products yet"
            message="No products from this zone's vendors match your search."
          />
        )}
      </div>
    </section>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center max-w-2xl mx-auto bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl rounded-sm border border-zinc-200 dark:border-white/5 px-8">
      <div className="w-24 h-24 bg-primary/10 rounded-sm flex items-center justify-center mb-8 ring-8 ring-primary/5">
        <SearchX className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-muted-foreground font-medium leading-relaxed max-w-sm">
        {message}
      </p>
    </div>
  );
}
