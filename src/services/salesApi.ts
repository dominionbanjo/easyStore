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
}

export const salesApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    getSalesTerminalProducts: builder.query<SalesTerminalProduct[], void>({
      query: () => "vendor/products/sales-terminal",
      providesTags: ["Product"],
    }),
    getStaffSummary: builder.query<StaffSummary, void>({
      query: () => "staff/summary",
      providesTags: ["Staff"],
    }),
    recordOfflineSale: builder.mutation<{ success: true; order_id: string }, OfflineSalePayload>({
      query: (body) => ({
        url: "orders/vendor/offline-sale",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product", "Order", "Analytics"],
    }),
  }),
});

export const {
  useGetSalesTerminalProductsQuery,
  useGetStaffSummaryQuery,
  useRecordOfflineSaleMutation,
} = salesApi;
