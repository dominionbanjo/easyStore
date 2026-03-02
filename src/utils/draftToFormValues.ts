import type { UploadedImage } from "@/modules/vendor/components/add-products/ImageUploadSection";
import type { SpecItem } from "@/modules/vendor/components/add-products/SpecificationsSection";
import { buildSpecsObject } from "@/modules/vendor/utils/addProduct.helpers";
import type { CreateProductCloudinaryArgs } from "@/types/product/productTypes";

export type BuildCreatePayloadArgs = {
  values: {
    name: string;
    category_id: string;
    description?: string;

    price?: number;
    discount_price?: number;
    stock?: number;

    shipping_cost?: number;
    shipping_note?: string;
    returns_note?: string;
  };

  options?: { name: string; values: string[] }[];
  image: UploadedImage | null;
  gallery: UploadedImage[];
  tags: string[];
  highlights: string[];
  variants: {
    combinations?: Record<string, string>;
    size: string;
    price: number;
    stock: number;
    discount_price?: number;
    sku?: string;
  }[];
  specItems: SpecItem[];
};

export function buildCreateProductPayload(
  args: BuildCreatePayloadArgs,
): CreateProductCloudinaryArgs {
  const { values, image, gallery, tags, highlights, specItems } = args;

  return {
    category_id: values.category_id,
    name: values.name,
    description: values.description,

    price: args.variants?.length ? undefined : (values.price ?? undefined),
    stock: args.variants?.length ? undefined : (values.stock ?? undefined),
    discount_price: args.variants?.length ? undefined : values.discount_price,

    tags,
    highlights,
    options: args.options,
    variants: args.variants,

    specs: buildSpecsObject(specItems),

    shipping_cost: values.shipping_cost,
    shipping_note: values.shipping_note,
    returns_note: values.returns_note,

    image,
    gallery,
  };
}
