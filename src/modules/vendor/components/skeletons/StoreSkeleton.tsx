import { Skeleton } from "@/components/ui/skeleton";

export function StoreSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100 selection:bg-[var(--theme-primary)] selection:text-white">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-sm" />
            <Skeleton className="h-6 w-32 md:w-48" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex-1 max-w-md hidden lg:flex">
            <Skeleton className="h-12 w-full rounded-sm" />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Skeleton className="w-10 h-10 rounded-sm" />
            <Skeleton className="w-10 h-10 rounded-sm" />
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block mx-1" />
            <Skeleton className="w-10 h-10 rounded-sm" />
          </div>
        </div>
      </header>

      {/* ─── CATEGORY NAVIGATION BAR ─── */}
      <div className="bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-100 dark:border-zinc-900 sticky top-20 z-30 hidden md:block backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 py-4 overflow-x-auto">
          <Skeleton className="h-8 w-28 rounded-sm" />
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-sm flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <div className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="relative z-10 text-center px-6 max-w-4xl flex flex-col items-center">
          <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-sm mb-8 " />
          <Skeleton className="h-12 md:h-20 w-3/4 max-w-2xl mb-6" />
          <Skeleton className="h-6 md:h-8 w-5/6 max-w-lg mb-10" />
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Skeleton className="h-10 w-28 rounded-sm" />
            <Skeleton className="h-10 w-48 rounded-sm" />
          </div>
          <Skeleton className="h-14 w-56 rounded-sm" />
        </div>
      </div>

      {/* ─── MAIN GRID ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Mobile Tabs */}
        <div className="flex md:hidden mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto gap-8">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-10">
          <Skeleton className="h-10 md:h-12 w-64" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-4">
              <Skeleton className="h-[300px] sm:h-[400px] w-full rounded-sm" />
              <div className="space-y-2 px-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-10 w-10 rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
