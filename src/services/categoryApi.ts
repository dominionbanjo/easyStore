import type {
  GetCategoriesArgs,
  IGetCategoriesResponse,
} from "@/types/category/categoryTypes";
import { apiManager } from "./apiManager";

export const categoryApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── GET ALL CATEGORIES ───────── */
    getCategories: builder.query<IGetCategoriesResponse, GetCategoriesArgs>({
      query: (params) => ({
        url: "categories",
        method: "GET",
        params,
      }),
    }),
  }),
});

/* ───────── EXPORT HOOKS ───────── */

export const { useGetCategoriesQuery, useLazyGetCategoriesQuery } = categoryApi;
