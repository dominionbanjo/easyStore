import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// You can load this from your .env file
const BASE_URL = import.meta.env.VITE_API_URL || "https://api.example.com";

export const apiManager = createApi({
  reducerPath: "apiManager",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Example: attach auth token dynamically
      const token = (getState() as any)?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Auth", "User", "Stay", "Event", "Store"], // define logical entity tags
  endpoints: () => ({}),
});
