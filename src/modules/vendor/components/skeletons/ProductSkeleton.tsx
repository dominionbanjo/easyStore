import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-12 px-4 md:px-8">
      {/* ─── BREADCRUMBS SKELETON ─── */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* ─── LEFT: IMAGE GALLERY ─── */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 md:h-24 md:w-24 rounded-sm flex-shrink-0" />
            ))}
          </div>
          <div className="flex-1 w-full">
            <Skeleton className="h-[400px] md:h-[600px] w-full rounded-sm" />
          </div>
        </div>

        {/* ─── RIGHT: PRODUCT INFO ─── */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32 rounded-sm" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
              </div>
            </div>
            <Skeleton className="h-10 md:h-14 w-full" />
            <Skeleton className="h-10 md:h-14 w-3/4" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-40" />
          </div>

          <Skeleton className="w-full h-px" />

          {/* Variants / Options */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-20 rounded-sm" />
                <Skeleton className="h-10 w-20 rounded-sm" />
                <Skeleton className="h-10 w-20 rounded-sm" />
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="flex gap-3">
                <Skeleton className="h-12 w-12 rounded-sm" />
                <Skeleton className="h-12 w-12 rounded-sm" />
                <Skeleton className="h-12 w-12 rounded-sm" />
              </div>
            </div>
          </div>

          <Skeleton className="w-full h-px" />

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <div className="flex gap-4">
              <Skeleton className="h-14 w-32 rounded-sm" />
              <Skeleton className="h-14 flex-1 rounded-sm" />
            </div>
            <Skeleton className="h-14 w-full rounded-sm" />
          </div>

          {/* Accordions */}
          <div className="space-y-4 pt-8">
            <Skeleton className="h-12 w-full rounded-sm" />
            <Skeleton className="h-12 w-full rounded-sm" />
            <Skeleton className="h-12 w-full rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
