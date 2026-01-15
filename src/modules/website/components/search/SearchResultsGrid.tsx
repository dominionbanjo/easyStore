import { useSearchParams } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";

import { useSearchProductsQuery } from "@/services/productApi";
import { ProductCard } from "@/components/shared/ProductCard";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

/* ───────────────── DEBOUNCE HOOK ───────────────── */

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/* ───────────────── PAGINATION HELPERS ───────────────── */

const getVisiblePages = (current: number, total: number, maxVisible = 4) => {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const start = Math.max(1, current - Math.floor(maxVisible / 2));
  const end = Math.min(total, start + maxVisible - 1);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};

/* ───────────────── COMPONENT ───────────────── */

export function SearchResultsGrid() {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ───────────────── QUERY PARAMS ───────────────── */

  const rawQueryArgs = useMemo(() => {
    return {
      q: searchParams.get("q") ?? "",
      page: Number(searchParams.get("page") ?? 1),
      limit: 15,

      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,

      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,

      state: searchParams.get("state") ?? undefined,
      city: searchParams.get("city") ?? undefined,

      rating: searchParams.get("rating")
        ? Number(searchParams.get("rating"))
        : undefined,

      inStock: searchParams.get("inStock") === "true",

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

  const queryArgs = {
    ...rawQueryArgs,
    q: debouncedQuery,
  };

  /* ───────────────── API ───────────────── */

  const { data, isLoading, isError } = useSearchProductsQuery(queryArgs, {
    skip: !debouncedQuery,
  });

  /* ───────────────── DATA ───────────────── */

  const products = data?.data.items ?? [];
  const pagination = data?.data.pagination;

  /* ───────────────── HELPERS ───────────────── */

  const setPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
  };

  /* ───────────────── STATES ───────────────── */

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[340px] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-24 text-red-500">
        Failed to load search results.
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-lg font-semibold text-gray-700">No results found</p>
        <p className="text-sm text-gray-500 mt-1">
          Try adjusting your filters or search term.
        </p>
      </div>
    );
  }

  /* ───────────────── RENDER ───────────────── */

  return (
    <div className="space-y-8">
      {/* Result Count */}
      <p className="text-sm text-muted-foreground">
        Showing <strong>{products.length}</strong> of{" "}
        <strong>{pagination?.total ?? 0}</strong> results
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard.Root
            key={product.id}
            id={product.id}
            name={product.name}
            price={`₦${product.price.toLocaleString("en-NG")}`}
            image={product.image as string}
            category=""
            rating={Number(product.rating_average ?? 0)}
            stock={product.stock}
            isFavorite={product.is_in_wishlist}
          >
            <ProductCard.Image />
            <ProductCard.Info />
          </ProductCard.Root>
        ))}
      </div>

      {/* ─── PAGINATION ─── */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 flex-wrap">
          {/* Previous */}
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasPrev}
            onClick={() => {
              setPage(pagination.page - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Prev
          </Button>

          {/* Page Numbers */}
          {getVisiblePages(pagination.page, pagination.pages).map((page) => (
            <Button
              key={page}
              size="sm"
              variant={page === pagination.page ? "default" : "outline"}
              onClick={() => {
                setPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {page}
            </Button>
          ))}

          {/* Ellipsis + Last Page */}
          {pagination.pages > 4 &&
            !getVisiblePages(pagination.page, pagination.pages).includes(
              pagination.pages
            ) && (
              <>
                <span className="px-2 text-muted-foreground">…</span>
                <Button
                  size="sm"
                  variant={
                    pagination.page === pagination.pages ? "default" : "outline"
                  }
                  onClick={() => {
                    setPage(pagination.pages);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {pagination.pages}
                </Button>
              </>
            )}

          {/* Next */}
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasNext}
            onClick={() => {
              setPage(pagination.page + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
