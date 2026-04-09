import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  isCartOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const {
  setMobileMenuOpen,
  setCartOpen,
  toggleMobileMenu,
  toggleCart,
} = uiSlice.actions;

export const selectIsMobileMenuOpen = (state: { ui: UIState }) =>
  state.ui.isMobileMenuOpen;
export const selectIsCartOpen = (state: { ui: UIState }) =>
  state.ui.isCartOpen;

export default uiSlice.reducer;
