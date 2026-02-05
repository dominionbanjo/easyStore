import Card from "@/components/shared/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <Card>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          {/* Cart Items */}
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-6 p-4 bg-white rounded-xl"
              >
                <Skeleton className="h-28 w-28 rounded-md" />

                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />

                  <div className="flex items-center gap-3 mt-3">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-14 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 space-y-4">
              <Skeleton className="h-6 w-32" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>

              <Skeleton className="h-10 w-full rounded-full" />
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
