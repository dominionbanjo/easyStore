import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStatsLoader() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card
          key={i}
          className="border border-border/30 shadow-sm overflow-hidden h-full flex flex-col"
        >
          <CardContent className="p-6 flex flex-col flex-1 justify-between">
            {/* Header: Title & Icon placeholder */}
            <div className="flex items-start justify-between w-full mb-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>

            {/* Body: Value placeholder */}
            <div className="flex-1 flex items-center justify-center w-full">
              <Skeleton className="h-10 w-3/4" />
            </div>

            {/* Footer: Trend placeholder */}
            <div className="mt-6 flex justify-center">
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
          </CardContent>
          <div className="h-1.5 bg-muted/20 w-full mt-auto" />
        </Card>
      ))}
    </div>
  );
}
