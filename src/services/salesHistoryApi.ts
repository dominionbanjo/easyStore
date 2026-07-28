import { apiManager } from "./apiManager";

export interface SalesRecord {
  id: string;
  items: { name: string; quantity: number; price: number; image?: string | null }[];
  subtotal: number;
  total: number;
  notes: string | null;
  recorded_by: string | null;
  staff_name: string | null;
  created_at: string;
  payment_method: string;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  unit_price: number;
  image?: string | null;
  size?: string | null;
  color?: string | null;
  variant_id?: string | null;
  variant_options?: Record<string, string> | null;
}

export interface ReceiptData {
  id: string;
  order_reference: string;
  store_name: string;
  store_logo: string | null;
  items: ReceiptItem[];
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  staff_name: string | null;
  notes: string | null;
  created_at: string;
}

export const salesHistoryApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    getSalesHistory: builder.query<
      { data: SalesRecord[]; pagination: { total: number; page: number; limit: number; pages: number; hasNext: boolean; hasPrev: boolean } },
      { page?: number; limit?: number; staffId?: string; dateFrom?: string; dateTo?: string; search?: string }
    >({
      query: (params) => ({ url: "orders/vendor/sales-history", method: "GET", params }),
      transformResponse: (response: { status: string; message: string; data: { items: SalesRecord[]; pagination: { total: number; page: number; limit: number; pages: number; hasNext: boolean; hasPrev: boolean } } }) => ({
        data: response.data.items,
        pagination: response.data.pagination,
      }),
      providesTags: ["Order"],
    }),
    getReceiptData: builder.query<ReceiptData, string>({
      query: (id) => `orders/${id}/receipt-data`,
      transformResponse: (response: { status: string; message: string; data: ReceiptData }) => response.data,
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetSalesHistoryQuery, useGetReceiptDataQuery, useLazyGetReceiptDataQuery } = salesHistoryApi;
