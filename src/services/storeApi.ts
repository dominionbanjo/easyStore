import type {
  ICheckStoreNameResponse,
  IGetStoresResponse,
  GetStoresArgs,
  ISearchStoresResponse,
  SearchStoresArgs,
  GetStoreDetailsArgs,
  IStoreDetailsResponse,
  GetStoreProductsArgs,
  IGetStoreProductsResponse,
  GetStoreCategoryProductsArgs,
  IGetStoreCategoryProductsResponse,
} from "@/types/Store/storeTypes";

import { apiManager } from "./apiManager";

export const storeApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── CHECK STORE NAME AVAILABILITY ───────── */
    checkStoreName: builder.query<ICheckStoreNameResponse, { name: string }>({
      query: ({ name }) => ({
        url: "store/lookup/check-name",
        method: "GET",
        params: { name },
      }),
    }),

    /* ───────── GET STORES (LIST) ───────── */
    getStores: builder.query<IGetStoresResponse, GetStoresArgs>({
      query: (params) => ({
        url: "store",
        method: "GET",
        params,
      }),
    }),

    /* ───────── SEARCH STORES ───────── */
    searchStores: builder.query<ISearchStoresResponse, SearchStoresArgs>({
      query: ({ q, ...params }) => ({
        url: "store/search",
        method: "GET",
        params: { q, ...params },
      }),
    }),

    /* ───────── GET STORE DETAILS ───────── */
    getStoreDetails: builder.query<IStoreDetailsResponse, GetStoreDetailsArgs>({
      query: ({ slug, ...params }) => ({
        url: `store/${slug}`,
        method: "GET",
        params,
      }),
    }),

    /* ───────── GET STORE PRODUCTS ───────── */
    getStoreProducts: builder.query<
      IGetStoreProductsResponse,
      GetStoreProductsArgs
    >({
      query: ({ slug, ...params }) => ({
        url: `store/${slug}/products`,
        method: "GET",
        params,
      }),
    }),

    /* ───────── GET STORE CATEGORY PRODUCTS ───────── */
    getStoreCategoryProducts: builder.query<
      IGetStoreCategoryProductsResponse,
      GetStoreCategoryProductsArgs
    >({
      query: ({ slug, categoryId, ...params }) => ({
        url: `store/${slug}/category/${categoryId}/products`,
        method: "GET",
        params,
      }),
    }),
    /* ───────── CREATE STORE ───────── */
    createStore: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "store",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Store"],
    }),
  }),
});

/* ───────── EXPORT HOOKS ───────── */

export const {
  useCheckStoreNameQuery,
  useLazyCheckStoreNameQuery,

  useGetStoresQuery,

  useSearchStoresQuery,
  useLazySearchStoresQuery,

  useGetStoreDetailsQuery,
  useLazyGetStoreDetailsQuery,

  useGetStoreProductsQuery,
  useLazyGetStoreProductsQuery,

  useGetStoreCategoryProductsQuery,
  useLazyGetStoreCategoryProductsQuery,

  useCreateStoreMutation,
} = storeApi;
