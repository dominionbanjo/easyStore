import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";

import { useSearchProductsQuery } from "@/services/productApi";
import { ProductCard } from "@/components/shared/ProductCard";

import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/Pagination";
import { USER_ROUTES } from "@/routes/temp";

/* ───────────────── DEBOUNCE HOOK ───────────────── */

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/* ───────────────── COMPONENT ───────────────── */

export function SearchResultsGrid() {
  const navigate = useNavigate();

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
            <ProductCard.Info
              onClick={() =>
                navigate(
                  `${USER_ROUTES.PRODUCT_DETAIL}/${encodeURIComponent(
                    product.slug,
                  )}`,
                )
              }
            />{" "}
          </ProductCard.Root>
        ))}
      </div>

      {/* ─── PAGINATION ─── */}
      {pagination && (
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={(page) => {
            setPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
