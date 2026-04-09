import { Skeleton } from "@/components/ui/skeleton";

export function OrderDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/20 py-6 sm:py-10 transition-colors duration-300">
      <div className="w-full mx-auto px-2 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Back Button & Breadcrumb */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 rounded-sm" />
            <Skeleton className="h-9 w-40 rounded-sm" />
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8 px-1">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-24 rounded-sm" />
                <div className="h-4 w-px bg-border/40 hidden sm:block" />
                <Skeleton className="h-6 w-32 rounded-sm" />
              </div>
              <Skeleton className="h-12 w-64 sm:h-16 sm:w-80 rounded-sm" />
              <Skeleton className="h-4 w-40 rounded-sm" />
            </div>

            <div className="text-right">
              <Skeleton className="h-3 w-24 ml-auto mb-2" />
              <Skeleton className="h-8 w-40 ml-auto rounded-sm" />
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Main Content (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Items List Skeleton */}
              <div className="p-6 bg-white dark:bg-neutral-900/50 rounded-sm border border-border/40 space-y-4">
                <Skeleton className="h-6 w-48 mb-6" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-16 w-16 rounded-sm shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>

              {/* Delivery Info Skeleton */}
              <div className="p-6 bg-white dark:bg-neutral-900/50 rounded-sm border border-border/40 space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>

            {/* Right: Sidebar (4 columns) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Payment Summary Skeleton */}
              <div className="p-6 bg-white dark:bg-neutral-900/50 rounded-sm border border-border/40 space-y-4">
                <Skeleton className="h-6 w-full" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full rounded-sm" />
                </div>
              </div>

              {/* Vendor Info Skeleton */}
              <div className="p-6 bg-white dark:bg-neutral-900/50 rounded-sm border border-border/40">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
