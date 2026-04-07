import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchProductsQuery } from "@/services/productApi";
import { SearchResultsGrid } from "../components/search/SearchResultsGrid";
import { SearchResultsHeader } from "../components/search/SearchResultsHeader";
import { SearchFiltersSidebar } from "../components/search/Sidebar";

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();

  /* ───────────────── QUERY PARAMS ───────────────── */
  const rawQueryArgs = useMemo(() => {
    return {
      q: searchParams.get("q") ?? "",
      page: Number(searchParams.get("page") ?? 1),
      limit: 15,
      sort: searchParams.get("sort") ?? undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      state: searchParams.get("state") ?? undefined,
      rating: searchParams.get("rating")
        ? Number(searchParams.get("rating"))
        : undefined,
      colors: searchParams.get("colors")
        ? searchParams.get("colors")!.split(",")
        : undefined,
      sizes: searchParams.get("sizes")
        ? searchParams.get("sizes")!.split(",")
        : undefined,
    };
  }, [searchParams]);

  /* ───────────────── DEBOUNCED QUERY ───────────────── */
  const debouncedQuery = useDebouncedValue(rawQueryArgs.q, 500);

  const queryArgs = { ...rawQueryArgs, q: debouncedQuery };

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
    <section className="mx-auto px-4 py-8 bg-white dark:bg-neutral-950 transition-colors duration-300 min-h-screen">
      {/* Header */}
      <SearchResultsHeader
        totalResults={pagination?.total}
        products={products}
      />

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
