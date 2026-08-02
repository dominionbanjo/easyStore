import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LocationSource = "manual" | "gps" | "address";

export interface LocationState {
  /** Selected Nigerian state NAME (e.g. "Lagos"), or null for All Nigeria */
  state: string | null;
  source: LocationSource | null;
}

const initialState: LocationState = {
  state: null,
  source: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocationState: (
      state,
      action: PayloadAction<{ state: string; source: LocationSource }>,
    ) => {
      state.state = action.payload.state;
      state.source = action.payload.source;
    },
    clearLocationState: (state) => {
      state.state = null;
      state.source = null;
    },
  },
});

export const { setLocationState, clearLocationState } = locationSlice.actions;

export const selectLocationState = (state: { location: LocationState }) =>
  state.location.state;
export const selectLocationSource = (state: { location: LocationState }) =>
  state.location.source;

export default locationSlice.reducer;
