import { Flame, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { selectLocationState } from "@/features/locationSlice";
import { useGetDealRecommendationsQuery } from "@/services/recommendationApi";
import ProductGridCard from "@/components/shared/ProductGridCard";
import HorizontalScrollRail from "@/components/shared/HorizontalScrollRail";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import SmartLink from "@/components/shared/SmartLink";
import { WEBSITE_ROUTES } from "@/routes";

export default function DealsOfTheDaySection() {
  const locationState = useSelector(selectLocationState);

  const { data, isLoading, isError } = useGetDealRecommendationsQuery({
    limit: 10,
    state: locationState ?? undefined,
  });

  const products = data?.data?.items ?? [];
  const showLoading = isLoading;
  const isEmpty = !isLoading && !isError && products.length === 0;

  return (
    <section
      data-scroll-anchor="deals-of-the-day"
      className="py-10 md:py-14 px-1 sm:px-6 overflow-hidden bg-background dark:bg-neutral-950 transition-colors duration-300"
    >
      <div className="w-full mx-auto space-y-8">
        <div className="flex items-end justify-between gap-4 px-1">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <span className="flex items-center justify-center w-9 h-9 rounded-sm bg-red-500/10 text-red-500">
                <Flame className="w-5 h-5" />
              </span>
              Deals of the Day
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Unmissable discounts — grab them before they are gone.
            </p>
          </div>

          <SmartLink
            to={WEBSITE_ROUTES.FEATURED}
            className="group flex items-center gap-1 text-base font-bold text-primary hover:text-primary/80 transition-colors flex-shrink-0"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </SmartLink>
        </div>

        {showLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-[210px] sm:w-[240px] h-[320px] rounded-sm flex-shrink-0"
              />
            ))}
          </div>
        ) : isError || isEmpty ? (
          <EmptyState
            icon={Flame}
            title="No deals right now"
            description="Vendors are cooking up new discounts — check back soon!"
            className="bg-muted/30 dark:bg-neutral-900/50 rounded-sm"
          />
        ) : (
          <HorizontalScrollRail className="gap-3 sm:gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[210px] sm:w-[240px] flex-shrink-0 snap-start"
              >
                <ProductGridCard data={product} />
              </div>
            ))}
          </HorizontalScrollRail>
        )}
      </div>
    </section>
  );
}
