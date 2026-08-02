import HeroSection from "@/modules/website/components/home/HeroSection";
import DiscoveryHero from "@/modules/website/components/home/DiscoveryHero";
import BusinessStorySection from "@/modules/website/components/home/BusinessStorySection";
import FeaturedStoresSection from "@/modules/website/components/home/FeaturedStoresSection";
import TopCategoriesSection from "@/modules/website/components/home/TopCategoriesSection";
import FeaturedProductsSection from "@/modules/website/components/home/FeaturedProductsSection";
import AllProductsSection from "@/modules/website/components/home/AllProductsSection";
import TrustedBy from "@/modules/website/components/home/TrustedBy";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <div className="px-1.5 md:px-14 xl:px-16 w-full space-y-0">
        <DiscoveryHero />
        <BusinessStorySection />
        <FeaturedStoresSection />
        <TopCategoriesSection />
        <FeaturedProductsSection />
        <AllProductsSection />
        <TrustedBy />
      </div>
    </div>
  );
}
