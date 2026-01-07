import { createSlice } from "@reduxjs/toolkit";
import type { ICartItem } from "@/services/cartApi";
import { cartApi } from "@/services/cartApi";

/* ───────────────── STATE ───────────────── */

export interface CartState {
  items: ICartItem[];

  subtotal: number;
  shipping: number;
  total: number;

  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],

  subtotal: 0,
  shipping: 0,
  total: 0,

  isLoading: false,
  error: null,
};

/* ───────────────── SLICE ───────────────── */

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    /** Used ONLY for local reset (e.g. logout) */
    resetCartState: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.shipping = 0;
      state.total = 0;
      state.isLoading = false;
      state.error = null;
    },
  },

  /* ───────────────── RTK QUERY SYNC ───────────────── */
  extraReducers: (builder) => {
    /* ───────── GET CART ───────── */
    builder.addMatcher(cartApi.endpoints.getCart.matchPending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addMatcher(
      cartApi.endpoints.getCart.matchFulfilled,
      (state, { payload }) => {
        state.isLoading = false;

        state.items = payload.data.cart.items;
        state.subtotal = payload.data.cart.subtotal;
        state.shipping = payload.data.cart.shipping;
        state.total = payload.data.cart.total;
      }
    );

    builder.addMatcher(
      cartApi.endpoints.getCart.matchRejected,
      (state, { error }) => {
        state.isLoading = false;
        state.error = error?.message ?? "Failed to fetch cart";
      }
    );

    /* ───────── SHARED CART SYNC HANDLER ───────── */
    const syncCart = (state: CartState, payload: any) => {
      state.items = payload.data.cart.items;
      state.subtotal = payload.data.cart.subtotal;
      state.shipping = payload.data.cart.shipping;
      state.total = payload.data.cart.total;
    };

    /* ───────── ADD ITEM ───────── */
    builder.addMatcher(
      cartApi.endpoints.addItemToCart.matchFulfilled,
      (state, { payload }) => {
        syncCart(state, payload);
      }
    );

    /* ───────── UPDATE ITEM ───────── */
    builder.addMatcher(
      cartApi.endpoints.updateCartItem.matchFulfilled,
      (state, { payload }) => {
        syncCart(state, payload);
      }
    );

    /* ───────── REMOVE ITEM ───────── */
    builder.addMatcher(
      cartApi.endpoints.removeCartItem.matchFulfilled,
      (state, { payload }) => {
        syncCart(state, payload);
      }
    );

    /* ───────── CLEAR CART ───────── */
    builder.addMatcher(
      cartApi.endpoints.clearCart.matchFulfilled,
      (state, { payload }) => {
        syncCart(state, payload);
      }
    );
  },
});

/* ───────────────── EXPORTS ───────────────── */

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
