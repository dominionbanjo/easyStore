import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const MessageSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={cn(
            "flex gap-3 max-w-[80%] animate-pulse",
            i % 2 === 0 ? "self-end flex-row-reverse" : "self-start"
          )}
        >
          <Skeleton className="h-10 w-10 rounded-sm shrink-0" />
          <div className={cn("space-y-2", i % 2 === 0 ? "items-end" : "items-start")}>
            <Skeleton
              className={cn(
                "h-4 w-24 rounded-sm",
                i % 2 === 0 ? "bg-primary/10" : ""
              )}
            />
            <Skeleton
              className={cn(
                "h-12 w-[280px] rounded-sm",
                i % 2 === 0 ? "bg-primary/5" : ""
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
