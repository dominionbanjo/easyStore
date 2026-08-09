import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Search, PackageOpen } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/shared/ProductCard";
import { Pagination } from "@/components/shared/Pagination";

import { useGetProductsByCategoryQuery } from "@/services/productApi";
import { useGetCategoriesQuery } from "@/services/productDetailsApi";
import { CategoryDetailsHeader } from "@/modules/website/components/category/CategoryDetailsHeader";

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

  // Look up the pretty name + subcategories from the (cached) category tree
  const { data: categoriesData } = useGetCategoriesQuery({ page: 1, limit: 50 });
  const category = categoriesData?.data?.find((c) => c.slug === slug);

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
        <div className="bg-white dark:bg-neutral-900 border-b border-border/50">
          <div className="w-full mx-auto px-1.5 sm:px-4 py-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-14 rounded-sm" />
              <Skeleton className="h-6 w-48 rounded-sm" />
            </div>
            <Skeleton className="h-8 w-full md:w-80 rounded-sm" />
          </div>
        </div>
        <div className="w-full mx-auto px-1.5 sm:px-4 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[320px] rounded-sm" />
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
        <div className="w-24 h-24 bg-rose-500/10 dark:bg-rose-500/10 rounded-sm flex items-center justify-center mb-8 ring-8 ring-rose-500/5">
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

      <CategoryDetailsHeader
        name={category?.name ?? (slug || "").replace(/-/g, " ")}
        count={pagination?.total || 0}
        children={category?.children}
      />

      <div className="w-full mx-auto px-1.5 sm:px-4 py-4 md:py-6 space-y-6">
        {isFetching && !products.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4 px-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-sm" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 px-0">
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard
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
                  />
                </div>
              ))}
            </div>

            {/* ─── PAGINATION ─── */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center border-t border-border/50 dark:border-white/10 pt-8">
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24 md:py-32 bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl rounded-sm border border-zinc-200 dark:border-white/5 px-4">
            <div className="w-24 h-24 bg-primary/10 dark:bg-emerald-500/10 rounded-sm flex items-center justify-center mx-auto mb-8 ring-8 ring-primary/5 dark:ring-emerald-500/5">
              <Search className="h-12 w-12 text-primary dark:text-emerald-400" />
            </div>
            <h3 className="text-3xl font-black text-foreground tracking-tight">
              No Products Found
            </h3>
            <p className="text-muted-foreground mt-3 max-w-sm mx-auto font-medium leading-relaxed italic">
              We couldn't find any items in this collection. Browse other
              categories or come back later!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
