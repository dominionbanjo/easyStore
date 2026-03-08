import { motion } from "framer-motion";
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
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-36 pb-20 px-4 mb-12">
        <div
          className={`absolute top-0 center w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${gradientFrom}/10 via-transparent to-transparent`}
        />

        <div className="w-full mx-auto text-center relative z-10 transition-colors">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${badgeColor}/10 ${badgeTextColor} font-bold text-sm mb-8 border ${badgeColor}/20`}
          >
            <Icon className="w-4 h-4" />
            <span>{badgeText}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-foreground">
            {title}
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <div className="w-full mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-3xl" />
            ))}
          </div>
        ) : (
          <div>
            <motion.div
              key={pagination?.page ?? "list"}
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={item}>
                  <ProductGridCard data={product} />
                </motion.div>
              ))}
            </motion.div>

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
