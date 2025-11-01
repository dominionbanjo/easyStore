import CategoriesSection from "@/modules/website/components/home/CategorySection";
import FeaturedProductsSection from "@/modules/website/components/home/FeaturedProductsSection";
import HeroSection from "@/modules/website/components/home/HeroSection";
import TestimonialsSection from "@/modules/website/components/home/TestimonialsSection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <TestimonialsSection />
    </>
  );
}
