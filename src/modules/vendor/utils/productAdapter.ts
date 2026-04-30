import type {
  IProductDetails,
  IProductStore,
  IProductReview,
} from "@/types/product/productTypes";
import type { ProductActionProps } from "../hooks/useProductActions";
import { formatLocation } from "@/utils/location";

export interface UIProduct extends ProductActionProps {
  vendor: string;
  category: string;
  categoryId: string | null;
  rating: number;
  reviewCount: number;
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  shipping: {
    delivery: string;
    returns: string;
    location: string;
  };
  images: string[];
  colors: { id: string; name: string; hex: string }[];
  sizes: string[];
  slug: string;
}

export function adaptProductToUI(
  product: IProductDetails,
  store: IProductStore,
  reviews: IProductReview[] = [],
): UIProduct {
  /* ───────── IMAGE NORMALIZATION ───────── */
  const primaryImage =
    typeof product.image === "string"
      ? product.image
      : (product.image?.url ?? null);

  const galleryImages =
    product.gallery
      ?.map((g) => g.url)
      .filter((url: string) => url && url !== primaryImage) ?? [];

  const images = primaryImage
    ? [primaryImage, ...galleryImages]
    : galleryImages;

  return {
    id: product.id,
    name: product.name,
    vendor: store.store_name,
    storeSlug: store.slug,
    slug: product.slug,
    price:
      product.on_sale && product.discount_price
        ? product.discount_price
        : product.price,
    originalPrice:
      product.on_sale && product.discount_price ? product.price : null,
    category: product.category_ref?.name ?? "",
    categoryId: product.category_ref?.id ?? null,
    rating: Number(product.rating_average ?? 0),
    reviewCount: product.review_count ?? reviews.length,
    stock: product.stock,

    image: primaryImage,
    images,

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
        image_url: v.image_url ?? undefined,
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
}
