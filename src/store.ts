import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../src/features/userSlice";
import productDraftReducer from "../src/features/productDraftSlice";
import cartReducer from "./features/cartSlice";
import { apiManager } from "./services/apiManager";

const rootReducer = combineReducers({
  user: userReducer,
  productDraft: productDraftReducer,
  cart: cartReducer,
  [apiManager.reducerPath]: apiManager.reducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["productDraft", "cart"], // Persist draft and cart
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiManager.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
