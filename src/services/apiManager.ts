import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5300";

// ---- EXTRA OPTIONS TYPE ----
export type ExtraAuthConfig = {
  auth?: boolean; // true = attach cookie token
};

// ---- RAW BASE QUERY ----
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, api) => {
    const authRequired = (api.extra as ExtraAuthConfig | undefined)?.auth;

    if (authRequired) {
      const token = Cookies.get("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }

    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    headers.set("Accept", "application/json");

    return headers;
  },
});

// ---- TYPED WRAPPER ----
const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  ExtraAuthConfig
> = (args, api, extraOptions) => {
  return rawBaseQuery(args, api, extraOptions);
};

// ---- CREATE API INSTANCE ----
export const apiManager = createApi({
  reducerPath: "apiManager",
  baseQuery,

  keepUnusedDataFor: 300,
  refetchOnReconnect: true,
  refetchOnFocus: false,

  tagTypes: ["Auth", "User", "Cart", "Wishlist", "Store"],
  endpoints: () => ({}),
});
