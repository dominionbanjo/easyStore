import type { LucideIcon } from "lucide-react";
import ProductGridCard from "@/components/shared/ProductGridCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/Pagination";

interface ProductListingPageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badgeText: string;
  gradientFrom: string;
  gradientTo: string;
  badgeColor: string;
  badgeTextColor: string;
  isLoading: boolean;
  products: any[];
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
  gradientFrom,
  badgeColor,
  badgeTextColor,
  isLoading,
  products,
  pagination,
  onPageChange,
}: ProductListingPageProps) {


  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 md:pt-28 pb-16 md:pb-24 px-4 mb-12">
        <div
          className={`absolute top-0 center w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${gradientFrom}/10 via-transparent to-transparent`}
        />

        <div className="w-full mx-auto text-center relative z-10 transition-colors">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm ${badgeColor}/10 ${badgeTextColor} font-bold text-sm mb-8 border ${badgeColor}/20`}
          >
            <Icon className="w-4 h-4" />
            <span>{badgeText}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-8 text-foreground leading-[0.9]">
            {title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <div className="w-full mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-sm" />
            ))}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4"
            >
              {products.map((product) => (
                <div key={product.id}>
                  <ProductGridCard data={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-12">
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
