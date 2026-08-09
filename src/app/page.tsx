import HomeShoppingHero from "@/modules/website/components/home/HomeShoppingHero";
import ForYouSection from "@/modules/website/components/home/ForYouSection";
import DealsOfTheDaySection from "@/modules/website/components/home/DealsOfTheDaySection";
import TrendingNowSection from "@/modules/website/components/home/TrendingNowSection";
import FeaturedZonesSection from "@/modules/website/components/home/FeaturedZonesSection";
import TopCategoriesSection from "@/modules/website/components/home/TopCategoriesSection";
import FeaturedProductsSection from "@/modules/website/components/home/FeaturedProductsSection";
import FeaturedStoresSection from "@/modules/website/components/home/FeaturedStoresSection";
import AllProductsSection from "@/modules/website/components/home/AllProductsSection";
import TrustedBy from "@/modules/website/components/home/TrustedBy";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <HomeShoppingHero />
      <div className="px-1.5 md:px-14 xl:px-16 w-full space-y-0">
        <ForYouSection />
        <DealsOfTheDaySection />
        <TrendingNowSection />
        <FeaturedZonesSection />
        <TopCategoriesSection />
        <FeaturedProductsSection />
        <FeaturedStoresSection />
        <AllProductsSection />
        <TrustedBy />
      </div>
    </div>
  );
}
