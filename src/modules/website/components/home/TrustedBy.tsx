import { useGetStoresQuery } from "@/services/storeApi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedBrands() {
  const { data: storesResponse, isLoading } = useGetStoresQuery({ limit: 20 });
  const stores = storesResponse?.data?.items || [];

  const plugin = React.useRef(
    AutoScroll({ 
      speed: 0.8, 
      stopOnInteraction: false, 
      stopOnMouseEnter: true 
    })
  );

  return (
    <section
      data-scroll-anchor="trusted-by"
      className="py-20 bg-muted/20 dark:bg-neutral-900/40 border-y border-border/40 overflow-hidden select-none"
    >
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
          <div className="flex gap-4 overflow-hidden px-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-40 flex-shrink-0" />
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
            <CarouselContent className="flex items-center -ml-0">
              {stores.map((store) => (
                <CarouselItem
                  key={store.id}
                  className="basis-auto pl-8"
                >
                  <div className="group flex items-center justify-center h-14 px-8 bg-card/40 dark:bg-neutral-800/40 border border-border/40 rounded-sm hover:border-primary/40 hover:bg-card/80 transition-all duration-300">
                    <span className="font-bold text-lg md:text-xl text-foreground/60 group-hover:text-primary transition-colors whitespace-nowrap italic opacity-80 group-hover:opacity-100 max-w-[250px] truncate">
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


