import { apiManager } from "./apiManager";

import type {
  GetCategoriesArgs,
  IGetCategoriesResponse,
  IGetColorsResponse,
  ICategory,
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
      providesTags: ["Categories"],
    }),

    /* ───────── GET COLORS ───────── */
    getColors: builder.query<IGetColorsResponse, void>({
      query: () => ({
        url: "colors",
        method: "GET",
      }),
      providesTags: ["Colors"],
    }),

    /* ───────── CREATE CATEGORY ───────── */
    createCategory: builder.mutation<
      { data: ICategory },
      { name: string; parent_id?: string | null }
    >({
      query: (body) => ({
        url: "categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    /* ───────── CREATE COLOR ───────── */
    createColor: builder.mutation<
      { data: { color: { id: string; name: string; hex: string } } },
      { name: string; hex: string }
    >({
      query: (body) => ({
        url: "colors",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Colors"],
    }),
  }),
});

/* ───────────────── EXPORT HOOKS ───────────────── */

export const {
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetColorsQuery,
  useLazyGetColorsQuery,
  useCreateCategoryMutation,
  useCreateColorMutation,
} = productDetailsApi;
