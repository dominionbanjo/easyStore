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

    /* ───────── GET VENDOR CUSTOMERS ───────── */
    getVendorCustomers: builder.query<any, any>({
      query: (params) => ({
        url: "store-customers",
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["Store"],
    }),

    /* ───────── GET VENDOR'S OWN STORE ───────── */
    getMyStore: builder.query<any, void>({
      query: () => ({
        url: "store/me",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["Store"],
    }),

    /* ───────── UPDATE STORE ───────── */
    updateStore: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `store/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),

    /* ───────── REGISTER BANK ───────── */
    registerStoreBank: builder.mutation<
      any,
      {
        id: string;
        bank_code: string;
        account_number: string;
        settlement_email?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `store/${id}/bank`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Store"],
    }),

    /* ───────── UPDATE BANK ───────── */
    updateStoreBank: builder.mutation<
      any,
      {
        id: string;
        bank_code?: string;
        account_number?: string;
        settlement_email?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `store/${id}/bank`,
        method: "PATCH",
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
  useGetVendorCustomersQuery,
  useGetMyStoreQuery,
  useUpdateStoreMutation,
  useRegisterStoreBankMutation,
  useUpdateStoreBankMutation,
} = storeApi;
