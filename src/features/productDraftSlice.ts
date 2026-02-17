import type { UploadedImage } from "@/modules/vendor/components/add-products/ImageUploadSection";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ───────────────── TYPES ───────────────── */

export interface DraftColor {
  id: string;
  name: string;
  hex: string;
}

export interface ProductDraftData {
  id?: string;
  name?: string;
  category_id?: string;
  description?: string;

  price?: number;
  discount_price?: number;
  stock?: number;
  shipping_cost?: number;
  shipping_note?: string;
  returns_note?: string;

  tags?: string[];
  highlights?: string[];
  sizes?: string[];
  variants?: {
    size: string;
    price: number;
    stock: number;
    discount_price?: number;
  }[];
  colors?: DraftColor[];

  specs?: Record<string, string>;

  image?: UploadedImage | null;
  gallery?: UploadedImage[];
}

export interface ProductDraftState {
  data: ProductDraftData | null;
}

/* ───────────────── STATE ───────────────── */

const initialState: ProductDraftState = {
  data: null,
};

/* ───────────────── SLICE ───────────────── */

const productDraftSlice = createSlice({
  name: "productDraft",
  initialState,
  reducers: {
    /** Replace everything (used for hydrate / preview) */
    setProductDraft: (state, action: PayloadAction<ProductDraftData>) => {
      state.data = action.payload;
    },

    /** 🔑 Merge updates while working */
    updateProductDraft: (
      state,
      action: PayloadAction<Partial<ProductDraftData>>,
    ) => {
      state.data = {
        ...(state.data ?? {}),
        ...action.payload,
      };
    },

    clearProductDraft: (state) => {
      state.data = null;
    },
  },
});

export const { setProductDraft, updateProductDraft, clearProductDraft } =
  productDraftSlice.actions;

export default productDraftSlice.reducer;
