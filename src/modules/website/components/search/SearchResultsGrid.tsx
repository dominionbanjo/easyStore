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
      <div className="flex flex-col items-center justify-center py-32 text-center bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl rounded-[3rem] border border-zinc-200 dark:border-white/5 shadow-sm px-8">
        <div className="w-24 h-24 bg-rose-500/10 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-8 ring-8 ring-rose-500/5">
          <div className="text-3xl">⚠️</div>
        </div>
        <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">
          Search Error
        </h3>
        <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
          We encountered an error while searching for products. Please try again
          later.
        </p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl rounded-[3rem] border border-zinc-200 dark:border-white/5 shadow-sm px-8">
        <div className="w-24 h-24 bg-primary/10 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 ring-8 ring-primary/5 dark:ring-emerald-500/5">
          <div className="text-4xl text-primary dark:text-emerald-400">🔍</div>
        </div>
        <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">
          No matches found
        </h3>
        <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed italic">
          We couldn't find any products matching "{debouncedQuery}" with your
          current filters.
        </p>
      </div>
    );
  }

  /* ───────────────── RENDER ───────────────── */

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
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
            options={product.options}
            variants={product.variants?.map((v) => ({
              ...v,
              image_url: v.image_url ?? undefined,
            }))}
            vendor={product.store_name}
            storeSlug={product.store_slug}
          >
            <ProductCard.Image />
            <ProductCard.Info />
            <ProductCard.Footer />
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
