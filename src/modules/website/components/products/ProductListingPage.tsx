import type { LucideIcon } from "lucide-react";
import ProductGridCard from "@/components/shared/ProductGridCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/Pagination";
import type { IProduct } from "@/types/product/productTypes";

interface ProductListingPageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badgeText: string;
  isLoading: boolean;
  products: IProduct[];
  pagination?: {
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange: (page: number) => void;
}

export default function ProductListingPage({
  title,
  subtitle,
  icon: Icon,
  badgeText,
  isLoading,
  products,
  pagination,
  onPageChange,
}: ProductListingPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 pb-24">
      {/* Compact Header Bar */}
      <div className="bg-white dark:bg-neutral-900 border-b border-border/60 dark:border-white/10">
        <div className="w-full mx-auto px-4 py-4 md:py-5 space-y-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-primary/10 text-primary text-[11px] md:text-xs font-black uppercase tracking-wider flex-shrink-0">
              <Icon className="w-3.5 h-3.5" />
              {badgeText}
            </span>
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight truncate">
              {title}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full mx-auto px-4 py-4 md:py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-sm" />
            ))}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
              {products.map((product) => (
                <div key={product.id}>
                  <ProductGridCard data={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-10">
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                  onPageChange={(p) => {
                    onPageChange(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
