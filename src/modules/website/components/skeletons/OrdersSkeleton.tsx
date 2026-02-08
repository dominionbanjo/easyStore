import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card
          key={i}
          className="border dark:border-white/5 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm"
        >
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row h-auto sm:h-24">
              {/* Image Skeleton */}
              <Skeleton className="w-full sm:w-32 h-32 sm:h-auto rounded-none" />

              {/* Content Skeleton */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                <div className="flex justify-between items-center mt-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
