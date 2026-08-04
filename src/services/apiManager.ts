import { createApi, retry } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./authModes/authModes";

// 🔄 STAGGERED RETRY LOGIC
const staggeredBaseQuery = retry(baseQueryWithAuth, {
  maxRetries: 3,
});

export const apiManager = createApi({
  reducerPath: "apiManager",
  baseQuery: staggeredBaseQuery,

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
    "Draft",
    "Analytics",
    "Messaging",
    "Notification",
    "Broadcast",
    "Payout",
    "Staff",
    "Order",
    "SchoolZone",
    "Categories",
    "Colors",
    "Templates",
  ],
  endpoints: () => ({}),
});
