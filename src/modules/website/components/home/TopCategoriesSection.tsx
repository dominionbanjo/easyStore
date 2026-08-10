import { useMemo } from "react";
import SmartLink from "@/components/shared/SmartLink";
import { ArrowRight, LayoutGrid, Tag } from "lucide-react";
import { useGetCategoriesQuery } from "@/services/productDetailsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WEBSITE_ROUTES } from "@/routes";
import { useInView } from "@/modules/website/hooks/useInView";

interface TopCategoriesSectionProps {
  className?: string;
}

// Predefined colors for categories to make them visually distinct
const CATEGORY_COLORS = [
  "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
  "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400",
  "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
];

export default function TopCategoriesSection({
  className = "",
}: TopCategoriesSectionProps) {
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({
    rootMargin: "800px 0px",
    once: true,
  });

  // Fetch categories - limit to reasonable number for homepage
  const { data, isLoading, isError } = useGetCategoriesQuery(
    {
      page: 1,
      limit: 8,
    },
    { skip: !isInView },
  );

  // Only categories that actually have products, most popular first
  const categories = useMemo(() => {
    const all = data?.data ?? [];
    return all
      .filter((c) => (c.products_count ?? 0) > 0)
      .sort((a, b) => (b.products_count ?? 0) - (a.products_count ?? 0))
      .slice(0, 8);
  }, [data]);

  const isEmpty = !isLoading && !isError && categories.length === 0;

  return (
    <section
      ref={sectionRef}
      className={`py-12 md:py-20 px-1 sm:px-6 overflow-hidden bg-background [content-visibility:auto] [contain-intrinsic-size:auto_400px] ${className}`}
    >
      <div className="w-full mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col gap-4 px-1">
          <div
            className="space-y-4 text-left"
          >
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <LayoutGrid className="h-6 w-6 text-primary" />
              Browse by Category
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Explore our wide range of collections and find exactly what you
              need.
            </p>

            <SmartLink
              to="/categories"
              className="group flex items-center gap-1 text-base font-bold text-primary hover:text-primary/80 transition-colors"
            >
              View All Categories
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </SmartLink>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24 md:h-32 rounded-sm w-full" />
            ))}
          </div>
        ) : isError || isEmpty ? (
          <EmptyState
            icon={Tag}
            title="No Categories"
            description="We haven't set up our product categories yet."
            className="bg-muted/30 rounded-sm py-12"
          />
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {categories.map((category, index) => (
              <SmartLink
                key={category.id}
                to={`${WEBSITE_ROUTES.CATEGORIES}/${category.slug}`}
                className="block group"
              >
                <Card
                  className={cn(
                    "h-24 md:h-32 border-none  hover: transition-all duration-300 rounded-sm flex flex-col items-center justify-center gap-2 p-4 text-center cursor-pointer group-hover:-translate-y-1 relative overflow-hidden",
                    CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                  )}
                >
                  {/* Background decoration */}
                  <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 transform group-hover:scale-110 transition-transform duration-500">
                    <Tag className="w-20 h-20 fill-current" />
                  </div>

                  <h3 className="font-bold text-lg md:text-xl relative z-10 line-clamp-1 px-2">
                    {category.name}
                  </h3>
                  <div className="text-xs font-medium opacity-70 relative z-10">
                    {category.products_count ?? 0} Products
                  </div>
                </Card>
              </SmartLink>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
