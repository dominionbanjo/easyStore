import type { DraftColor } from "@/features/productDraftSlice";
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

    colors?: DraftColor[];
  };

  image: UploadedImage | null;
  gallery: UploadedImage[];
  tags: string[];
  highlights: string[];
  sizes: string[];
  variants: {
    size: string;
    price: number;
    stock: number;
    discount_price?: number;
  }[];
  specItems: SpecItem[];
};

export function buildCreateProductPayload(
  args: BuildCreatePayloadArgs,
): CreateProductCloudinaryArgs {
  const { values, image, gallery, tags, highlights, sizes, specItems } = args;

  return {
    category_id: values.category_id,
    name: values.name,
    description: values.description,

    price: args.variants?.length ? undefined : (values.price ?? undefined),
    stock: args.variants?.length ? undefined : (values.stock ?? undefined),
    discount_price: args.variants?.length ? undefined : values.discount_price,

    tags,
    highlights,
    sizes,
    variants: args.variants,
    colors: values.colors?.map((c: any) => c.id),

    specs: buildSpecsObject(specItems),

    shipping_cost: values.shipping_cost,
    shipping_note: values.shipping_note,
    returns_note: values.returns_note,

    image,
    gallery,
  };
}
