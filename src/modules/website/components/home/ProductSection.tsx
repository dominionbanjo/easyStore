import type { ReactNode } from "react";
import { motion } from "framer-motion";
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
      className={`py-12 md:py-24 px-1 sm:px-6 overflow-hidden bg-white dark:bg-neutral-950 transition-colors duration-300 ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 text-left"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground text-base md:text-lg max-w-xl">
                {subtitle}
              </p>
            )}
            <div className="h-1.5 w-20 bg-primary rounded-full" />
          </motion.div>
          {headerAction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              {headerAction}
            </motion.div>
          )}
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid gap-2 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <Skeleton key={i} className="h-[320px] rounded-[2rem]" />
            ))}
          </div>
        ) : isError || isEmpty ? (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            className="bg-muted/30 dark:bg-neutral-900/50 rounded-[3rem]"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {children}
          </motion.div>
        )}

        {/* Footer Section (Pagination etc) */}
        {footerAction && (
          <div className="flex justify-center pt-8">{footerAction}</div>
        )}
      </div>
    </section>
  );
}
