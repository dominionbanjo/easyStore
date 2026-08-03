import { apiManager } from "./apiManager";

/* ───────────────── TYPES ───────────────── */

export interface StoreAnalyticsSummary {
  total_sales: string;
  orders: number;
  customers: number;
  conversion_rate: string;
  total_products: number;
  out_of_stock_count: number;
  pending_orders_count: number;
}

export interface StoreAnalyticsTrendPoint {
  year: number;
  month: number;
  revenue: number;
  orders: number;
}

export interface StoreAnalyticsTrend {
  monthly: StoreAnalyticsTrendPoint[];
}

export interface StoreAnalyticsImage {
  url: string;
  public_id: string;
}

export interface StoreAnalyticsCustomer {
  id: string;
  name: string;
  email: string;
  location: string | null;
  spent: number;
  orders: number;
}

export interface StoreAnalyticsTopProduct {
  product_id: string;
  name: string;
  slug: string;
  image: StoreAnalyticsImage;
  total_sold: number;
  total_revenue: string;
}

export interface StoreAnalyticsResponse {
  status: string;
  message: string;
  data: {
    summary: StoreAnalyticsSummary;
    trends: StoreAnalyticsTrend;
    customers: StoreAnalyticsCustomer[];
    top_products: StoreAnalyticsTopProduct[];
  };
}

/* ───────────────── API ───────────────── */

export const analyticsApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── ADMIN: GET STORE ANALYTICS BY STORE ID ───────── */

    getStoreAnalyticsByAdmin: builder.query<StoreAnalyticsResponse, string>({
      query: (storeId) => ({
        url: `store-analytics/${storeId}`,
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),

    /* ───────── VENDOR: GET OWN STORE ANALYTICS ───────── */

    getMyStoreAnalytics: builder.query<StoreAnalyticsResponse, void>({
      query: () => ({
        url: "store-analytics/me",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

/* ───────────────── HOOK EXPORTS ───────────────── */

export const { useGetStoreAnalyticsByAdminQuery, useGetMyStoreAnalyticsQuery } =
  analyticsApi;
