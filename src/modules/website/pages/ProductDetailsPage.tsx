import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

import ProductGallery from "@/modules/website/components/products/ProductGallery";
import ProductInfoSidebar from "@/modules/website/components/products/ProductInfoSidebar";
import ProductDetailsTabs from "@/modules/website/components/products/ProductDetailsTabs";
import ReviewsSection from "@/modules/website/components/products/ReviewsSection";
import RelatedProductsGrid from "@/modules/website/components/products/RelatedProductsGrid";

import { useGetSingleProductQuery } from "@/services/productApi";

export default function ProductDetailsPage() {
  /* ✅ id, NOT ID */
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useGetSingleProductQuery(id!, {
    skip: !id,
  });

  /* ───────────────── LOADING ───────────────── */
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Loading product…
      </div>
    );
  }

  /* ───────────────── ERROR ───────────────── */
  if (isError || !data?.data?.product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        Failed to load product
      </div>
    );
  }

  const { product, store, reviews, related_products } = data.data;

  /* ───────────────── ADAPT BACKEND → UI SHAPE ───────────────── */

  const images = [
    ...(product.gallery?.map((g) => g.url) ?? []),
    ...(product.image
      ? [typeof product.image === "string" ? product.image : product.image.url]
      : []),
  ];

  const uiProduct = {
    id: product.id,
    name: product.name,
    vendor: store.store_name,
    price: product.discount_price ?? product.price,

    category: product.category_ref?.name ?? "",

    rating: Number(product.rating_average ?? 0),
    stock: product.stock,

    images,

    description: product.description ?? "",

    highlights: product.highlights ?? [],

    specs: product.specs ?? {},

    shipping: {
      delivery: product.shipping_note ?? "",
      returns: product.returns_note ?? "",
      location: product.location ?? "",
      shippingCost: product.shipping_cost
        ? `₦${product.shipping_cost.toLocaleString()}`
        : "Calculated at checkout",
    },

    sizes: product.sizes ?? [],
    colors: product.colors ?? [],
    is_in_wishlist: product.is_in_wishlist,
  };

  /* ───────────────── RENDER ───────────────── */

  return (
    <section className="max-w-[1480px] mx-auto px-4 py-14 space-y-16">
      {/* ─── Gallery + Info ─── */}
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-10">
        <ProductGallery images={uiProduct.images} />
        <ProductInfoSidebar product={uiProduct} />
      </div>

      <Separator />

      {/* ─── Tabs ─── */}
      <ProductDetailsTabs product={uiProduct} />

      <Separator />

      {/* ─── Reviews ─── */}
      <ReviewsSection
        productId={product.id}
        reviews={reviews}
        ratingAverage={Number(product.rating_average ?? 0)}
        reviewCount={product.review_count ?? reviews.length}
      />

      {/* ─── Related Products (FROM BACKEND) ─── */}
      {related_products?.length > 0 && (
        <RelatedProductsGrid products={related_products} />
      )}
    </section>
  );
}
