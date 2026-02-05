import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PackageOpen, Filter } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/shared/ProductCard";
import { Pagination } from "@/components/shared/Pagination";

import { useGetProductsByCategoryQuery } from "@/services/productApi";
import { CategoryDetailsHeader } from "../components/category/CategoryDetailsHeader";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=60";

export default function CategoryDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } =
    useGetProductsByCategoryQuery(
      {
        identifier: slug!,
        page,
        limit: 20,
      },
      { skip: !slug },
    );

  const products = data?.data.items ?? [];
  const pagination = data?.data.pagination;

  useEffect(() => {
    if (!isLoading && !isFetching) {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [page, isLoading, isFetching]);

  /* ───────────────── LOADING STATE ───────────────── */
  if (isLoading && !products.length) {
    return (
      <div className="min-h-screen bg-neutral-50/50">
        <div className="bg-white border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 py-24 space-y-12">
            <Skeleton className="h-6 w-32" />
            <div className="flex justify-between items-end gap-8">
              <div className="space-y-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-16 w-96" />
                <Skeleton className="h-6 w-[500px]" />
              </div>
              <Skeleton className="h-24 w-32 rounded-[2rem]" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-[2.5rem]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ───────────────── ERROR STATE ───────────────── */
  if (isError) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <div className="w-20 h-20 bg-destructive/5 rounded-full flex items-center justify-center mb-6">
          <PackageOpen className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-black text-foreground tracking-tight">
          Failed to load marketplace
        </h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          We encountered an error while fetching products for this category.
          Please refresh and try again.
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-neutral-50/50 pb-24">
      <div ref={sectionRef} />

      <CategoryDetailsHeader name={slug || ""} count={pagination?.total || 0} />

      <div className="max-w-7xl mx-auto px-4 py-20 space-y-16">
        <AnimatePresence mode="wait">
          {isFetching && !products.length ? (
            <motion.div
              key="fetching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[400px] rounded-[2.5rem]" />
              ))}
            </motion.div>
          ) : products.length > 0 ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-16"
            >
              <div className="flex items-center gap-3 px-2">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-black text-foreground uppercase tracking-widest">
                  Marketplace Selection
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ProductCard.Root
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      image={
                        typeof product.image === "string"
                          ? product.image
                          : (product.image?.url ?? FALLBACK_IMAGE)
                      }
                      price={`₦${product.price.toLocaleString("en-NG")}`}
                      rating={product.rating_average ?? 0}
                      stock={product.stock}
                      isFavorite={product.is_in_wishlist}
                      vendor={product.store_name}
                      colors={product.colors}
                      sizes={product.sizes}
                      category={product.category ?? slug}
                    >
                      <ProductCard.Image />
                      <ProductCard.Info />
                    </ProductCard.Root>
                  </motion.div>
                ))}
              </div>

              {/* ─── PAGINATION ─── */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center border-t border-border/50 pt-16">
                  <Pagination
                    page={pagination.page}
                    pages={pagination.pages}
                    hasNext={pagination.hasNext}
                    hasPrev={pagination.hasPrev}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-white/50 backdrop-blur-md rounded-[3rem] border border-border/50 px-4"
            >
              <Search className="h-16 w-16 mx-auto mb-6 text-primary/20" />
              <h3 className="text-2xl font-black text-foreground">
                No Products Found
              </h3>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto font-medium">
                We couldn't find any items in this collection. Browse other
                categories or come back later!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
