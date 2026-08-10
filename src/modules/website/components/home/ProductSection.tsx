import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { PackageOpen, type LucideIcon } from "lucide-react";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  footerAction?: ReactNode;
  skeletonCount?: number;
}

export function ProductSection({
  title,
  subtitle,
  isLoading,
  isError,
  isEmpty,
  emptyIcon = PackageOpen,
  emptyTitle = "No items found",
  emptyDescription = "We couldn't find any products in this section.",
  children,
  className = "",
  headerAction,
  footerAction,
  skeletonCount = 8,
}: ProductSectionProps) {
  return (
    <section
      className={`py-12 md:py-24 px-1 sm:px-6 overflow-hidden bg-white dark:bg-neutral-950 transition-colors duration-300 [content-visibility:auto] [contain-intrinsic-size:auto_600px] ${className}`}
    >
      <div className="w-full mx-auto space-y-12">
        <div className="flex flex-col gap-4 px-1">
          <div
            className="space-y-3 text-left"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground text-sm md:text-base max-w-xl">
                {subtitle}
              </p>
            )}

            {headerAction && (
              <div className="pt-1">
                {headerAction}
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <Skeleton key={i} className="h-[280px] rounded-sm" />
            ))}
          </div>
        ) : isError || isEmpty ? (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            className="bg-muted/30 dark:bg-neutral-900/50 rounded-sm"
          />
        ) : (
          <div
            className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
          >
            {children}
          </div>
        )}

        {/* Footer Section (Pagination etc) */}
        {footerAction && (
          <div className="flex justify-center pt-8">{footerAction}</div>
        )}
      </div>
    </section>
  );
}
