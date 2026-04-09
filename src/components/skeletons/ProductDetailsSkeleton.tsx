import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ProductDetailsSkeleton() {
  return (
    <section className="max-w-[1480px] mx-auto px-4 py-10 space-y-12">
      {/* Gallery + Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8">
        {/* Gallery */}
        <div className="space-y-4">
          {/* Main image */}
          <Skeleton className="w-full aspect-square md:aspect-[4/5] rounded-sm" />

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 shrink-0 rounded-sm" />
            ))}
          </div>
        </div>

        {/* Info sidebar */}
        <div className="space-y-5">
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-5 w-2/5" />

          <Skeleton className="h-8 w-1/3" />

          {/* Price / CTA */}
          <Skeleton className="h-12 w-full rounded-sm" />

          {/* Meta rows */}
          <div className="space-y-3 pt-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Tabs skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
      </div>

      <Separator />

      {/* Reviews skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </section>
  );
}
