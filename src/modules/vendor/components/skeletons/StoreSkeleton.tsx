import { Skeleton } from "@/components/ui/skeleton";

export function StoreSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen font-sans flex flex-col items-center">
      {/* ─── TOP SECTION (HEADER) ─── */}
      <div className="w-full max-w-7xl px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-3 w-20 rounded-full opacity-50" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      <div className="w-full max-w-5xl px-6 mt-12 md:mt-24 space-y-16">
        {/* ─── MIDDLE SECTION (HERO) ─── */}
        <div className="flex flex-col items-center text-center space-y-8">
          <Skeleton className="w-32 h-32 md:w-48 md:h-48 rounded-full" />
          <div className="space-y-4 flex flex-col items-center w-full">
            <Skeleton className="h-10 md:h-16 w-3/4 max-w-2xl rounded-full" />
            <Skeleton className="h-4 md:h-6 w-1/2 max-w-md rounded-full opacity-60" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-14 w-40 rounded-full" />
            <Skeleton className="h-14 w-14 rounded-full" />
          </div>
        </div>

        {/* ─── BOTTOM SECTION (GRID PREVIEW) ─── */}
        <div className="pt-20 pb-32">
          <div className="flex justify-between items-end mb-12 px-2">
            <div className="space-y-3">
              <Skeleton className="h-8 w-48 rounded-full" />
              <Skeleton className="h-3 w-32 rounded-full opacity-50" />
            </div>
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-5">
                <Skeleton className="aspect-[4/5] w-full rounded-[40px]" />
                <div className="space-y-3 px-4">
                  <Skeleton className="h-4 w-3/4 rounded-full" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
