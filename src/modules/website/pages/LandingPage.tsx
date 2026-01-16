import AllProductsSection from "@/modules/website/components/home/AllProductsSection";
import FeaturedProductsSection from "@/modules/website/components/home/FeaturedProductsSection";
import HeroSection from "@/modules/website/components/home/HeroSection";
import TestimonialsCarousel from "@/modules/website/components/home/TestimonialsSection";
import TrustedBy from "../components/home/TrustedBy";

export default function LandingPage() {
  return (
    <>
      {/* <main className=" flex flex-col"> */}
      <HeroSection />
      <TrustedBy />
      <FeaturedProductsSection />
      <AllProductsSection />
      {/* <TestimonialsSection /> */}
      <TestimonialsCarousel />
      {/* </main> */}
    </>
  );
}
