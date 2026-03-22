import type { IUser } from "@/types/auth/authTypes";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  currentUser: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showOnboardingModal: boolean;
  onboardingModalStep: "role-selection" | "store-form";
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  showOnboardingModal: false,
  onboardingModalStep: "role-selection",
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

    setShowOnboardingModal: (
      state,
      action: PayloadAction<{
        show: boolean;
        step?: "role-selection" | "store-form";
      }>,
    ) => {
      state.showOnboardingModal = action.payload.show;
      if (action.payload.step) {
        state.onboardingModalStep = action.payload.step;
      }
    },
  },
});

export const {
  setUser,
  clearUser,
  updateUser,
  setLoading,
  setShowOnboardingModal,
} = userSlice.actions;

export const selectCurrentUser = (state: { user: UserState }) =>
  state.user.currentUser;

export const selectShowOnboardingModal = (state: { user: UserState }) =>
  state.user.showOnboardingModal;
export const selectOnboardingModalStep = (state: { user: UserState }) =>
  state.user.onboardingModalStep;

export default userSlice.reducer;
