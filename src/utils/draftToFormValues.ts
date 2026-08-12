import type { UploadedImage } from "@/modules/vendor/components/add-products/ImageUploadSection";
import type { SpecItem } from "@/modules/vendor/components/add-products/SpecificationsSection";
import { buildSpecsObject } from "@/modules/vendor/utils/addProduct.helpers";
import type { CreateProductArgs } from "@/types/product/productTypes";

export type BuildCreatePayloadArgs = {
  values: {
    name: string;
    category_id: string;
    description?: string | null;
    barcode?: string | null;

    price?: number | null;
    discount_price?: number | null;
    stock?: number | null;

    shipping_note?: string | null;
    returns_note?: string | null;

    installment_enabled?: boolean;
    installment_presets?: string[];
  };

  options?: { name: string; values: string[] }[] | null;
  image: UploadedImage | null;
  gallery: UploadedImage[];
  tags: string[];
  highlights: string[];
  variants: {
    combinations?: Record<string, string>;
    size?: string;
    price: number;
    stock: number;
    discount_price?: number | null;
    sku?: string;
  }[];
  specItems: SpecItem[];
};

export function buildCreateProductPayload(
  args: BuildCreatePayloadArgs,
): CreateProductArgs {
  const { values, image, gallery, tags, highlights, specItems } = args;

  return {
    category_id: values.category_id,
    name: values.name,
    description: values.description,
    barcode: values.barcode || undefined,

    price: args.variants?.length ? undefined : (values.price ?? undefined),
    stock: args.variants?.length ? undefined : (values.stock ?? undefined),
    discount_price: args.variants?.length ? undefined : values.discount_price,

    tags,
    highlights,
    options: args.options,
    variants: args.variants,

    specs: buildSpecsObject(specItems),

    shipping_note: values.shipping_note,
    returns_note: values.returns_note,

    installment_enabled: values.installment_enabled,
    installment_presets: values.installment_presets,

    image,
    gallery,
  };
}
