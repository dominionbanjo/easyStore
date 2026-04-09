import { lazy, Suspense } from "react";
import HeroSection from "@/modules/website/components/home/HeroSection";

// Below-fold sections — lazy loaded so they don't block the LCP render
const DiscoveryHero = lazy(() => import("../components/home/DiscoveryHero"));
const BusinessStorySection = lazy(
  () => import("../components/home/BusinessStorySection"),
);
const FeaturedStoresSection = lazy(
  () => import("../components/home/FeaturedStoresSection"),
);
const TopCategoriesSection = lazy(
  () => import("../components/home/TopCategoriesSection"),
);
const FeaturedProductsSection = lazy(
  () => import("@/modules/website/components/home/FeaturedProductsSection"),
);
const AllProductsSection = lazy(
  () => import("@/modules/website/components/home/AllProductsSection"),
);
const TrustedBy = lazy(() => import("../components/home/TrustedBy"));
const TestimonialsCarousel = lazy(
  () => import("../components/home/TestimonialsSection"),
);

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* HeroSection is eager — it IS the LCP element */}
      <HeroSection />

      <Suspense fallback={null}>
        <DiscoveryHero />
        <BusinessStorySection />
        <div className="space-y-0">
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
