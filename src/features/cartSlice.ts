import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import type { ICartItem } from "@/services/cartApi";
import { cartApi } from "@/services/cartApi";
import type { ICartItem } from "@/types/cart/cartTypes";

/* ───────────────── STATE ───────────────── */

export interface CartState {
  items: ICartItem[];
  localItems: ICartItem[];

  subtotal: number;
  shipping: number;
  total: number;

  localSubtotal: number;
  localTotal: number;

  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  localItems: [],

  subtotal: 0,
  shipping: 0,
  total: 0,

  localSubtotal: 0,
  localTotal: 0,

  isLoading: false,
  error: null,
};

const calculateLocalTotals = (state: CartState) => {
  state.localSubtotal = state.localItems.reduce(
    (acc, item) => acc + (item.discount_price ?? item.price) * item.quantity,
    0,
  );
  state.localTotal = state.localSubtotal;
};

/* ───────────────── SLICE ───────────────── */

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToLocalCart: (state, action: PayloadAction<ICartItem>) => {
      const itemInfo = action.payload;
      const existingItem = state.localItems.find(
        (item) =>
          item.product_id === itemInfo.product_id &&
          item.size === itemInfo.size &&
          item.color === itemInfo.color,
      );

      if (existingItem) {
        existingItem.quantity += itemInfo.quantity;
      } else {
        state.localItems.push(itemInfo);
      }
      calculateLocalTotals(state);
    },
    updateLocalCartQuantity: (
      state,
      action: PayloadAction<{
        product_id: string;
        quantity: number;
        size?: string | null;
        color?: string | null;
      }>,
    ) => {
      const { product_id, quantity, size, color } = action.payload;
      const existingItem = state.localItems.find(
        (item) =>
          item.product_id === product_id &&
          item.size === size &&
          item.color === color,
      );
      if (existingItem && quantity >= 1) {
        existingItem.quantity = quantity;
      }
      calculateLocalTotals(state);
    },
    removeLocalCartItem: (
      state,
      action: PayloadAction<{
        product_id: string;
        size?: string | null;
        color?: string | null;
      }>,
    ) => {
      const { product_id, size, color } = action.payload;
      state.localItems = state.localItems.filter(
        (item) =>
          !(
            item.product_id === product_id &&
            item.size === size &&
            item.color === color
          ),
      );
      calculateLocalTotals(state);
    },
    clearLocalCart: (state) => {
      state.localItems = [];
      state.localSubtotal = 0;
      state.localTotal = 0;
    },
    /** Used ONLY for local reset (e.g. logout) */
    resetCartState: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.shipping = 0;
      state.total = 0;
      state.localItems = [];
      state.localSubtotal = 0;
      state.localTotal = 0;
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
      },
    );

    builder.addMatcher(
      cartApi.endpoints.getCart.matchRejected,
      (state, { error }) => {
        state.isLoading = false;
        state.error = error?.message ?? "Failed to fetch cart";
      },
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
      },
    );

    /* ───────── UPDATE ITEM ───────── */
    builder.addMatcher(
      cartApi.endpoints.updateCartItem.matchFulfilled,
      (state, { payload }) => {
        syncCart(state, payload);
      },
    );

    /* ───────── REMOVE ITEM ───────── */
    builder.addMatcher(
      cartApi.endpoints.removeCartItem.matchFulfilled,
      (state, { payload }) => {
        syncCart(state, payload);
      },
    );

    /* ───────── CLEAR CART ───────── */
    builder.addMatcher(
      cartApi.endpoints.clearCart.matchFulfilled,
      (state, { payload }) => {
        syncCart(state, payload);
      },
    );
  },
});

/* ───────────────── EXPORTS ───────────────── */

export const {
  resetCartState,
  addToLocalCart,
  updateLocalCartQuantity,
  removeLocalCartItem,
  clearLocalCart,
} = cartSlice.actions;
export default cartSlice.reducer;
