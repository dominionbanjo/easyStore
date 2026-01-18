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

  // ✅ LOCATION LIVES HERE
  country?: string;
  state?: string;
  city?: string;

  image: UploadedImage | null;
  gallery: UploadedImage[];
  tags: string[];
  highlights: string[];
  sizes: string[];
  specItems: SpecItem[];
};

export function buildCreateProductPayload(
  args: BuildCreatePayloadArgs,
): CreateProductCloudinaryArgs {
  const {
    values,
    country,
    state,
    city,
    image,
    gallery,
    tags,
    highlights,
    sizes,
    specItems,
  } = args;

  return {
    category_id: values.category_id,
    name: values.name,
    description: values.description,

    price: values.price!,
    stock: values.stock!,
    discount_price: values.discount_price,

    tags,
    highlights,
    sizes,
    colors: values.colors?.map((c) => c.id),

    specs: buildSpecsObject(specItems),

    // ✅ LOCATION PASSED CORRECTLY
    country,
    state,
    city,

    shipping_cost: values.shipping_cost,
    shipping_note: values.shipping_note,
    returns_note: values.returns_note,

    image,
    gallery,
  };
}
