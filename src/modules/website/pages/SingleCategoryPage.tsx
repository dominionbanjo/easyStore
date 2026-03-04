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
      <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950">
        <div className="bg-white dark:bg-neutral-900/50 border-b border-border/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-1.5 sm:px-4 py-24 space-y-12">
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
        <div className="max-w-7xl mx-auto px-1.5 sm:px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-8">
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
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 bg-white dark:bg-neutral-950">
        <div className="w-24 h-24 bg-rose-500/10 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-8 ring-8 ring-rose-500/5">
          <PackageOpen className="h-12 w-12 text-rose-500" />
        </div>
        <h2 className="text-3xl font-black text-foreground tracking-tight">
          Oops! Something went wrong
        </h2>
        <p className="text-muted-foreground mt-3 max-w-sm font-medium leading-relaxed">
          We encountered an error while fetching products for this category.
          Please refresh and try again.
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 pb-24 transition-colors duration-300">
      <div ref={sectionRef} />

      <CategoryDetailsHeader name={slug || ""} count={pagination?.total || 0} />

      <div className="max-w-7xl mx-auto px-1.5 sm:px-4 py-20 space-y-16">
        <AnimatePresence mode="wait">
          {isFetching && !products.length ? (
            <motion.div
              key="fetching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-8 px-0"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 px-0">
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
                      discountPrice={
                        product.on_sale && product.discount_price
                          ? `₦${product.discount_price.toLocaleString("en-NG")}`
                          : undefined
                      }
                      isOnSale={product.on_sale}
                      rating={product.rating_average ?? 0}
                      stock={product.stock}
                      isFavorite={product.is_in_wishlist}
                      vendor={product.store_name}
                      storeSlug={product.store_slug}
                      colors={product.colors}
                      sizes={product.sizes}
                      options={product.options}
                      variants={product.variants?.map((v) => ({
                        ...v,
                        image_url: v.image_url ?? undefined,
                      }))}
                      category={product.category ?? slug}
                    >
                      <ProductCard.Image />
                      <ProductCard.Info />
                      <ProductCard.Footer />
                    </ProductCard.Root>
                  </motion.div>
                ))}
              </div>

              {/* ─── PAGINATION ─── */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center border-t border-border/50 dark:border-white/10 pt-16">
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
              className="text-center py-32 bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl rounded-[3rem] border border-zinc-200 dark:border-white/5 shadow-sm px-4"
            >
              <div className="w-24 h-24 bg-primary/10 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-primary/5 dark:ring-emerald-500/5">
                <Search className="h-12 w-12 text-primary dark:text-emerald-400" />
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tight">
                No Products Found
              </h3>
              <p className="text-muted-foreground mt-3 max-w-sm mx-auto font-medium leading-relaxed italic">
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
