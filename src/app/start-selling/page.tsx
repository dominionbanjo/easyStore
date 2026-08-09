import SEO from "@/components/shared/SEO";
import HeroSection from "@/modules/website/components/sell/HeroSection";
import BusinessStorySection from "@/modules/website/components/sell/BusinessStorySection";
import SellCtaSection from "@/modules/website/components/sell/SellCtaSection";
import TestimonialsSection from "@/modules/website/components/sell/TestimonialsSection";

export default function StartSellingPage() {
  return (
    <div className="flex flex-col">
      <SEO
        title="Sell on EasyStore — Launch your online store in minutes"
        description="Create a free online store, list your products, reach millions of shoppers and get paid securely. Start selling on EasyStore today."
      />
      <HeroSection />
      <BusinessStorySection />
      <SellCtaSection />
      <TestimonialsSection />
    </div>
  );
}
