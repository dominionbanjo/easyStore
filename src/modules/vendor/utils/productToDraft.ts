import type {
  IProductDetails,
  IProductImage,
} from "@/types/product/productTypes";

function isProductImage(
  image: string | IProductImage | null | undefined,
): image is IProductImage {
  return typeof image === "object" && image !== null && "url" in image;
}

export function productToDraft(product: IProductDetails) {
  return {
    values: {
      name: product.name,
      category_id: product.category_id,
      description: product.description,

      price: product.price > 0 ? Number(product.price) : undefined,
      discount_price:
        product.discount_price && Number(product.discount_price) > 0
          ? Number(product.discount_price)
          : undefined,
      stock: product.stock > 0 ? product.stock : undefined,

      shipping_cost:
        product.shipping_cost && product.shipping_cost > 0
          ? product.shipping_cost
          : undefined,
      shipping_note: product.shipping_note ?? undefined,
      returns_note: product.returns_note ?? undefined,
    },

    extras: {
      tags: [...(product.tags ?? [])],
      highlights: [...(product.highlights ?? [])],
      options: product.options
        ? product.options.map((o: any) => ({ ...o }))
        : [],
      variants: product.variants
        ? product.variants.map((v) => ({
            sku: v.sku ?? "",
            combinations: v.combinations ? { ...v.combinations } : {},
            price: v.price ? Number(v.price) : 0,
            stock: v.stock ?? 0,
            discount_price: v.discount_price
              ? Number(v.discount_price)
              : undefined,
          }))
        : [],
      specs: product.specs ? { ...product.specs } : {},

      image: isProductImage(product.image)
        ? {
            url: product.image.url,
            public_id: product.image.public_id,
          }
        : null,

      gallery:
        product.gallery?.map((img) => ({
          url: img.url,
          public_id: img.public_id,
        })) ?? [],
    },
  };
}
