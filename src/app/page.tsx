import { lazy, Suspense } from "react";
import HeroSection from "@/modules/website/components/home/HeroSection";

// Below-fold sections — lazy loaded so they don't block the LCP render
const DiscoveryHero = lazy(() => import("@/modules/website/components/home/DiscoveryHero"));
const BusinessStorySection = lazy(
  () => import("@/modules/website/components/home/BusinessStorySection"),
);
const FeaturedStoresSection = lazy(
  () => import("@/modules/website/components/home/FeaturedStoresSection"),
);
const TopCategoriesSection = lazy(
  () => import("@/modules/website/components/home/TopCategoriesSection"),
);
const FeaturedProductsSection = lazy(
  () => import("@/modules/website/components/home/FeaturedProductsSection"),
);
const AllProductsSection = lazy(
  () => import("@/modules/website/components/home/AllProductsSection"),
);
const TrustedBy = lazy(() => import("@/modules/website/components/home/TrustedBy"));
const TestimonialsCarousel = lazy(
  () => import("@/modules/website/components/home/TestimonialsSection"),
);

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* HeroSection is eager — it IS the LCP element */}
      <HeroSection />

      <Suspense fallback={null}>
        <div className="px-1.5 md:px-14 xl:px-16 w-full space-y-0">
          <DiscoveryHero />
          <BusinessStorySection />
          <FeaturedStoresSection />
          <TopCategoriesSection />
          <FeaturedProductsSection />
          <AllProductsSection />
          <TrustedBy />
          <TestimonialsCarousel />
        </div>
      </Suspense>
    </div>
  );
}
