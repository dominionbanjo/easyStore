import type { PaymentMethod } from "@/features/saleCartSlice";
import { apiManager } from "./apiManager";

export interface SalesTerminalProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  stock: number;
  category: string | null;
  variants: {
    id: string;
    price: number;
    stock: number;
    combinations: Record<string, string>;
    image_url: string | null;
  }[];
}

export interface SalesTerminalCategory {
  name: string;
  count: number;
}

export interface StaffSummary {
  today_sales: number;
  today_orders: number;
  total_products: number;
  low_stock_count: number;
}

export interface OfflineSalePayload {
  items: { product_id: string; variant_id?: string; quantity: number }[];
  customer_name?: string;
  customer_email?: string;
  notes?: string;
  payment_method?: PaymentMethod;
}

export const salesApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    getSalesTerminalProducts: builder.query<
      { items: SalesTerminalProduct[]; pagination: { total: number; page: number; limit: number; pages: number; hasNext: boolean; hasPrev: boolean } },
      { page?: number; limit?: number; q?: string; category?: string } | void
    >({
      query: (params) => ({
        url: "vendor/products/sales-terminal",
        params: params || {},
      }),
      transformResponse: (response: { status: string; message: string; data: { items: SalesTerminalProduct[]; pagination: { total: number; page: number; limit: number; pages: number; hasNext: boolean; hasPrev: boolean } } }) => {
        if (response?.data?.items) {
          return { items: response.data.items, pagination: response.data.pagination };
        }
        const payload = (response as Record<string, unknown>).data as Record<string, unknown> ?? response;
        if (Array.isArray(payload)) {
          return { items: payload as SalesTerminalProduct[], pagination: { total: payload.length, page: 1, limit: payload.length, pages: 1, hasNext: false, hasPrev: false } };
        }
        const p = payload as { items?: SalesTerminalProduct[]; pagination?: { total: number; page: number; limit: number; pages: number; hasNext: boolean; hasPrev: boolean } };
        return {
          items: p.items ?? [],
          pagination: p.pagination ?? { total: 0, page: 1, limit: 24, pages: 0, hasNext: false, hasPrev: false },
        };
      },
      providesTags: ["Product"],
    }),
    getSalesTerminalCategories: builder.query<SalesTerminalCategory[], void>({
      query: () => "vendor/products/sales-terminal/categories",
      transformResponse: (response: { data?: SalesTerminalCategory[] }) => response?.data ?? [],
      providesTags: ["Product"],
    }),
    getStaffSummary: builder.query<StaffSummary, void>({
      query: () => "staff/summary",
      providesTags: ["Staff"],
    }),
    lookupByBarcode: builder.query<BarcodeLookupResult, string>({
      query: (code) => `vendor/products/barcode/${encodeURIComponent(code)}`,
      transformResponse: (response: { data: BarcodeLookupResult }) => response.data,
    }),
    recordOfflineSale: builder.mutation<{ success: boolean; order_id: string }, OfflineSalePayload>({
      query: (body) => ({
        url: "orders/vendor/offline-sale",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: { success: boolean; order_id: string } }) => ({
        success: response.data.success,
        order_id: response.data.order_id,
      }),
      invalidatesTags: ["Product", "Order", "Analytics"],
    }),
  }),
});

export interface BarcodeLookupResult {
  product: SalesTerminalProduct;
  variant: {
    id: string;
    price: number;
    stock: number;
    combinations: Record<string, string>;
    image_url: string | null;
  } | null;
}

export const {
  useGetSalesTerminalProductsQuery,
  useGetSalesTerminalCategoriesQuery,
  useGetStaffSummaryQuery,
  useRecordOfflineSaleMutation,
  useLazyLookupByBarcodeQuery,
} = salesApi;
