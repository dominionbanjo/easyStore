import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStatsLoader() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card
          key={i}
          className="border border-border/30 shadow-sm overflow-hidden flex flex-col bg-card/40 animate-pulse"
        >
          <CardContent className="p-4 sm:p-5 flex flex-col z-10 relative">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-6 w-6 rounded-lg" />
            </div>

            <div className="flex flex-col items-center justify-center py-1">
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>

            <div className="mt-2 flex items-center justify-center gap-2">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
          </CardContent>

          {/* Bottom Decorative Line Placeholder */}
          <div className="h-1 w-full bg-muted/20 mt-1" />
        </Card>
      ))}
    </div>
  );
}
