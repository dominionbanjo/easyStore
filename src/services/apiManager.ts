import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; ///"https://easystore-backend.onrender.com";

export const apiManager = createApi({
  reducerPath: "apiManager",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const cookieToken = Cookies.get("token");
      if (cookieToken) {
        headers.set("Authorization", `Bearer ${cookieToken}`);
      }

      headers.set("Accept", "application/json");

      // ❌ DO NOT set Content-Type here
      return headers;
    },
  }),

  // ⏱ GLOBAL CACHING SETTINGS
  keepUnusedDataFor: 300, // seconds (5 minutes)
  refetchOnReconnect: true,
  refetchOnFocus: false,

  tagTypes: [
    "Auth",
    "User",
    "Cart",
    "Wishlist",
    "Store",
    "Product",
    "Analytics",
  ],
  endpoints: () => ({}),
});
