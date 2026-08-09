import { FolderTree, ArrowRight, ChevronRight } from "lucide-react";
import SmartLink from "@/components/shared/SmartLink";
import ProductGridCard from "@/components/shared/ProductGridCard";
import { Skeleton } from "@/components/ui/skeleton";
import { WEBSITE_ROUTES } from "@/routes";
import type { IProduct } from "@/types/product/productTypes";
import type { ICategoryChild } from "@/types/category/categoryTypes";

interface CategoryGroupProps {
  category: {
    id: string;
    name: string;
    slug: string;
    products_count: number;
    children: ICategoryChild[];
  };
  products?: IProduct[];
  productsLoading?: boolean;
}

export function CategoryGroup({
  category,
  products = [],
  productsLoading = false,
}: CategoryGroupProps) {
  const showProducts = products.length > 0;

  return (
    <section className="space-y-4">
      {/* Compact header row */}
      <div className="flex items-center justify-between gap-3 border-b border-border/60 dark:border-white/10 pb-3 px-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <FolderTree className="h-5 w-5 text-primary flex-shrink-0" />
          <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight truncate">
            {category.name}
          </h2>
          {category.products_count > 0 && (
            <span className="hidden sm:inline-flex text-xs font-bold text-muted-foreground uppercase tracking-wider flex-shrink-0">
              {category.products_count} items
            </span>
          )}
        </div>

        <SmartLink
          to={`${WEBSITE_ROUTES.CATEGORIES}/${category.slug}`}
          className="group flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 transition-colors flex-shrink-0"
        >
          View All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </SmartLink>
      </div>

      {/* Product preview rail */}
      {productsLoading ? (
        <div className="flex gap-3 sm:gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-[190px] sm:w-[210px] h-[300px] rounded-sm flex-shrink-0"
            />
          ))}
        </div>
      ) : showProducts ? (
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 snap-x custom-scrollbar">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[190px] sm:w-[210px] flex-shrink-0 snap-start"
            >
              <ProductGridCard data={product} />
            </div>
          ))}
        </div>
      ) : null}

      {/* Subcategory pills */}
      {category.children.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {category.children.map((child) => (
            <SmartLink
              key={child.id}
              to={`${WEBSITE_ROUTES.CATEGORIES}/${child.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border/60 dark:border-white/10 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              {child.name}
              <ChevronRight className="w-3 h-3" />
            </SmartLink>
          ))}
        </div>
      )}
    </section>
  );
}
