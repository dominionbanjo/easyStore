import CategoriesSection from "@/modules/website/home/components/CategorySection";
import FeaturedProductsSection from "@/modules/website/home/components/FeaturedProductsSection";
import HeroSection from "@/modules/website/home/components/HeroSection";
import TestimonialsSection from "@/modules/website/home/components/TestimonialsSection";

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
