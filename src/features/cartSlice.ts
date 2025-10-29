import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ICartItem } from "@/services/cartApi";
import { cartApi } from "@/services/cartApi";

export interface CartState {
  items: ICartItem[];
  totalAmount: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /** Add an item locally */
    addItem: (state, action: PayloadAction<ICartItem>) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.items.push(newItem);
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    /** Remove an item */
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },

    /** Increase quantity */
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
      cartSlice.caseReducers.calculateTotals(state);
    },

    /** Decrease quantity */
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity = Math.max(1, item.quantity - 1);
      cartSlice.caseReducers.calculateTotals(state);
    },

    /** Clear cart */
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalPrice = 0;
    },

    /** Recalculate totals */
    calculateTotals: (state) => {
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
    },
  },

  /** RTK Query Integration */
  extraReducers: (builder) => {
    // 🔹 getCart
    builder.addMatcher(cartApi.endpoints.getCart.matchPending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addMatcher(
      cartApi.endpoints.getCart.matchFulfilled,
      (state, { payload }) => {
        state.isLoading = false;
        state.items = payload.cartItems ?? [];
        cartSlice.caseReducers.calculateTotals(state);
      }
    );

    builder.addMatcher(
      cartApi.endpoints.getCart.matchRejected,
      (state, { error }) => {
        state.isLoading = false;
        state.error = error?.message || "Failed to fetch cart items";
      }
    );

    // 🔹 addToCart
    builder.addMatcher(
      cartApi.endpoints.addToCart.matchFulfilled,
      (state, { payload }) => {
        state.items = payload.cartItems ?? [];
        cartSlice.caseReducers.calculateTotals(state);
      }
    );

    // 🔹 updateCartItem
    builder.addMatcher(
      cartApi.endpoints.updateCartItem.matchFulfilled,
      (state, { payload }) => {
        state.items = payload.cartItems ?? [];
        cartSlice.caseReducers.calculateTotals(state);
      }
    );

    // 🔹 removeCartItem
    builder.addMatcher(
      cartApi.endpoints.removeCartItem.matchFulfilled,
      (state, { meta }) => {
        const id = (meta?.arg as { originalArgs?: string })?.originalArgs ?? "";
        state.items = state.items.filter((i) => i.id !== id);
        cartSlice.caseReducers.calculateTotals(state);
      }
    );

    // 🔹 clearCart
    builder.addMatcher(cartApi.endpoints.clearCart.matchFulfilled, (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalPrice = 0;
    });
  },
});

export const {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
