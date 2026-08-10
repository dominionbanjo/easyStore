import { useEffect, useMemo, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  TrendingUp,
  Zap,
  Sparkles,
  Store,
  ChevronRight,
  Flame,
  LayoutGrid,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useGetCategoriesQuery } from "@/services/productDetailsApi";
import { useGetDealRecommendationsQuery } from "@/services/recommendationApi";
import { selectLocationState } from "@/features/locationSlice";
import SmartLink from "@/components/shared/SmartLink";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import HorizontalScrollRail from "@/components/shared/HorizontalScrollRail";
import VerticalScrollView from "@/components/shared/VerticalScrollView";
import { Skeleton } from "@/components/ui/skeleton";
import { WEBSITE_ROUTES } from "@/routes";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=60";

const quickLinks = [
  {
    title: "Trending",
    icon: TrendingUp,
    href: WEBSITE_ROUTES.TRENDING,
    color: "bg-orange-500",
  },
  {
    title: "New Arrivals",
    icon: Zap,
    href: WEBSITE_ROUTES.NEW_ARRIVALS,
    color: "bg-blue-500",
  },
  {
    title: "Featured",
    icon: Sparkles,
    href: WEBSITE_ROUTES.FEATURED,
    color: "bg-purple-500",
  },
  {
    title: "Top Stores",
    icon: Store,
    href: WEBSITE_ROUTES.STORES,
    color: "bg-emerald-500",
  },
];

export default function HomeShoppingHero() {
  const locationState = useSelector(selectLocationState);

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;

    const update = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    update();
    carouselApi.on("select", update);
    carouselApi.on("reInit", update);

    return () => {
      carouselApi.off("select", update);
      carouselApi.off("reInit", update);
    };
  }, [carouselApi]);

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery({ page: 1, limit: 100 });
  const { data: dealsData, isLoading: isDealsLoading } =
    useGetDealRecommendationsQuery({
      limit: 6,
      state: locationState ?? undefined,
    });

  const categories = useMemo(() => {
    const all = categoriesData?.data ?? [];
    return all
      .filter((category) => (category.products_count ?? 0) > 0)
      .sort(
        (a, b) => (b.products_count ?? 0) - (a.products_count ?? 0),
      );
  }, [categoriesData]);

  const deals = dealsData?.data?.items ?? [];

  return (
    <section className="w-full bg-background dark:bg-neutral-950 transition-colors duration-300">
      <div className="px-1.5 md:px-14 xl:px-16 py-4 md:py-6 w-full">
        <div className="grid lg:grid-cols-[240px_1fr] gap-4">
          {/* ─── LEFT: Category Rail (desktop) ─── */}
          <aside className="hidden lg:flex flex-col lg:h-[420px] bg-white dark:bg-neutral-900 border border-border/60 dark:border-white/10 rounded-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 dark:bg-emerald-500/10 border-b border-border/60 dark:border-white/10">
              <LayoutGrid className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-sm text-foreground">
                Shop by Category
              </h2>
            </div>

            <VerticalScrollView className="flex-1" contentClassName="py-2">
              {isCategoriesLoading ? (
                <div className="space-y-2 px-4 py-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 rounded-sm w-full" />
                  ))}
                </div>
              ) : (
                categories.map((category) => (
                  <SmartLink
                    key={category.id}
                    to={`${WEBSITE_ROUTES.CATEGORIES}/${category.slug}`}
                    className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <span className="line-clamp-1">{category.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 opacity-50" />
                  </SmartLink>
                ))
              )}
            </VerticalScrollView>

            <div className="border-t border-border/60 dark:border-white/10 px-4 py-3">
              <SmartLink
                to={WEBSITE_ROUTES.CATEGORIES}
                className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                View All Categories
              </SmartLink>
            </div>
          </aside>

          {/* ─── RIGHT: Deals Banner Carousel ─── */}
          <div className="relative lg:min-h-[420px]">
            {isDealsLoading ? (
              <Skeleton className="h-[300px] sm:h-[380px] lg:h-[420px] rounded-sm w-full" />
            ) : deals.length > 0 ? (
              <Carousel
                opts={{ loop: true }}
                plugins={[
                  Autoplay({ delay: 5000, stopOnInteraction: false }),
                ]}
                setApi={setCarouselApi}
                className="w-full"
              >
                <CarouselContent className="ml-0">
                  {deals.map((deal, index) => (
                    <CarouselItem key={deal.id} className="pl-0">
                      <SmartLink
                        to={`${WEBSITE_ROUTES.PRODUCT_DETAILS.replace(":slug", deal.slug)}`}
                        className="relative block h-[300px] sm:h-[380px] lg:h-[420px] w-full overflow-hidden rounded-sm group"
                      >
                        <OptimizedImage
                          src={
                            typeof deal.image === "string"
                              ? deal.image
                              : (deal.image?.url ?? FALLBACK_IMAGE)
                          }
                          alt={deal.name}
                          recipe="HERO"
                          aspectRatio="auto"
                          wrapperClassName="absolute inset-0"
                          priority={index === 0}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-red-500 text-white text-[11px] font-black uppercase tracking-wider mb-3">
                            <Flame className="w-3.5 h-3.5" />
                            Deal of the Day
                          </span>
                          <h2 className="text-white font-black text-xl sm:text-3xl lg:text-4xl tracking-tight line-clamp-2 mb-3">
                            {deal.name}
                          </h2>
                          <div className="flex items-center gap-3 mb-4">
                            {deal.on_sale && deal.discount_price != null && (
                              <span className="text-white/70 line-through text-sm sm:text-base">
                                ₦{Number(deal.price).toLocaleString("en-NG")}
                              </span>
                            )}
                            <span className="text-emerald-400 font-black text-xl sm:text-2xl">
                              ₦
                              {Number(
                                deal.discount_price ?? deal.price,
                              ).toLocaleString("en-NG")}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-emerald-600 text-white rounded-sm text-sm font-black transition-colors">
                            Shop Now
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </SmartLink>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {canScrollPrev && (
                  <CarouselPrevious className="left-3 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
                )}
                {canScrollNext && (
                  <CarouselNext className="right-3 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
                )}
              </Carousel>
            ) : null}
          </div>
        </div>

        {/* ─── Mobile: horizontal category chips ─── */}
        <div className="lg:hidden mt-4">
          <HorizontalScrollRail className="gap-2">
            {!isCategoriesLoading &&
              categories.slice(0, 10).map((category) => (
                <SmartLink
                  key={category.id}
                  to={`${WEBSITE_ROUTES.CATEGORIES}/${category.slug}`}
                  className="flex-shrink-0 px-4 py-2 rounded-full border border-border/60 dark:border-white/10 text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                >
                  {category.name}
                </SmartLink>
              ))}
          </HorizontalScrollRail>
        </div>

        {/* ─── Quick Links Strip ─── */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {quickLinks.map((link) => (
            <SmartLink
              to={link.href}
              key={link.title}
              className="group flex items-center gap-3 h-14 sm:h-16 px-4 rounded-sm bg-white dark:bg-neutral-900 border border-border/60 dark:border-white/10 hover:border-primary/30 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
            >
              <div
                className={cn(
                  "w-9 h-9 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform",
                  link.color,
                )}
              >
                <link.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="font-bold text-sm sm:text-base text-foreground">
                {link.title}
              </span>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}
