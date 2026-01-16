import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Layers, Search } from "lucide-react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/shared/ProductCard";
import { Pagination } from "@/components/shared/Pagination";

import { useGetProductsByCategoryQuery } from "@/services/productApi";
import { USER_ROUTES } from "@/routes/temp";

/* ───────────────── CONSTANTS ───────────────── */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=60";

/* ───────────────── COMPONENT ───────────────── */

export default function CategoryDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } =
    useGetProductsByCategoryQuery(
      {
        identifier: slug!,
        page,
        limit: 20,
      },
      { skip: !slug }
    );

  const products = data?.data.items ?? [];
  const pagination = data?.data.pagination;

  /* ───────────────── SCROLL ON PAGE CHANGE ───────────────── */

  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [page]);

  /* ───────────────── STATES ───────────────── */

  if (isError) {
    return (
      <section className="py-24 text-center text-muted-foreground">
        Failed to load category products.
      </section>
    );
  }

  /* ───────────────── RENDER ───────────────── */

  return (
    <section className="min-h-screen bg-muted/30">
      {/* ─── HEADER / SUMMARY ─── */}
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6" ref={sectionRef}>
        {/* Back Button */}
        <button
          onClick={() => navigate(USER_ROUTES.CATEGORIES)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </button>

        <Card className="rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            <CardHeader className="p-0">
              <CardTitle className="text-xl capitalize">
                {slug?.replace(/-/g, " ")}
              </CardTitle>
            </CardHeader>
            <p className="text-sm text-muted-foreground">
              {pagination?.total ?? 0} products available
            </p>
          </div>

          <Badge variant="secondary">
            <Layers className="h-3 w-3 mr-1 text-primary" />
            Category products
          </Badge>
        </Card>
      </div>

      {/* ─── PRODUCT GRID ─── */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {isLoading || isFetching ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[280px] rounded-2xl" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <ProductCard.Root
                    id={product.id}
                    name={product.name}
                    image={
                      typeof product.image === "string"
                        ? product.image
                        : product.image?.url ?? FALLBACK_IMAGE
                    }
                    price={`₦${product.price.toLocaleString("en-NG")}`}
                    rating={product.rating_average ?? 0}
                    stock={product.stock}
                    isFavorite={product.is_in_wishlist}
                  >
                    <ProductCard.Image />
                    <ProductCard.Info
                      onClick={() =>
                        navigate(
                          `${USER_ROUTES.PRODUCT_DETAIL}/${encodeURIComponent(
                            product.slug
                          )}`
                        )
                      }
                    />
                  </ProductCard.Root>
                </motion.div>
              ))}
            </motion.div>

            {/* ─── PAGINATION ─── */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-14">
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
