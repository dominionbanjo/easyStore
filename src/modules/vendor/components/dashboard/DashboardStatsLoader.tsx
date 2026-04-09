import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStatsLoader() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card
          key={i}
          className="border border-border/30  overflow-hidden flex flex-col bg-card/40 animate-pulse"
        >
          <CardContent className="p-4 sm:p-5 flex flex-col justify-center z-10 relative gap-3">
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col space-y-2 w-full pr-4">
                <Skeleton className="h-3 w-16 sm:w-20 rounded-sm" />
                <Skeleton className="h-6 sm:h-8 w-24 sm:w-32 rounded-sm" />
              </div>
              <div className="p-2 shrink-0 rounded-sm bg-muted/50 border border-border/30">
                <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 bg-transparent" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Skeleton className="h-5 w-12 rounded-sm" />
              <Skeleton className="h-3 w-16 rounded-sm" />
            </div>
          </CardContent>

          {/* Bottom Decorative Line Placeholder */}
          <div className="h-1 w-full bg-muted/20 mt-1" />
        </Card>
      ))}
    </div>
  );
}
