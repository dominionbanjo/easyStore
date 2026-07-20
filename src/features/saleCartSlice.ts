import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SaleCartItem {
  product_id: string;
  variant_id?: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export type PaymentMethod = "cash" | "transfer" | "pos";

export interface SaleCartState {
  items: SaleCartItem[];
  customerName: string;
  customerEmail: string;
  paymentMethod: PaymentMethod | "";
}

const initialState: SaleCartState = {
  items: [],
  customerName: "",
  customerEmail: "",
  paymentMethod: "",
};

export const saleCartSlice = createSlice({
  name: "saleCart",
  initialState,
  reducers: {
    addToSaleCart: (state, action: PayloadAction<SaleCartItem>) => {
      const existing = state.items.find(
        (i) => i.product_id === action.payload.product_id && i.variant_id === action.payload.variant_id
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    updateSaleCartQuantity: (state, action: PayloadAction<{ product_id: string; variant_id?: string; quantity: number }>) => {
      const item = state.items.find(
        (i) => i.product_id === action.payload.product_id && i.variant_id === action.payload.variant_id
      );
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
      }
      state.items = state.items.filter((i) => i.quantity > 0);
    },
    removeSaleCartItem: (state, action: PayloadAction<{ product_id: string; variant_id?: string }>) => {
      state.items = state.items.filter(
        (i) => !(i.product_id === action.payload.product_id && i.variant_id === action.payload.variant_id)
      );
    },
    setSaleCustomerName: (state, action: PayloadAction<string>) => {
      state.customerName = action.payload;
    },
    setSaleCustomerEmail: (state, action: PayloadAction<string>) => {
      state.customerEmail = action.payload;
    },
    setSalePaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethod = action.payload;
    },
    clearSaleCart: (state) => {
      state.items = [];
      state.customerName = "";
      state.customerEmail = "";
      state.paymentMethod = "";
    },
  },
});

export const {
  addToSaleCart,
  updateSaleCartQuantity,
  removeSaleCartItem,
  setSaleCustomerName,
  setSaleCustomerEmail,
  setSalePaymentMethod,
  clearSaleCart,
} = saleCartSlice.actions;
export const saleCartReducer = saleCartSlice.reducer;
