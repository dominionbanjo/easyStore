import type { IWishlistItem } from "@/types/wishlist/wishlistType";
import { createSlice } from "@reduxjs/toolkit";
import { type PayloadAction } from "@reduxjs/toolkit";

export interface WishlistState {
  item: IWishlistItem | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  item: null,
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<IWishlistItem>) => {
      state.item = action.payload;
    },
    clearWishlist: (state) => {
      state.item = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setWishlist, clearWishlist, setLoading, setError } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
