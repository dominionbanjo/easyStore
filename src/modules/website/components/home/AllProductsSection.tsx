import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ProductCard } from "@/components/shared/ProductCard";
import { Pagination } from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

import { USER_ROUTES } from "@/routes/temp";
import { useGetAllProductsQuery } from "@/services/productApi";

/* ───────────────── CONSTANTS ───────────────── */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=60";

/* ───────────────── COMPONENT ───────────────── */

export default function AllProductsSection() {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } = useGetAllProductsQuery({
    page,
    limit: 20,
  });

  const products = data?.data.items ?? [];
  const pagination = data?.data.pagination;

  const resolveImage = (image?: string | { url: string } | null): string => {
    if (!image) return FALLBACK_IMAGE;
    if (typeof image === "string") return image;
    return image.url;
  };

  /* ───────────────── ERROR STATE ───────────────── */

  if (isError) {
    return (
      <section className="py-20 text-center text-muted-foreground">
        Failed to load products.
      </section>
    );
  }

  /* ───────────────── RENDER ───────────────── */

  return (
    <section className="py-20 bg-card">
      <div className="mx-auto space-y-10 px-4">
        {/* ─── TITLE ─── */}
        <h2
          ref={titleRef}
          className="text-3xl font-semibold text-center text-primary"
        >
          All Products
        </h2>

        {/* ─── GRID / SKELETON ─── */}
        {isLoading || isFetching ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[280px] rounded-2xl" />
            ))}
          </div>
        ) : products.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const price = product.discount_price ?? product.price;

                return (
                  <ProductCard.Root
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={resolveImage(product.image)}
                    price={`₦${price.toLocaleString("en-NG")}`}
                    rating={product.rating_average ?? 0}
                    stock={product.stock}
                    vendor={product.store_name ?? "Seller"}
                    isFavorite={product.is_in_wishlist}
                  >
                    <ProductCard.Image />
                    <ProductCard.Info
                      onClick={() =>
                        navigate(
                          USER_ROUTES.PRODUCT_DETAIL.replace(
                            ":id",
                            product.slug
                          )
                        )
                      }
                    />
                  </ProductCard.Root>
                );
              })}
            </div>

            {/* ─── PAGINATION ─── */}
            {pagination && (
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                hasNext={pagination.hasNext}
                hasPrev={pagination.hasPrev}
                onPageChange={(p) => {
                  setPage(p);

                  // scroll to title, not page top
                  requestAnimationFrame(() => {
                    titleRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  });
                }}
              />
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground py-20">
            No products available.
          </p>
        )}
      </div>
    </section>
  );
}
