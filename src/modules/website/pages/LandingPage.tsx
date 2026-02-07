import AllProductsSection from "@/modules/website/components/home/AllProductsSection";
import FeaturedProductsSection from "@/modules/website/components/home/FeaturedProductsSection";
import HeroSection from "@/modules/website/components/home/HeroSection";
import TestimonialsCarousel from "@/modules/website/components/home/TestimonialsSection";
import TrustedBy from "../components/home/TrustedBy";
import BusinessStorySection from "../components/home/BusinessStorySection";
import FeaturedStoresSection from "../components/home/FeaturedStoresSection";
import TopCategoriesSection from "../components/home/TopCategoriesSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />

      <BusinessStorySection />
      <div className="space-y-0">
        <FeaturedStoresSection />
        <TopCategoriesSection />
        <FeaturedProductsSection />
        <AllProductsSection />
        <TrustedBy />
        <TestimonialsCarousel />
      </div>
    </div>
  );
}
