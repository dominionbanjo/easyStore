import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

import { ProductDetailsSkeleton } from "@/components/skeletons/ProductDetailsSkeleton";

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
    return <ProductDetailsSkeleton />;
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
    storeSlug: store.slug,
    price: product.discount_price ?? product.price,
    originalPrice: product.discount_price ? product.price : null,
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
    <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 space-y-12 md:space-y-16">
      {/* Gallery + Sidebar Container */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-24 justify-center items-start">
        {/* Left Column: Gallery */}
        <div className="w-full lg:w-[55%] xl:w-[60%] flex justify-center lg:justify-end">
          <ProductGallery images={uiProduct.images} />
        </div>

        {/* Right Column: Info */}
        <div className="w-full lg:w-[45%] xl:w-[40%] flex justify-center lg:justify-start">
          <ProductInfoSidebar product={uiProduct} />
        </div>
      </div>

      <Separator />

      {/* Details */}
      <ProductDetailsTabs product={uiProduct} />

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
