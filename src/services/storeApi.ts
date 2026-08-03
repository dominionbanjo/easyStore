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
  IStore,
  IStoreDetails,
  IStoreAnalytics,
  ITemplate,
  IStoreTheme,
  IStorePagination,
  IStoreDeliveryRate,
  IMyStoreSummary,
  ISwitchStoreResponse,
} from "@/types/Store/storeTypes";

import { apiManager } from "./apiManager";

export interface CreateStoreArgs extends Partial<IStore> {
  user_id?: string;
  email?: string;
  current_sales_channel?: string;
}

export interface VendorCustomersArgs {
  search?: string;
  sort?: string;
  order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

export interface IVendorCustomer {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  location: string | null;
  orders_count: number;
  total_spent: string;
  rating: string;
  last_order_at: string | null;
  created_at: string;
}

type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

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

    /* ───────── CHECK SUBDOMAIN AVAILABILITY ───────── */
    checkSubdomain: builder.query<{ status: string; message: string; data: { available: boolean } }, { subdomain: string; storeId?: string }>({
      query: ({ subdomain, storeId }) => ({
        url: "store/lookup/check-subdomain",
        method: "GET",
        params: { subdomain, storeId },
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
    createStore: builder.mutation<ApiResponse<IStore>, CreateStoreArgs>({
      query: (body) => ({
        url: "store",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Store"],
    }),

    /* ───────── GET VENDOR CUSTOMERS ───────── */
    getVendorCustomers: builder.query<
      { items: IVendorCustomer[]; pagination: IStorePagination },
      VendorCustomersArgs
    >({
      query: (params) => ({
        url: "store-customers",
        method: "GET",
        params,
      }),
      transformResponse: (
        response: ApiResponse<{
          items: IVendorCustomer[];
          pagination: IStorePagination;
        }>,
      ) => response.data,
      providesTags: ["Store"],
    }),

    /* ───────── GET VENDOR'S OWN STORE ───────── */
    getMyStore: builder.query<IStoreDetails, void>({
      query: () => ({
        url: "store/me",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<IStoreDetails>) =>
        response.data,
      providesTags: ["Store"],
    }),

    /* ───────── GET VENDOR'S STORES ───────── */
    getMyStores: builder.query<IMyStoreSummary[], void>({
      query: () => ({
        url: "store/my-stores",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<IMyStoreSummary[]>) =>
        response.data,
      providesTags: ["Store"],
    }),

    /* ───────── SWITCH ACTIVE STORE ───────── */
    switchStore: builder.mutation<ISwitchStoreResponse, string>({
      query: (storeId) => ({
        url: "auth/switch-store",
        method: "POST",
        body: { store_id: storeId },
      }),
    }),

    /* ───────── UPDATE STORE ───────── */
    updateStore: builder.mutation<
      { success: boolean; message?: string },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `store/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),

    /* ───────── REGISTER BANK ───────── */
    registerStoreBank: builder.mutation<
      { success: boolean; message?: string },
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
      { success: boolean; message?: string },
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

    /* ───────── GET STORE ANALYTICS ───────── */
    getMyStoreAnalytics: builder.query<IStoreAnalytics, void>({
      query: () => ({
        url: "store-analytics/me",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<IStoreAnalytics>) =>
        response.data,
      providesTags: ["Store"],
    }),

    /* ───────── THEME / TEMPLATES ───────── */
    getTemplates: builder.query<ITemplate[], void>({
      query: () => ({
        url: "store/templates",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<ITemplate[]>) => response.data,
      providesTags: ["Templates"],
      keepUnusedDataFor: 2147483647, // Indefinite caching
    }),

    getStoreTheme: builder.query<IStoreTheme, string>({
      query: (slug) => ({
        url: `store/${slug}/theme`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<IStoreTheme>) => response.data,
      providesTags: ["Store"],
    }),

    updateStoreTheme: builder.mutation<
      ApiResponse<IStoreTheme>,
      {
        id: string;
        template_id: string;
        custom_config?: Record<string, unknown>;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `store/${id}/theme`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Store"],
    }),

    /* ───────── DELIVERY RATES ───────── */
    getStoreDeliveryRates: builder.query<IStoreDeliveryRate[], string>({
      query: (storeId) => ({
        url: `store-delivery-rates/store/${storeId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<IStoreDeliveryRate[]>) =>
        response.data,
      providesTags: ["Store"],
    }),

    addStoreDeliveryRate: builder.mutation<
      ApiResponse<IStoreDeliveryRate>,
      { storeId: string; data: Partial<IStoreDeliveryRate> }
    >({
      query: ({ storeId, data }) => ({
        url: `store-delivery-rates/store/${storeId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),

    updateStoreDeliveryRate: builder.mutation<
      ApiResponse<IStoreDeliveryRate>,
      { rateId: string; data: Partial<IStoreDeliveryRate> }
    >({
      query: ({ rateId, data }) => ({
        url: `store-delivery-rates/${rateId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),

    deleteStoreDeliveryRate: builder.mutation<
      ApiResponse<null>,
      string
    >({
      query: (rateId) => ({
        url: `store-delivery-rates/${rateId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),
  }),
});

/* ───────── EXPORT HOOKS ───────── */

export const {
  useCheckStoreNameQuery,
  useLazyCheckStoreNameQuery,
  useCheckSubdomainQuery,
  useLazyCheckSubdomainQuery,

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
  useGetMyStoresQuery,
  useSwitchStoreMutation,
  useGetMyStoreAnalyticsQuery,
  useUpdateStoreMutation,
  useRegisterStoreBankMutation,
  useUpdateStoreBankMutation,

  useGetTemplatesQuery,
  useGetStoreThemeQuery,
  useUpdateStoreThemeMutation,

  useGetStoreDeliveryRatesQuery,
  useAddStoreDeliveryRateMutation,
  useUpdateStoreDeliveryRateMutation,
  useDeleteStoreDeliveryRateMutation,
} = storeApi;
