import { useMemo, useState, useEffect } from "react";
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
  const rawQueryArgs = useMemo(() => {
    const params: Record<string, any> = {};

    // Map all search params to the query object
    searchParams.forEach((value, key) => {
      // Ignore livereload or known cache busters
      if (key === "_lr") return;

      // Known numerical parameters
      if (["minPrice", "maxPrice", "page", "rating"].includes(key)) {
        params[key] = Number(value);
      }
      // Known single-value strings
      else if (["q", "sort", "state", "loc"].includes(key)) {
        params[key] = value;
      }
      // Everything else is treated as a dynamic filter
      else {
        // Collect dynamic options into the unified 'filter' query string
        // format: Option:Value1,Value2|Option2:Value
        const filterStr = params.filter ? `${params.filter}|` : "";
        params.filter = `${filterStr}${key}:${value}`;
      }
    });

    // Explicit sidebar `state` wins (hard filter); `loc` (location
    // preference) is a soft local-first signal.
    const explicitState = params.state as string | undefined;
    const loc = params.loc as string | undefined;
    delete params.loc;

    return {
      q: params.q ?? "",
      page: params.page ?? 1,
      limit: 15,
      sort: params.sort ?? undefined,
      ...params,
      state: explicitState ?? loc ?? undefined,
      local: !explicitState && loc ? true : undefined,
    };
  }, [searchParams]);

  /* ───────────────── DEBOUNCED QUERY ───────────────── */
  const debouncedQuery = useDebouncedValue(rawQueryArgs.q, 500);

  const queryArgs = { ...rawQueryArgs, q: debouncedQuery };
  console.log("[SearchResultsPage] Final API queryArgs:", queryArgs);

  /* ───────────────── API ───────────────── */
  const { data, isLoading, isFetching, isError } = useSearchProductsQuery(
    queryArgs,
    {
      skip: !debouncedQuery,
    },
  );

  const products = data?.data.items ?? [];
  const pagination = data?.data.pagination;
  const filters = data?.data.filters ?? {};

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
          pagination={pagination}
          isLoading={isLoading || isFetching}
          isError={isError}
          debouncedQuery={debouncedQuery}
        />
      </div>
    </section>
  );
}
