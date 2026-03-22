import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { getCookieDomain } from "@/utils/subdomain";
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
    message.toLowerCase().includes("invalid credentials") ||
    message.toLowerCase().includes("unauthorized")
  ) {
    // Only proceed if a token actually exists or we are in a protected route
    const currentPath = window.location.pathname;
    const isProtectedRoute =
      currentPath.startsWith("/vendor") ||
      currentPath.startsWith("/admin") ||
      currentPath.startsWith("/account");

    const token = Cookies.get("token");

    if (isProtectedRoute) {
      toast.error("Unauthorized! Session expired or access denied.", {
        description: "Redirecting you to the landing page...",
        duration: 4000,
      });

      // Clear all auth state
      if (token) {
        Cookies.remove("token", { domain: getCookieDomain() });
      }
      api.dispatch(clearUser());

      // Redirect to landing page after a small delay to show the toast
      setTimeout(() => {
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }, 1500);
    } else {
      // If we're on a public route but got a 401 with a token, just clear the invalid token
      if (token) {
        Cookies.remove("token", { domain: getCookieDomain() });
        api.dispatch(clearUser());
      }
    }
    // Stop retrying on auth errors
    return retry.fail(result.error);
  }

  // Stop retrying on other client errors (4xx) - fix double wrapping
  if (typeof status === "number" && status >= 400 && status < 500) {
    return retry.fail(result.error);
  }

  return result;
};
