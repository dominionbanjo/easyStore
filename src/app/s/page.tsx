import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSearchProductsQuery } from "@/services/productApi";
import { SearchResultsGrid } from "@/modules/website/components/search/SearchResultsGrid";
import { SearchResultsHeader } from "@/modules/website/components/search/SearchResultsHeader";
import {
  SearchFiltersSidebar,
  MobileSearchFilters,
} from "@/modules/website/components/search/Sidebar";
import { selectLocationState } from "@/features/locationSlice";
import { useInfiniteList } from "@/modules/website/hooks/useInfiniteList";
import { mapSearchParamsToArgs } from "@/modules/website/utils/searchParams";
import type {
  ISearchProductsResponse,
  IProduct,
  SearchProductsArgs,
} from "@/types/product/productTypes";

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const locationState = useSelector(selectLocationState);

  /* ───────────────── PREFILL LOCATION FROM SLICE ───────────────── */
  // The location preference is a soft signal (local-first ranking), kept in
  // the `loc` param. An explicit `state` param (sidebar filter) takes
  // precedence and stays a hard filter.
  useEffect(() => {
    if (!searchParams.get("state") && locationState) {
      const next = new URLSearchParams(searchParams);
      next.set("loc", locationState);
      setSearchParams(next, { replace: true });
    } else if (!searchParams.get("state") && !locationState) {
      const next = new URLSearchParams(searchParams);
      if (next.has("loc")) {
        next.delete("loc");
        setSearchParams(next, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationState]);

  /* ───────────────── QUERY PARAMS ───────────────── */
  const mappedArgs = useMemo(
    () => mapSearchParamsToArgs(searchParams),
    [searchParams],
  );

  // Explicit sidebar `state` wins (hard filter); `loc` (location
  // preference) is a soft local-first signal.
  const explicitState = searchParams.get("state") ?? undefined;
  const loc = searchParams.get("loc") ?? undefined;

  /* ───────────────── DEBOUNCED QUERY ───────────────── */
  const debouncedQuery = useDebouncedValue(
    searchParams.get("q") ?? "",
    500,
  );

  const buildArgs = useCallback(
    (page: number): SearchProductsArgs => ({
      ...mappedArgs,
      q: debouncedQuery,
      state: explicitState ?? loc ?? undefined,
      local: !explicitState && loc ? true : undefined,
      page,
    }),
    [mappedArgs, debouncedQuery, explicitState, loc],
  );

  const listKey = `${debouncedQuery}|${searchParams.toString()}`;

  /* ───────────────── API ───────────────── */
  const {
    items: products,
    isLoading,
    isFetching,
    isInitialError,
    pageLoadFailed,
    hasLoaded,
    sentinelRef,
    loadMore,
    currentData,
  } = useInfiniteList<IProduct, SearchProductsArgs, ISearchProductsResponse>(
    useSearchProductsQuery,
    buildArgs,
    {
      limit: 15,
      enabled: !!debouncedQuery,
      key: listKey,
    },
  );

  const pagination = currentData?.data.pagination;
  const filters = currentData?.data.filters ?? {};

  return (
    <section className="mx-auto px-4 pt-16 pb-8 bg-white dark:bg-neutral-950 transition-colors duration-300 min-h-screen">
      {/* Header */}
      <SearchResultsHeader
        totalResults={pagination?.total}
        products={products}
        filters={filters}
      />

      <div className="lg:hidden mt-4 p-1 bg-zinc-100/50 dark:bg-white/5 rounded-full flex items-center">
        <MobileSearchFilters products={products} filters={filters} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 mt-6">
        {/* Sidebar */}
        <SearchFiltersSidebar products={products} filters={filters} />

        {/* Results */}
        <SearchResultsGrid
          products={products}
          isLoading={isLoading}
          isFetching={isFetching}
          isInitialError={isInitialError}
          pageLoadFailed={pageLoadFailed}
          hasLoaded={hasLoaded}
          loadMore={loadMore}
          sentinelRef={sentinelRef}
          debouncedQuery={debouncedQuery}
        />
      </div>
    </section>
  );
}
