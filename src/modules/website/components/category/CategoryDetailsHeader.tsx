import { ArrowLeft, Tag } from "lucide-react";
import SmartLink from "@/components/shared/SmartLink";
import { WEBSITE_ROUTES } from "@/routes";
import type { ICategoryChild } from "@/types/category/categoryTypes";

interface CategoryDetailsHeaderProps {
  name: string;
  count: number;
  children?: ICategoryChild[];
}

export function CategoryDetailsHeader({
  name,
  count,
  children = [],
}: CategoryDetailsHeaderProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 border-b border-border/60 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-1.5 sm:px-4 py-3.5 md:py-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <SmartLink
              to={WEBSITE_ROUTES.CATEGORIES}
              className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </SmartLink>
            <span className="w-px h-5 bg-border/60 dark:bg-white/10 flex-shrink-0" />
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight capitalize truncate">
              {name}
            </h1>
          </div>

          <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-primary/10 text-primary text-[11px] md:text-xs font-black uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            {count} Products
          </span>
        </div>

        {children.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {children.map((child) => (
              <SmartLink
                key={child.id}
                to={`${WEBSITE_ROUTES.CATEGORIES}/${child.slug}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border/60 dark:border-white/10 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                {child.name}
              </SmartLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
