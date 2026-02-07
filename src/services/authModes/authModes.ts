import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { clearUser } from "@/features/userSlice";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = Cookies.get("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const error = result.error as any;
  const status = error?.status || error?.originalStatus;

  // 🏥 ENSURE ERROR MESSAGE IS EXTRACTED ROBUSTLY (Mirroring errorHandler.ts logic)
  let message = "";
  const errorData = error?.data;
  if (errorData) {
    if (typeof errorData.message === "string") message = errorData.message;
    else if (typeof errorData.error === "string") message = errorData.error;
    else if (Array.isArray(errorData.message))
      message = errorData.message.join(", ");
    else if (typeof errorData === "string") message = errorData;
  }
  if (!message && error?.message) message = error.message;

  // 🔐 ENRICH ERROR WITH MESSAGE FOR DOWNSTREAM CONSUMPTION
  if (error && !error.message && message) {
    error.message = message;
  }

  if (
    status === 401 ||
    message.toLowerCase().includes("invalid token") ||
    message.toLowerCase().includes("invalid credentials")
  ) {
    // Only proceed if a token actually exists (to prevent infinite loops on login page)
    if (Cookies.get("token")) {
      toast.error("Session expired. Please log in again.");
      Cookies.remove("token");
      api.dispatch(clearUser());

      const currentPath = window.location.pathname + window.location.search;
      const redirectUrl = `/auth/login?redirect=${encodeURIComponent(
        currentPath,
      )}`;

      // Use a slight delay to allow the toast to be visible
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 800);
    }
    // Stop retrying on auth errors - fix double wrapping
    return retry.fail(result.error);
  }

  // Stop retrying on other client errors (4xx) - fix double wrapping
  if (typeof status === "number" && status >= 400 && status < 500) {
    return retry.fail(result.error);
  }

  return result;
};
