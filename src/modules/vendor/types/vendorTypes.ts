/* ───────────────── TYPES ───────────────── */

export type LocalImage = {
  file: File;
  preview: string;
};

export type SpecItem = {
  key: string;
  value: string;
};

// export type FormValues = {
//   name: string;
//   category_id: string;
//   description?: string;

//   price: number;
//   discount_price?: number;
//   stock: number;

//   shipping_note?: string;
//   returns_note?: string;

//   country: string;
//   state: string;
//   city: string;
//   shipping_cost?: number;
// };

// vendorTypes.ts
import type { DraftColor } from "@/features/productDraftSlice";

export interface FormValues {
  name: string;
  category_id: string;
  description?: string;

  price: number;
  discount_price?: number;
  stock: number;

  country?: string;
  state?: string;
  city?: string;
  shipping_note?: string;
  returns_note?: string;

  colors: DraftColor[]; // ✅ FIXED
}
