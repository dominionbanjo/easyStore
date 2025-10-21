import HomepageLayout from "@/components/layout/homepage/HomePageLayout";
import CategoriesSection from "@/modules/website/home/components/CategorySection";
import FeaturedProductsSection from "@/modules/website/home/components/FeaturedProductsSection";
import HeroSection from "@/modules/website/home/components/HeroSection";
import TestimonialsSection from "@/modules/website/home/components/TestimonialsSection";

export default function LandingPage() {
  return (
    <HomepageLayout>
      <main className="min-h-screen flex flex-col bg-emerald-50 text-foreground">
        <HeroSection />
        <CategoriesSection />
        <FeaturedProductsSection />
        <TestimonialsSection />
      </main>
    </HomepageLayout>
  );
}
