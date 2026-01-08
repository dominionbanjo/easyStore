// features/userSlice.ts
import type { IUser } from "@/types/auth/authTypes";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  currentUser: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: IUser }>) => {
      state.currentUser = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    clearUser: () => initialState, // ✅ full reset (important)

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
