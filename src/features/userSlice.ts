import type { IUser } from "@/types/auth/authTypes";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/** 🔹 Redux State */
export interface UserState {
  currentUser: IUser | null;
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
    setUser: (state, action: PayloadAction<{ user: IUser }>) => {
      state.currentUser = action.payload.user;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
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
