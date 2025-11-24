import CategoriesSection from "@/modules/website/components/home/CategorySection";
import FeaturedProductsSection from "@/modules/website/components/home/FeaturedProductsSection";
import HeroSection from "@/modules/website/components/home/HeroSection";
import TestimonialsSection from "@/modules/website/components/home/TestimonialsSection";
import TrustedBy from "../components/home/TrustedBy";

export default function LandingPage() {
  return (
    <>
    {/* <main className=" flex flex-col"> */}
      <HeroSection />
      <TrustedBy />
      <FeaturedProductsSection />
      <CategoriesSection />
      <TestimonialsSection />
    {/* </main> */}
    </>
  );
}
