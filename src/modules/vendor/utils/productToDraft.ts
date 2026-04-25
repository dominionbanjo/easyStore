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
      name: product.name || "",
      category_id: product.category_id || "",
      description: product.description || "",

      price:
        product.price !== undefined && product.price !== null
          ? Number(product.price)
          : undefined,
      discount_price:
        product.discount_price !== undefined && product.discount_price !== null
          ? Number(product.discount_price)
          : undefined,
      stock:
        product.stock !== undefined && product.stock !== null
          ? Number(product.stock)
          : 0,

      shipping_note: product.shipping_note || "",
      returns_note: product.returns_note || "",
    },

    extras: {
      tags: Array.isArray(product.tags) ? [...product.tags] : [],
      highlights: Array.isArray(product.highlights)
        ? [...product.highlights]
        : [],
      options: Array.isArray(product.options)
        ? product.options.map((o: any) => ({
            name: o.name,
            values: [...(o.values || [])],
          }))
        : [],
      variants: Array.isArray(product.variants)
        ? product.variants.map((v) => ({
            id: v.id,
            sku: v.sku || "",
            combinations: v.combinations ? { ...v.combinations } : {},
            price: v.price ? Number(v.price) : 0,
            stock: v.stock ?? 0,
            discount_price:
              v.discount_price !== undefined && v.discount_price !== null
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
