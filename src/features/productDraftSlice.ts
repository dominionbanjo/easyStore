import type { UploadedImage } from "@/modules/vendor/components/add-products/ImageUploadSection";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DraftColor {
  id: string;
  name: string;
  hex: string;
}

export interface ProductDraftState {
  data: {
    name?: string;
    category_id?: string;
    description?: string;

    price?: number;
    discount_price?: number;
    stock?: number;

    country?: string;
    state?: string;
    city?: string;
    shipping_cost?: number;
    shipping_note?: string;
    returns_note?: string;

    tags?: string[];
    highlights?: string[];
    sizes?: string[];
    colors?: DraftColor[];

    specs?: Record<string, string>;

    image?: UploadedImage | null;
    gallery?: UploadedImage[];
  } | null;
}

const initialState: ProductDraftState = {
  data: null,
};

const productDraftSlice = createSlice({
  name: "productDraft",
  initialState,
  reducers: {
    setProductDraft: (
      state,
      action: PayloadAction<ProductDraftState["data"]>,
    ) => {
      state.data = action.payload;
    },
    clearProductDraft: (state) => {
      state.data = null;
    },
  },
});

export const { setProductDraft, clearProductDraft } = productDraftSlice.actions;

export default productDraftSlice.reducer;
