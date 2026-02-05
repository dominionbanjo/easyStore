import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import ProductGallery from "@/modules/website/components/products/ProductGallery";
import ProductInfoSidebar from "@/modules/website/components/products/ProductInfoSidebar";
import ProductDetailsTabs from "@/modules/website/components/products/ProductDetailsTabs";
import ReviewsSection from "@/modules/website/components/products/ReviewsSection";
import RelatedProductsGrid from "@/modules/website/components/products/RelatedProductsGrid";
import { formatLocation } from "@/utils/location";

import { useGetSingleProductQuery } from "@/services/productApi";

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  return <ProductDetailsInner key={slug} id={slug!} />;
}

/* ───────────────── INNER ───────────────── */

function ProductDetailsInner({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetSingleProductQuery(id, {
    skip: !id,
  });

  /* ───────── LOADING ───────── */

  if (isLoading) {
    return (
      <section className="max-w-[1480px] mx-auto px-4 py-10 space-y-12">
        {/* Gallery + Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <Skeleton className="w-full aspect-square md:aspect-[4/5] rounded-2xl" />

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 shrink-0 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Info sidebar */}
          <div className="space-y-5">
            <Skeleton className="h-7 w-4/5" />
            <Skeleton className="h-5 w-2/5" />

            <Skeleton className="h-8 w-1/3" />

            {/* Price / CTA */}
            <Skeleton className="h-12 w-full rounded-xl" />

            {/* Meta rows */}
            <div className="space-y-3 pt-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Tabs skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
        </div>

        <Separator />

        {/* Reviews skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ───────── ERROR ───────── */

  if (isError || !data?.data?.product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        Failed to load product
      </div>
    );
  }

  const { product, store, reviews, related_products } = data.data;

  /* ───────── IMAGE NORMALIZATION (FIXED) ───────── */

  const primaryImage =
    typeof product.image === "string"
      ? product.image
      : (product.image?.url ?? null);

  const galleryImages =
    product.gallery
      ?.map((g) => g.url)
      .filter((url) => url && url !== primaryImage) ?? [];

  const images = primaryImage
    ? [primaryImage, ...galleryImages]
    : galleryImages;

  /* ───────── UI ADAPTER ───────── */

  const uiProduct = {
    id: product.id,
    name: product.name,
    vendor: store.store_name,
    price: product.discount_price ?? product.price,
    category: product.category_ref?.name ?? "",
    rating: Number(product.rating_average ?? 0),
    stock: product.stock,

    image: primaryImage, // ✅ used by wishlist
    images, // ✅ used by gallery

    description: product.description ?? "",
    highlights: product.highlights ?? [],
    specs: product.specs ?? {},

    shipping: {
      delivery: product.shipping_note ?? "",
      returns: product.returns_note ?? "",
      location: formatLocation({
        city: store.address_city,
        state: store.address_state,
        country: store.address_country,
        postalCode: store.address_postal_code,
      }),
      shippingCost: product.shipping_cost
        ? `₦${Number(product.shipping_cost).toLocaleString()}`
        : "Calculated at checkout",
    },

    sizes: product.sizes ?? [],
    colors:
      product.colors?.map((c) => ({
        id: c.id,
        name: c.name,
        hex: c.hex,
      })) ?? [],

    is_in_wishlist: product.is_in_wishlist,
  };

  /* ───────── RENDER ───────── */

  return (
    <section className="max-w-[1480px] mx-auto px-4 py-10 space-y-16">
      {/* Gallery + Sidebar */}
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-10">
        <ProductGallery images={uiProduct.images} />
        <ProductInfoSidebar product={uiProduct} />
      </div>

      <Separator />

      {/* Details */}
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
