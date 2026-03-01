import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function WishlistSkeleton() {
  return (
    <section className="min-h-screen py-2 px-4 sm:px-8 mt-[40px] bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-40 rounded-lg" />
        </div>

        <Separator className="bg-zinc-100 dark:bg-white/5" />

        {/* Search */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-full sm:w-80 rounded-full" />
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-zinc-50/50 dark:bg-neutral-900/50 rounded-3xl p-1 border border-zinc-100 dark:border-white/5 space-y-4"
            >
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="px-3 pb-4 space-y-3 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-4 w-10 rounded-md" />
                </div>
                <Skeleton className="h-5 w-full rounded-md" />
                <div className="flex justify-between items-center pt-2">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-12 rounded-sm" />
                    <Skeleton className="h-6 w-24 rounded-md" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer card */}
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    </section>
  );
}
