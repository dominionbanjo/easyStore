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
import { GoBackButton } from "@/components/shared/GoBackButton";

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
    price:
      product.on_sale && product.discount_price
        ? product.discount_price
        : product.price,
    originalPrice:
      product.on_sale && product.discount_price ? product.price : null,
    category: product.category_ref?.name ?? "",
    slug: product.slug, // ✅ added for sharing
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
    },

    options: product.options ?? null,
    variants:
      product.variants?.map((v) => ({
        id: v.id,
        combinations: v.combinations,
        size: v.size,
        price: Number(v.price),
        stock: v.stock,
        discount_price: v.discount_price ? Number(v.discount_price) : undefined,
        image_url: v.image_url ?? undefined, // null → undefined to satisfy ProductVariant type
      })) ?? [],

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
    <section className="w-full px-4 md:px-6 lg:px-8 pt-16 pb-8 md:pt-20 md:pb-12 space-y-12 md:space-y-16 bg-white dark:bg-neutral-950 transition-colors duration-300">
      <GoBackButton className="mb-2" />
      {/* Gallery + Sidebar Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-start">
        {/* Left Column: Gallery */}
        <div className="w-full flex justify-center lg:justify-end">
          <ProductGallery images={uiProduct.images} />
        </div>

        {/* Right Column: Info */}
        <div className="w-full flex justify-center lg:justify-start">
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
