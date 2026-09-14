import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";

import { ProductDetailsSkeleton } from "@/components/skeletons/ProductDetailsSkeleton";

import ProductGallery from "@/modules/website/components/products/ProductGallery";
import ProductInfoSidebar from "@/modules/website/components/products/ProductInfoSidebar";
import ProductDetailsTabs from "@/modules/website/components/products/ProductDetailsTabs";
import ReviewsSection from "@/modules/website/components/products/ReviewsSection";
import RelatedProductsGrid from "@/modules/website/components/products/RelatedProductsGrid";
import { formatLocation } from "@/utils/location";

import { useGetSingleProductQuery } from "@/services/productApi";
import { GoBackButton } from "@/components/shared/GoBackButton";
import SEO from "@/components/shared/SEO";

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  return <ProductDetailsInner key={slug} id={slug!} />;
}

/* ───────────────── INNER ───────────────── */

function ProductDetailsInner({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } = useGetSingleProductQuery(id, {
    skip: !id,
  });

  /* ───────── LOADING ───────── */

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  /* ───────── ERROR ───────── */

  if (isError || !data?.data?.product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <p className="text-muted-foreground font-medium mb-6">
          Failed to load product. Please check your connection and try again.
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2.5 bg-primary dark:bg-emerald-500 text-white dark:text-neutral-950 font-bold rounded-sm hover:scale-105 transition-all active:scale-95 text-sm flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
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

    is_in_wishlist: product.is_in_wishlist,
    vendor_id: product.vendor_id,
    installment_enabled: product.installment_enabled ?? false,
    installment_presets: product.installment_presets ?? [],
  };

  /* ───────── RENDER ───────── */

  return (
    <section className="w-full px-4 md:px-6 lg:px-8 pt-0 md:pt-8 pb-8 md:pb-12 space-y-6 md:space-y-16 bg-white dark:bg-neutral-950 transition-colors duration-300">
      <SEO 
        title={uiProduct.name ?? undefined} 
        description={uiProduct.description?.substring(0, 160) ?? undefined}
        image={uiProduct.image ?? undefined} 
      />
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
