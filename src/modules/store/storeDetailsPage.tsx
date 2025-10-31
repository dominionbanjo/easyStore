"use client";

import ProductCard from "@/components/shared/ProductCard";
import { TabbedGrid } from "@/components/shared/TabbedGrid";
import { mockCategories } from "@/modules/website/lib/data";
import StoreHeaderSection from "@/modules/store/StoreHeaderSection";

export default function StoreDetailsPage() {
  // ✅ Mock Store Data
  const store = {
    id: 1,
    name: "Urban Threads",
    banner: "/images/fash1.png",
    logo: "/images/store-logo1.png",
    description:
      "Urban Threads is your destination for streetwear, casual fashion, and statement accessories. We blend modern African styles with global trends to create authentic looks that stand out.",
    rating: 4.8,
    location: "Lagos, Nigeria",
    email: "support@urbanthreads.ng",
    phone: "+234 812 345 6789",
    website: "https://urbanthreads.ng",
    totalProducts: 120,
    categories: mockCategories,
  };

  // ✅ Convert mockCategories to tabGroups for TabbedGrid
  const tabGroups = Object.keys(store.categories).map((key) => ({
    value: key.toLowerCase(),
    label: key.charAt(0).toUpperCase() + key.slice(1),
    items: store.categories[key as keyof typeof mockCategories],
  }));

  return (
    <section className="min-h-screen bg-muted/30">
      {/* ─── Store Header ─── */}
      <StoreHeaderSection store={store} />

      {/* ─── Store Categories ─── */}
      <div className="mt-10">
        <StoreCategoriesSection tabGroups={tabGroups} />
      </div>
    </section>
  );
}

//
// ─── Store Header Section ─────────────────────────────────────────────────
//

//
// ─── Store Categories Section ───────────────────────────────────────────────
//
function StoreCategoriesSection({ tabGroups }: { tabGroups: any[] }) {
  return (
    <section className="mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="space-y-2.5">
          <h2 className="text-2xl font-semibold text-foreground">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-sm">
            Browse through product categories from this store
          </p>
        </div>
      </div>

      <TabbedGrid
        tabGroups={tabGroups}
        renderItem={(product: any) => (
          <ProductCard {...product}>
            <ProductCard.Image />
            <ProductCard.Info />
            <ProductCard.Actions />
          </ProductCard>
        )}
      />
    </section>
  );
}
