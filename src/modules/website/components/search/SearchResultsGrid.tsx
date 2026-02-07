import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/shared/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/Pagination";
import type { IPagination, IProduct } from "@/types/product/productTypes";

interface SearchResultsGridProps {
  products: IProduct[];
  pagination?: IPagination;
  isLoading: boolean;
  isError: boolean;
  debouncedQuery: string;
}

export function SearchResultsGrid({
  products,
  pagination,
  isLoading,
  isError,
  debouncedQuery,
}: SearchResultsGridProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ───────────────── HELPERS ───────────────── */

  const setPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
  };

  /* ───────────────── STATES ───────────────── */

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-red-500 font-medium mb-2">
          Error loading results
        </div>
        <p className="text-sm text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center border rounded-xl bg-muted/20 border-dashed">
        <div className="mb-4 text-4xl">🔍</div>
        <p className="text-lg font-semibold text-foreground">
          No products found
        </p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
          We couldn't find any matches for "{debouncedQuery}" with your current
          filters.
        </p>
      </div>
    );
  }

  /* ───────────────── RENDER ───────────────── */

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {products.map((product) => (
          <ProductCard.Root
            key={product.id}
            id={product.id}
            slug={product.slug}
            name={product.name}
            price={`₦${product.price.toLocaleString("en-NG")}`}
            discountPrice={
              product.on_sale && product.discount_price
                ? `₦${product.discount_price.toLocaleString("en-NG")}`
                : undefined
            }
            isOnSale={product.on_sale}
            image={product.image as string}
            category={product.category || ""}
            rating={Number(product.rating_average ?? 0)}
            stock={product.stock}
            isFavorite={product.is_in_wishlist}
            colors={product.colors}
            sizes={product.sizes}
          >
            <ProductCard.Image />
            <ProductCard.Info />
          </ProductCard.Root>
        ))}
      </div>

      {/* ─── PAGINATION ─── */}
      {pagination && pagination.pages > 1 && (
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
