import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductCard from "@/components/shared/ProductCard";
import { Pagination } from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { USER_ROUTES } from "@/routes/temp";

/* ───────────────── TYPES ───────────────── */

type Props = {
  products: any[];
  pagination?: {
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  isLoading: boolean; // MUST include isFetching from parent
  selectedCategory?: { id: string; name: string } | null;
  onBackToCategories?: () => void;
  onPageChange: (page: number) => void;
};

/* ───────────────── COMPONENT ───────────────── */

export function StoreProductsGrid({
  products,
  pagination,
  isLoading,
  selectedCategory,
  onBackToCategories,
  onPageChange,
}: Props) {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Local state to force skeleton immediately on pagination click
  const [isPaging, setIsPaging] = useState(false);

  /* ───────────────── RESET PAGING WHEN DATA LOADS ───────────────── */

  useEffect(() => {
    if (!isLoading) {
      setIsPaging(false);
    }
  }, [isLoading]);

  /* ───────────────── HANDLERS ───────────────── */

  const handlePageChange = (page: number) => {
    if (isLoading) return; // prevent double-trigger

    setIsPaging(true);
    onPageChange(page);

    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const showSkeleton = isLoading || isPaging;

  /* ───────────────── RENDER ───────────────── */

  return (
    <div ref={sectionRef} className="space-y-6">
      {/* ─── CATEGORY HEADER ─── */}
      {selectedCategory && (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={onBackToCategories}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to categories
          </Button>

          <p className="text-sm text-muted-foreground">
            Showing products in <strong>{selectedCategory.name}</strong>
          </p>
        </div>
      )}

      {/* ─── LOADING / EMPTY / CONTENT ─── */}
      {showSkeleton ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-2xl" />
          ))}
        </div>
      ) : !products.length ? (
        <p className="text-center text-muted-foreground py-20">
          No products found.
        </p>
      ) : (
        <>
          {/* ─── PRODUCTS GRID ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard.Root
                key={product.id}
                id={product.id}
                image={product.image}
                name={product.name}
                price={`₦${product.price.toLocaleString("en-NG")}`}
                category=""
                rating={Number(product.rating_average ?? 0)}
                stock={product.stock ?? 0}
              >
                <ProductCard.Image />
                <ProductCard.Info
                  onClick={() =>
                    navigate(
                      `${USER_ROUTES.PRODUCT_DETAIL}/${encodeURIComponent(
                        product.name
                      )}`
                    )
                  }
                />
              </ProductCard.Root>
            ))}
          </div>

          {/* ─── PAGINATION ─── */}
          {pagination && (
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              hasNext={!isLoading && pagination.hasNext}
              hasPrev={!isLoading && pagination.hasPrev}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
