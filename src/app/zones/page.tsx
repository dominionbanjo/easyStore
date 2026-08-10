import { useEffect, useState, useCallback } from "react";
import { SearchX, GraduationCap } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useGetZonesQuery } from "@/services/schoolZoneApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks";
import ZoneCard from "@/components/shared/ZoneCard";
import { useInfiniteList } from "@/modules/website/hooks/useInfiniteList";
import { InfiniteListSkeletons } from "@/components/shared/InfiniteListSkeletons";
import type { IGetZonesResponse, ISchoolZone } from "@/types/SchoolZone/schoolZoneTypes";

export default function ZonesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(search, 350);

  const q = debouncedSearch.trim();

  const buildArgs = useCallback((page: number) => ({ page, q }), [q]);

  const {
    items: zones,
    isLoading,
    isFetching,
    isError,
    hasLoaded,
    sentinelRef,
  } = useInfiniteList<ISchoolZone, { page: number; q: string }, IGetZonesResponse>(
    useGetZonesQuery,
    buildArgs,
    {
      limit: 20,
      key: q,
    },
  );

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (!q) {
      next.delete("q");
    } else {
      next.set("q", q);
    }
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <section className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 transition-colors duration-300 pb-24">
      {/* ─── HERO ─── */}
      <div className="relative overflow-hidden pt-20 md:pt-28 pb-16 md:pb-20 px-4">
        <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] bg-primary/10 via-transparent to-transparent" />
        <div className="w-full mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/10 text-primary font-bold text-sm mb-8 border border-primary/20">
            <GraduationCap className="w-4 h-4" />
            <span>School Zones</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-6 text-foreground leading-[0.9]">
            Campus Marketplaces
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Discover stores and products curated for your school community.
            Verified vendors, student-approved.
          </p>
          <div className="max-w-md mx-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search school zones..."
              className="w-full px-5 py-3.5 rounded-sm border border-border/60 bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      {/* ─── ZONES GRID ─── */}
      <div className="w-full mx-auto px-6 py-8">
        {isLoading && !zones.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[200px] w-full rounded-sm" />
                <div className="space-y-2 p-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : zones.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
              {zones.map((zone) => (
                <div key={zone.id} className="h-full">
                  <ZoneCard
                    id={zone.id}
                    name={zone.name}
                    slug={zone.slug}
                    subdomain={zone.subdomain}
                    tagline={zone.tagline}
                    description={zone.description}
                    logo={zone.logo}
                    coverImage={zone.cover_image}
                    state={zone.state}
                    location={zone.location}
                    memberCount={zone.member_count}
                  />
                </div>
              ))}
            </div>
            {isFetching && <InfiniteListSkeletons count={8} />}
          </>
        ) : hasLoaded || isError ? (
          <div className="flex flex-col items-center justify-center py-32 text-center max-w-2xl mx-auto bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl rounded-sm border border-zinc-200 dark:border-white/5 px-8">
            <div className="w-24 h-24 bg-primary/10 rounded-sm flex items-center justify-center mb-8 ring-8 ring-primary/5">
              <SearchX className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">
              No school zones found
            </h3>
            <p className="text-muted-foreground font-medium leading-relaxed max-w-sm">
              We couldn't find any school zones matching your search. Try a
              different name!
            </p>
          </div>
        ) : null}
      </div>

      {/* Sentinel always mounted so the observer can attach at any time */}
      <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
    </section>
  );
}
