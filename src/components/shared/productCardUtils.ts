import { getSubdomain } from "@/utils/subdomain";
import { buildRoute } from "@/routes/index";

export interface OptionType {
  name: string;
  values: string[];
}

export interface VariantType {
  id: string;
  combinations?: Record<string, string>;
  price: number;
  stock: number;
  discount_price?: number;
  image_url?: string | null;
}

/**
 * Derives product options from either the explicit options prop or the variants combos.
 */
export const getDerivedOptions = (
  options: OptionType[] | null,
  variants: VariantType[] | null
): OptionType[] => {
  if (options && options.length > 0) return options;
  if (!variants || variants.length === 0) return [];
  const optionKeys = new Set<string>();
  variants.forEach((v) =>
    Object.keys(v.combinations || {}).forEach((k) => optionKeys.add(k))
  );
  return Array.from(optionKeys).map((name) => {
    const values = new Set<string>();
    variants.forEach((v) => {
      if (v.combinations?.[name]) values.add(v.combinations[name]);
    });
    return { name, values: Array.from(values) };
  });
};

/**
 * Builds the appropriate product link based on the pathname, subdomain, and store slug.
 */
export const getProductLink = (
  pathname: string,
  slug: string,
  storeSlug?: string,
  previewTemplate?: string | null
): string => {
  const subdomain = getSubdomain();
  const previewQuery = previewTemplate
    ? `?preview_template=${previewTemplate}`
    : "";

  // 1. Check if we are currently viewing a store's page on the base domain (e.g., localhost preview)
  if (pathname.startsWith(`/stores/`)) {
    // We grab the actual slug from the URL to ensure it matches the current view
    const pathParts = pathname.split("/");
    const currentStoreSlug = pathParts[2]; // /stores/:slug
    return `/stores/${currentStoreSlug || storeSlug}/products/${slug}${previewQuery}`;
  }

  // 2. Check if we're naturally on a store subdomain
  const isStoreSubdomain =
    subdomain && subdomain !== "vendor" && subdomain !== "admin";
  if (isStoreSubdomain) {
    return `/products/${slug}${previewQuery}`;
  }

  // Otherwise, we're browsing the Base Site directly
  return buildRoute.productDetails(slug);
};

/**
 * Calculates the discount percentage between regular price and discount price.
 */
export const getDiscountPercentage = (price: string, discountPrice?: string): number => {
  if (!price || !discountPrice) return 0;
  const p = parseFloat(price.replace(/[^0-9.]/g, ""));
  const d = parseFloat(discountPrice.replace(/[^0-9.]/g, ""));
  if (isNaN(p) || isNaN(d) || p === 0) return 0;
  return Math.round(((p - d) / p) * 100);
};
