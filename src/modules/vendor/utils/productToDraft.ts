import type {
  IProductDetails,
  IProductImage,
} from "@/types/product/productTypes";
import type { UploadedImage } from "@/modules/vendor/components/add-products/ImageUploadSection";

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

      price: product.price,
      discount_price: product.discount_price ?? undefined,
      stock: product.stock,

      shipping_cost: product.shipping_cost ?? undefined,
      shipping_note: product.shipping_note ?? undefined,
      returns_note: product.returns_note ?? undefined,

      colors: product.colors ?? [],
    },

    extras: {
      tags: product.tags ?? [],
      highlights: product.highlights ?? [],
      sizes: product.sizes ?? [],
      specs: product.specs ?? {},

      image: isProductImage(product.image)
        ? ({
            url: product.image.url,
            public_id: product.image.public_id,
          } satisfies UploadedImage)
        : null,

      gallery:
        product.gallery?.map((img) => ({
          url: img.url,
          public_id: img.public_id,
        })) ?? [],
    },
  };
}
