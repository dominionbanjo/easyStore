import { useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchX } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import StoreCard from "@/components/shared/StoreCard";
import StoreHeader from "@/modules/website/components/store/StoreHeader";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetStoresQuery, useSearchStoresQuery } from "@/services/storeApi";
import { Pagination } from "@/components/shared/Pagination";

/* ───────────────── TYPES ───────────────── */

type StoreFilterForm = {
  search: string;
  state: string;
};

/* ───────────────── COMPONENT ───────────────── */

export default function StoresPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const methods = useForm<StoreFilterForm>({
    defaultValues: {
      search: searchParams.get("search") ?? "",
      state: searchParams.get("state") ?? "",
    },
  });

  const search = methods.watch("search");
  const selectedState = methods.watch("state");
  const page = Number(searchParams.get("page") ?? 1);

  /* ───────────────── SYNC SEARCH → URL ───────────────── */

  useEffect(() => {
    const next = new URLSearchParams(searchParams);

    // Sync Search
    if (!search?.trim()) {
      next.delete("search");
    } else {
      next.set("search", search);
    }

    // Sync State
    if (!selectedState) {
      next.delete("state");
    } else {
      next.set("state", selectedState);
    }

    // Reset page on filter change if search or state changed
    if (
      search !== (searchParams.get("search") ?? "") ||
      selectedState !== (searchParams.get("state") ?? "")
    ) {
      next.set("page", "1");
    }

    setSearchParams(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedState]);

  /* ───────────────── QUERY ARGS ───────────────── */

  const hasSearch = Boolean(search?.trim());

  const listArgs = useMemo(
    () => ({
      page,
      limit: 20,
      state: selectedState || undefined,
    }),
    [page, selectedState],
  );

  const searchArgs = useMemo(
    () => ({
      q: search,
      page,
      limit: 20,
      state: selectedState || undefined,
    }),
    [search, page, selectedState],
  );

  /* ───────────────── API CALLS ───────────────── */

  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
  } = useGetStoresQuery(listArgs, {
    skip: hasSearch,
  });

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useSearchStoresQuery(searchArgs, {
    skip: !hasSearch,
  });

  /* ───────────────── NORMALIZED DATA ───────────────── */

  const data = hasSearch ? searchData : listData;
  const stores = data?.data.items ?? [];
  const pagination = data?.data.pagination;

  const isLoading = isListLoading || isSearchLoading;
  const isFetching = isListFetching || isSearchFetching;

  /* ───────────────── UI ───────────────── */

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 selection:bg-primary/20 transition-colors duration-300">
      {/* ─── HEADER ─── */}
      <FormProvider {...methods}>
        <StoreHeader />
      </FormProvider>

      {/* ─── CONTENT ─── */}
      <div className="w-full mx-auto px-6 py-12 md:py-20">
        {/* Results Count & Sort (Optional placeholder for future) */}
        {!isLoading && stores.length > 0 && (
          <div className="mb-8 flex items-center justify-between">
            <p className="text-muted-foreground font-medium">
              Showing{" "}
              <span className="text-foreground font-bold">{stores.length}</span>{" "}
              results
              {selectedState && (
                <span>
                  {" "}
                  in{" "}
                  <span className="text-foreground font-bold">
                    {selectedState}
                  </span>
                </span>
              )}
            </p>
          </div>
        )}

        {isLoading || isFetching ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        ) : stores.length > 0 ? (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {stores.map((store) => (
                  <motion.div
                    key={store.id}
                    variants={itemVariants}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="h-full"
                  >
                    <StoreCard
                      id={store.id}
                      name={store.store_name}
                      slug={store.slug}
                      description={store.description}
                      logo={store.logo}
                      rating={Number(store.rating_average ?? 0)}
                      totalProducts={store.total_products}
                      address={store.address}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ─── PAGINATION ─── */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-16 border-t border-border/50 pt-8 flex justify-center">
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                  onPageChange={(nextPage) => {
                    const next = new URLSearchParams(searchParams);
                    next.set("page", String(nextPage));
                    setSearchParams(next);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center max-w-2xl mx-auto bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl rounded-sm border border-zinc-200 dark:border-white/5  px-8"
          >
            <div className="w-24 h-24 bg-primary/10 dark:bg-emerald-500/10 rounded-sm flex items-center justify-center mb-8 ring-8 ring-primary/5 dark:ring-emerald-500/5">
              <SearchX className="h-12 w-12 text-primary dark:text-emerald-400" />
            </div>
            <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">
              No stores found
            </h3>
            <p className="text-muted-foreground font-medium leading-relaxed max-w-sm mb-10">
              We couldn't find any stores matching your criteria. Try adjusting
              your search or filters!
            </p>
            <button
              onClick={() => {
                methods.setValue("search", "");
                methods.setValue("state", "");
              }}
              className="px-8 py-3 bg-primary dark:bg-emerald-500 text-white dark:text-neutral-950 font-black rounded-sm   dark:-emerald-500/20 hover:scale-105 transition-all active:scale-95 uppercase tracking-widest text-xs"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
