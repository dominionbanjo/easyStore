import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import ProductGallery from "@/modules/website/components/products/ProductGallery";
import ProductInfoSidebar from "@/modules/website/components/products/ProductInfoSidebar";
import ProductDetailsTabs from "@/modules/website/components/products/ProductDetailsTabs";

import type { RootState } from "@/store";

/* ───────────────── PAGE ───────────────── */

export default function ProductPreviewPage() {
  const navigate = useNavigate();
  const draft = useSelector((state: RootState) => state.productDraft.data);

  /* ───────── GUARD ───────── */
  if (!draft) {
    return <Navigate to="/products/new" replace />;
  }

  /* ───────── IMAGE NORMALIZATION (SAME AS DETAILS PAGE) ───────── */

  const primaryImage = draft.image?.url ?? draft.gallery?.[0]?.url ?? null;

  const galleryImages =
    draft.gallery
      ?.map((g) => g.url)
      .filter((url) => url && url !== primaryImage) ?? [];

  const images = primaryImage
    ? [primaryImage, ...galleryImages]
    : galleryImages;

  /* ───────── UI PRODUCT (MATCHES ProductDetailsPage) ───────── */

  const uiProduct = {
    id: "preview",
    name: draft.name || "Untitled product",
    vendor: "Your Store",
    storeSlug: "preview", // Mock for preview

    price: draft.discount_price ?? draft.price ?? 0,
    originalPrice: draft.discount_price ? draft.price : null,
    category: "",

    rating: 0,
    stock: draft.stock ?? 0,

    image: primaryImage, // ✅ REQUIRED by ProductInfoSidebar
    images,

    description: draft.description ?? "",
    highlights: draft.highlights ?? [],
    specs: draft.specs ?? {},

    shipping: {
      delivery: draft.shipping_note ?? "",
      returns: draft.returns_note ?? "",
      location: "Ships from your store location",
      shippingCost: draft.shipping_cost
        ? `₦${Number(draft.shipping_cost).toLocaleString()}`
        : "Calculated at checkout",
    },

    sizes: draft.sizes ?? [],

    // ✅ FIXED COLORS (FULL OBJECT, NOT HEX ARRAY)
    colors:
      draft.colors?.map((c) => ({
        id: c.id,
        name: c.name,
        hex: c.hex,
      })) ?? [],

    is_in_wishlist: false,
  };

  /* ───────── RENDER ───────── */

  return (
    <section className="max-w-[1480px] mx-auto px-4 py-14 space-y-12">
      {/* Back */}
      <Button
        variant="ghost"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-0"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to editing
      </Button>

      {/* Preview Banner */}
      <div className="rounded-xl bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
        Preview mode — this is how your product page will look
      </div>

      {/* Gallery + Info */}
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-10">
        <ProductGallery images={uiProduct.images} />
        <ProductInfoSidebar product={uiProduct} />
      </div>

      <Separator />

      {/* Tabs */}
      <ProductDetailsTabs product={uiProduct} />
    </section>
  );
}
