import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/** 🔹 Unified User type that matches backend + extended profile */
export type User = {
  id: string;
  email: string;
  account_type: "user" | "vendor" | "admin"; // backend uses this
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  avatar?: string;
  avatar_public_id?: string;
  is_verified?: boolean;
  country?: string;
  bio?: string;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
};

/** 🔹 Redux State */
export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/** 🔹 Initial State */
const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
};

/** 🔹 Slice */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      state.currentUser = action.payload.user;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, updateUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
