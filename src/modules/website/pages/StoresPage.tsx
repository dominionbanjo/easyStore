import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Store } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import StoreCard from "@/components/shared/StoreCard";
import { FormInput } from "@/components/shared/form/FormInput";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetStoresQuery, useSearchStoresQuery } from "@/services/storeApi";
import { Pagination } from "@/components/shared/Pagination";

/* ───────────────── TYPES ───────────────── */

type StoreFilterForm = {
  search: string;
};

/* ───────────────── COMPONENT ───────────────── */

export default function StoresPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const methods = useForm<StoreFilterForm>({
    defaultValues: {
      search: searchParams.get("search") ?? "",
    },
  });

  const search = methods.watch("search");
  const page = Number(searchParams.get("page") ?? 1);

  /* ───────────────── SYNC SEARCH → URL ───────────────── */

  useEffect(() => {
    const next = new URLSearchParams(searchParams);

    if (!search?.trim()) {
      next.delete("search");
      next.set("page", "1");
    } else {
      next.set("search", search);
      next.set("page", "1");
    }

    setSearchParams(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  /* ───────────────── QUERY ARGS ───────────────── */

  const hasSearch = Boolean(search?.trim());

  const listArgs = useMemo(
    () => ({
      page,
      limit: 20,
    }),
    [page],
  );

  const searchArgs = useMemo(
    () => ({
      q: search,
      page,
      limit: 20,
    }),
    [search, page],
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

  return (
    <section className="min-h-screen bg-muted/30">
      {/* ─── HEADER ─── */}
      <div className="bg-gradient-to-r from-muted/40 via-background to-muted/40 py-12 px-4 text-center border-b">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Explore Stores</h1>
          <p className="text-muted-foreground">
            Discover verified stores and shop confidently.
          </p>

          <FormProvider {...methods}>
            <form className="flex justify-center mt-6">
              <div className="w-full max-w-md">
                <FormInput
                  name="search"
                  placeholder="Search stores..."
                  className="!space-y-0"
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading || isFetching ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[220px] rounded-2xl" />
            ))}
          </div>
        ) : stores.length > 0 ? (
          <>
            <motion.div
              layout
              className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {stores.map((store, index) => (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
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
            </motion.div>

            {/* ─── PAGINATION ─── */}
            {pagination && (
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
            )}
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No stores found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
