import HomepageLayout from "@/components/layout/homepage/HomePageLayout";
import CategoriesSection from "@/modules/website/components/home/CategorySection";
import FeaturedProductsSection from "@/modules/website/components/home/FeaturedProductsSection";
import HeroSection from "@/modules/website/components/home/HeroSection";
import TestimonialsSection from "@/modules/website/components/home/TestimonialsSection";




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
