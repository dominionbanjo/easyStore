import { Separator } from "@/components/ui/separator";

import ProductGallery from "@/modules/website/productDetailsPage/components/ProductGallery";
import ProductInfoSidebar from "@/modules/website/productDetailsPage/components/ProductInfoSidebar";
import ProductDetailsTabs from "@/modules/website/productDetailsPage/components/ProductDetailsTabs";
import ReviewsSection from "@/modules/website/productDetailsPage/components/ReviewsSection";
import RelatedProductsGrid from "@/modules/website/productDetailsPage/components/RelatedProductsGrid";

export default function ProductDetailsPage() {
  const product = {
    id: 101,
    name: "Wireless Headphones Pro Max",
    vendor: "SoundMaster",
    price: "₦99,999",
    category: "Electronics",
    rating: 4.8,
    stock: 8,

    // ─── Media ────────────────────────────────────────────────
    images: [
      "/images/elect0.png",
      "/images/elect1.png",
      "/images/elect2.png",
      "/videos/campaign2.mp4", // autoplay silently
    ],

    // ─── Core Description ─────────────────────────────────────
    description:
      "Experience next-level sound quality with the Wireless Headphones Pro Max. Designed for immersive music and comfort — featuring adaptive noise cancellation, studio-grade sound, and a premium finish that complements your lifestyle.",

    // ─── Highlights ───────────────────────────────────────────
    highlights: [
      "Active Noise Cancelling (ANC)",
      "40-hour playback time",
      "Bluetooth 5.3 with multipoint connection",
      "Soft memory foam cushions",
      "Fast USB-C charging",
      "Seamless pairing with all devices",
      "Premium matte aluminum finish",
    ],

    // ─── Specifications ──────────────────────────────────────
    specs: {
      driver: "40mm dynamic drivers",
      frequencyResponse: "20Hz–20kHz",
      batteryLife: "Up to 40 hours (ANC off)",
      chargingTime: "1.5 hours (USB-C)",
      connectivity: "Bluetooth 5.3, 3.5mm jack",
      compatibility: "iOS, Android, Windows, macOS",
      weight: "280g",
      warranty: "1 Year Limited Warranty",
    },

    // ─── Shipping Info ───────────────────────────────────────
    shipping: {
      delivery: "Ships within 2–4 business days",
      returns:
        "Returns accepted within 7 days of delivery if the item is unused and in its original packaging.",
      location: "Lagos, Nigeria",
      shippingCost: "₦2,500 nationwide",
    },

    // ─── Customization ────────────────────────────────────────
    sizes: ["S", "M", "L", "XL"], // for apparel-type extension
    colors: ["#000000", "#E63946", "#457B9D", "#F4A261", "#FFFFFF"], // black, red, blue, orange, white

    // ─── Related Products ────────────────────────────────────
    related: [
      {
        id: 102,
        name: "SoundMaster Mini Pods",
        price: "₦49,999",
        image: "/images/elect3.png",
        rating: 4.7,
        vendor: "SoundMaster",
      },
      {
        id: 103,
        name: "Bluetooth Speaker Pro",
        price: "₦79,000",
        image: "/images/elect4.png",
        rating: 4.5,
        vendor: "TechSync",
      },
      {
        id: 104,
        name: "Noise Cancelling Earbuds X",
        price: "₦59,999",
        image: "/images/elect5.png",
        rating: 4.6,
        vendor: "UrbanSound",
      },
    ],

    // ─── Reviews (Optional Seed Data) ─────────────────────────
    reviews: [
      {
        id: 1,
        user: "Jane Doe",
        rating: 5,
        comment:
          "Absolutely love these headphones! The ANC is top-notch and the sound is crystal clear.",
        date: "2 days ago",
      },
      {
        id: 2,
        user: "John Smith",
        rating: 4,
        comment:
          "Comfortable and stylish. Battery life is great, but wish the bass was a bit deeper.",
        date: "1 week ago",
      },
    ],
  };

  return (
    <section className="max-w-[1480px] mx-auto px-4 py-14 space-y-16">
      {/* ─── Gallery + Info Grid ─── */}
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-10">
        <ProductGallery images={product.images} />
        <ProductInfoSidebar product={product} />
      </div>

      <Separator />

      {/* ─── Tabs for description / specs / shipping ─── */}
      <ProductDetailsTabs product={product} />

      <Separator />

      {/* ─── Reviews Section ─── */}
      <ReviewsSection productId={product.id} />

      {/* ─── Related Products ─── */}
      <RelatedProductsGrid category={product.category} />
    </section>
  );
}
