import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* ─── IMAGE SECTION ─── */}
        <div className="w-full lg:w-[55%] space-y-6">
          <Skeleton className="aspect-[4/5] lg:aspect-square w-full rounded-[40px]" />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* ─── INFO SECTION ─── */}
        <div className="flex-1 space-y-10 py-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-10 md:h-16 w-full rounded-full" />
            <Skeleton className="h-10 md:h-16 w-2/3 rounded-full opacity-60" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-4 w-56 rounded-full opacity-50" />
          </div>

          <div className="space-y-8 pt-4">
            <div className="space-y-4">
              <Skeleton className="h-5 w-24 rounded-full" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-16 rounded-full" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-5 w-24 rounded-full" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-12 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-10 space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-16 w-20 rounded-full" />
              <Skeleton className="h-16 flex-1 rounded-full" />
            </div>
            <Skeleton className="h-16 w-full rounded-full opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
}
