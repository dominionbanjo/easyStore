import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import ProductGallery from "@/modules/website/components/products/ProductGallery";
import ProductInfoSidebar from "@/modules/website/components/products/ProductInfoSidebar";
import ProductDetailsTabs from "@/modules/website/components/products/ProductDetailsTabs";
import ReviewsSection from "@/modules/website/components/products/ReviewsSection";
import RelatedProductsGrid from "@/modules/website/components/products/RelatedProductsGrid";

import { useGetSingleProductQuery } from "@/services/productApi";

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  return <ProductDetailsInner key={slug} id={slug!} />;
}

/* ───────────────── INNER (KEYED) ───────────────── */

function ProductDetailsInner({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetSingleProductQuery(id, {
    skip: !id,
  });

  /* ───────────────── SKELETON LOADER ───────────────── */

  if (isLoading) {
    return (
      <section className="max-w-[1480px] mx-auto px-4 py-14 space-y-16">
        {/* Gallery + Sidebar */}
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10">
          {/* Gallery */}
          <div className="space-y-4">
            <Skeleton className="h-[420px] rounded-2xl" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-1/2" />

            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        <Separator />

        {/* Tabs */}
        <div className="space-y-6">
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-28 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>

        <Separator />

        {/* Reviews */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>

        {/* Related products */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[280px] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
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

  /* ───────────────── ADAPT BACKEND → UI ───────────────── */

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
      {/* Gallery + Info */}
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-10">
        <ProductGallery images={uiProduct.images} />
        <ProductInfoSidebar product={uiProduct} />
      </div>

      <Separator />

      {/* Tabs */}
      <ProductDetailsTabs product={uiProduct} />

      <Separator />

      {/* Reviews */}
      <ReviewsSection
        productId={product.id}
        reviews={reviews}
        ratingAverage={Number(product.rating_average ?? 0)}
        reviewCount={product.review_count ?? reviews.length}
      />

      {/* Related */}
      {related_products?.length > 0 && (
        <RelatedProductsGrid products={related_products} />
      )}
    </section>
  );
}
