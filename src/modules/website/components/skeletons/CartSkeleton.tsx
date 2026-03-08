import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <section className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 py-24 px-4 sm:px-8 transition-colors duration-300">
      <div className="w-full mx-auto px-0 sm:px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>

        <div className="grid lg:grid-cols-[1.8fr_1fr] gap-8">
          {/* Cart Items */}
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-6 p-4">
                <Skeleton className="h-28 w-28 rounded-md" />

                <div className="flex-1 space-y-4 py-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-24" />

                  <div className="flex items-center gap-4 mt-4">
                    <Skeleton className="h-10 w-32 rounded-xl" />
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end py-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white dark:bg-neutral-900 rounded-[2rem] p-8 space-y-6 border border-gray-100 dark:border-white/5 sticky top-24">
              <Skeleton className="h-8 w-40" />

              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-8 w-full mt-4" />
              </div>

              <div className="space-y-3 pt-4">
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
