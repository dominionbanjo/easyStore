import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/shared/ProductCard";
import { Pagination } from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PackageOpen, Filter } from "lucide-react";

type Props = {
  products: any[];
  pagination?: {
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  isLoading: boolean;
  isFetching: boolean;
  selectedCategory?: { id: string; name: string } | null;
  onBackToCategories?: () => void;
  onPageChange: (page: number) => void;
};

export function StoreProductsGrid({
  products,
  pagination,
  isLoading,
  isFetching,
  selectedCategory,
  onBackToCategories,
  onPageChange,
}: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isPaging, setIsPaging] = useState(false);
  const hasData = products.length > 0;

  useEffect(() => {
    if (isPaging && !isFetching) {
      setIsPaging(false);
    }
  }, [isFetching, isPaging]);

  const handlePageChange = (page: number) => {
    if (isFetching) return;
    setIsPaging(true);
    onPageChange(page);

    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const showSkeleton = isLoading || isPaging || (isFetching && !hasData);

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* ─── CATEGORY HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <Filter className="w-6 h-6 text-primary" />
            {selectedCategory ? selectedCategory.name : "All Collection"}
          </h2>
          <p className="text-muted-foreground font-medium">
            {products.length} {products.length === 1 ? "item" : "items"} found
            in this view
          </p>
        </div>

        {selectedCategory && (
          <Button
            variant="outline"
            className="rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold group h-12 px-6"
            onClick={onBackToCategories}
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Categories
          </Button>
        )}
      </div>

      {/* ─── CONTENT ─── */}
      <AnimatePresence mode="wait">
        {showSkeleton ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-[2.5rem]" />
            ))}
          </motion.div>
        ) : !products.length ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-border/50 px-4 mx-2"
          >
            <PackageOpen className="w-16 h-16 text-primary/20 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-foreground">
              No Products Found
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              This inventory is currently empty for the selected criteria. Try
              exploring another category!
            </p>
            {selectedCategory && (
              <Button
                onClick={onBackToCategories}
                variant="link"
                className="mt-4 text-primary font-black underline-offset-4"
              >
                View categories
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-20"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard.Root
                    id={product.id}
                    slug={product.slug}
                    image={product.image}
                    name={product.name}
                    price={`₦${Number(product.price).toLocaleString("en-NG")}`}
                    rating={Number(product.rating_average ?? 0)}
                    stock={product.stock ?? 0}
                    vendor={product.store_name}
                    isFavorite={product.is_in_wishlist}
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
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
