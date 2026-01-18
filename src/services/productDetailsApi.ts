import { apiManager } from "./apiManager";

import type {
  GetCategoriesArgs,
  IGetCategoriesResponse,
  IGetColorsResponse,
} from "@/types/category/categoryTypes";

/* ───────────────── COLORS TYPES ───────────────── */

/* ───────────────── PRODUCT DETAILS API ───────────────── */

export const productDetailsApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── GET ALL CATEGORIES (UNCHANGED NAME) ───────── */
    getCategories: builder.query<IGetCategoriesResponse, GetCategoriesArgs>({
      query: (params) => ({
        url: "categories",
        method: "GET",
        params,
      }),
    }),

    /* ───────── GET COLORS ───────── */
    getColors: builder.query<IGetColorsResponse, void>({
      query: () => ({
        url: "colors",
        method: "GET",
      }),
    }),
  }),
});

/* ───────────────── EXPORT HOOKS ───────────────── */

export const {
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetColorsQuery,
  useLazyGetColorsQuery,
} = productDetailsApi;
