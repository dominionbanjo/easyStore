import { ArrowRight, GraduationCap as GraduationCapIcon } from "lucide-react";
import SmartLink from "@/components/shared/SmartLink";
import { Button } from "@/components/ui/button";
import { useGetZonesQuery } from "@/services/schoolZoneApi";
import ZoneCard from "@/components/shared/ZoneCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useInView } from "@/modules/website/hooks/useInView";

interface FeaturedZonesSectionProps {
  className?: string;
}

export default function FeaturedZonesSection({
  className = "",
}: FeaturedZonesSectionProps) {
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({
    rootMargin: "800px 0px",
    once: true,
  });

  const { data, isLoading, isError } = useGetZonesQuery(
    { page: 1, limit: 12 },
    { skip: !isInView },
  );

  const zones = data?.data.items ?? [];
  const showLoading = !isInView || isLoading;
  const isEmpty = isInView && !isLoading && !isError && zones.length === 0;

  return (
    <section
      ref={sectionRef}
      data-scroll-anchor="featured-zones"
      className={`ez-cv-section pt-8 md:pt-16 pb-8 md:pb-24 px-1 sm:px-6 overflow-hidden bg-slate-50/50 dark:bg-neutral-950 transition-colors duration-300 [content-visibility:auto] [contain-intrinsic-size:auto_500px] ${className}`}
    >
      <div className="w-full mx-auto space-y-6">
        <div className="flex flex-col gap-4 px-1">
          <div className="space-y-3 text-left">
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              School Zones
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Campus marketplaces with verified vendors for your school
              community.
            </p>

            <SmartLink to="/zones">
              <Button
                variant="ghost"
                className="group text-primary hover:text-primary hover:bg-primary/5 p-0 h-auto font-bold text-base"
              >
                View All Zones
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SmartLink>
          </div>
        </div>

        {/* Content Section */}
        {showLoading ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[240px] w-full rounded-sm" />
              </div>
            ))}
          </div>
        ) : isError || isEmpty ? (
          <EmptyState
            icon={GraduationCapIcon}
            title="No School Zones Yet"
            description="School zones are coming soon. Check back!"
            className="bg-muted/30 rounded-sm"
          />
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {zones.map((zone) => (
              <ZoneCard
                key={zone.id}
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
