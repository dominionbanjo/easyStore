import { useGetStoresQuery } from "@/services/storeApi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedBrands() {
  const { data: storesResponse, isLoading } = useGetStoresQuery({ limit: 12 });
  const stores = storesResponse?.data?.items || [];

  const plugin = React.useRef(
    Autoplay({ delay: 0, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  return (
    <section className="py-20 bg-muted/20 dark:bg-neutral-900/40 border-y border-border/40 overflow-hidden">
      <div className="w-full mx-auto px-6">
        <div className="text-center space-y-4 mb-14">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Powering 40,000+ Growing Brands
          </h3>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            From local startups to established enterprises, these businesses
            trust EazyStore to scale their digital commerce.
          </p>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-40 flex-shrink-0" />
            ))}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-0 flex items-center">
              {/* Duplicate list to ensure smooth continuous scroll */}
              {[...stores, ...stores].map((store, index) => (
                <CarouselItem
                  key={`${store.id}-${index}`}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4"
                >
                  <div className="group flex items-center justify-center h-16 px-6 bg-card/50 dark:bg-neutral-800/50 border border-border/50 rounded-sm hover:border-primary/40 hover:bg-card transition-all duration-300">
                    <span className="font-bold text-lg md:text-xl text-foreground/70 group-hover:text-primary transition-colors whitespace-nowrap tracking-wide lowercase italic opacity-80 group-hover:opacity-100">
                      {store.store_name}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
}

