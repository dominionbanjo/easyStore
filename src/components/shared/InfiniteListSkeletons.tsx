import { Skeleton } from "@/components/ui/skeleton";

interface InfiniteListSkeletonsProps {
  count?: number;
  heightClass?: string;
}

export function InfiniteListSkeletons({
  count = 8,
  heightClass = "h-[320px]",
}: InfiniteListSkeletonsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`${heightClass} rounded-sm`} />
      ))}
    </div>
  );
}
