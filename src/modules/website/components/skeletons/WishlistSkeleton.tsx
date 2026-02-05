import { Skeleton } from "@/components/ui/skeleton";

export function WishlistSkeleton() {
  return (
    <section className="min-h-screen bg-neutral-50 py-2 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Search */}
        <Skeleton className="h-10 w-full sm:w-80 rounded-full" />

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>

        {/* Footer card */}
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    </section>
  );
}
