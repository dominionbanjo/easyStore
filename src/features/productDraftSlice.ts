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
  options?: { name: string; values: string[] }[];
  variants?: {
    id?: string;
    sku?: string;
    combinations?: Record<string, string>;
    size?: string;
    price: number;
    stock: number;
    discount_price?: number;
  }[];

  /* legacy */
  sizes?: string[];
  colors?: DraftColor[];

  specs?: Record<string, string>;

  image?: UploadedImage | null;
  gallery?: UploadedImage[];
}

export interface ProductDraftState {
  data: ProductDraftData | null;
  isSyncing: boolean;
  lastSynced: string | null;
}

/* ───────────────── STATE ───────────────── */

const initialState: ProductDraftState = {
  data: null,
  isSyncing: false,
  lastSynced: null,
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

    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
      if (!action.payload) {
        state.lastSynced = new Date().toISOString();
      }
    },
  },
});

export const {
  setProductDraft,
  updateProductDraft,
  clearProductDraft,
  setSyncing,
} = productDraftSlice.actions;

export default productDraftSlice.reducer;
