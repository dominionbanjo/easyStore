import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../src/features/userSlice";
import { apiManager } from "./services/apiManager";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [apiManager.reducerPath]: apiManager.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiManager.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
