import { apiManager } from "./apiManager";

/* ───────────────── TYPES ───────────────── */

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "canceled";

export type PaymentMethod = "offline" | "online";
export type PaymentStatus = "pending" | "success" | "failed";

export interface IOrderItem {
  product_id: string;
  name: string;
  slug: string;
  price: number;
  discount_price?: number | null;
  image?: string | null;
  quantity: number;
  size?: string | null;
  color?: string | null;
  shipping_cost?: number | null;
}

export interface IOrder {
  id: string;
  buyer_id: string;
  vendor_id: string;

  order_items: IOrderItem[];

  subtotal: number;
  tax?: number;
  total: number;

  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;

  payment_reference?: string | null;
  payment_url?: string | null;

  escrow_id?: string | null;
  delivery_id?: string | null;

  notes?: string | null;

  created_at: string;
  updated_at?: string;
}

/* ───────────────── DTO ARGS ───────────────── */

export interface CreateOfflineOrderArgs {
  order_items: IOrderItem[];
  tax?: number;
  notes?: string;
}

export interface CreateOnlineOrderArgs {
  email: string;
  order_items: IOrderItem[];
}

export interface UpdateOrderStatusArgs {
  id: string;
  status: OrderStatus;
}

/* ───────────────── RESPONSES ───────────────── */

export interface OrderResponse {
  success?: boolean;
  message?: string;
  order?: IOrder;
  orders?: IOrder[];
}

export interface OnlineOrderResponse {
  success: boolean;
  successfulOrders: {
    order: IOrder;
    payment_url: string;
  }[];
  failedVendors: {
    vendor_id: string;
    error: string;
  }[];
}

/* ───────────────── API ───────────────── */

export const ordersApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── CREATE ───────── */

    createOfflineOrder: builder.mutation<OrderResponse, CreateOfflineOrderArgs>(
      {
        query: (body) => ({
          url: "orders/offline",
          method: "POST",
          body,
        }),
        invalidatesTags: ["User", "Store"],
      }
    ),

    createOnlineOrder: builder.mutation<
      OnlineOrderResponse,
      CreateOnlineOrderArgs
    >({
      query: (body) => ({
        url: "orders/online",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Store"],
    }),

    /* ───────── PAYMENT ───────── */

    verifyPayment: builder.mutation<any, string>({
      query: (reference) => ({
        url: `orders/verify/${reference}`,
        method: "POST",
      }),
      invalidatesTags: ["User", "Store"],
    }),

    /* ───────── READ ───────── */

    getMyOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: "orders",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getVendorOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: "orders/vendor/me",
        method: "GET",
      }),
      providesTags: ["Store"],
    }),

    getOrderById: builder.query<IOrder, string>({
      query: (id) => ({
        url: `orders/${id}`,
        method: "GET",
      }),
      providesTags: (_r, _e, id) => [{ type: "Store", id }],
    }),

    /* ───────── UPDATE ───────── */

    updateOrderStatus: builder.mutation<any, UpdateOrderStatusArgs>({
      query: ({ id, status }) => ({
        url: `orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Store"],
    }),

    cancelOrder: builder.mutation<any, string>({
      query: (id) => ({
        url: `orders/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["User", "Store"],
    }),

    /* ───────── OFFLINE FULFILLMENT (SELLER) ───────── */

    fulfillOfflineOrder: builder.mutation<any, string>({
      query: (orderId) => ({
        url: `orders/offline/${orderId}/fulfill`,
        method: "PATCH",
      }),
      invalidatesTags: ["Store"],
    }),
  }),
});

/* ───────────────── HOOK EXPORTS ───────────────── */

export const {
  useCreateOfflineOrderMutation,
  useCreateOnlineOrderMutation,
  useVerifyPaymentMutation,
  useGetMyOrdersQuery,
  useGetVendorOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useFulfillOfflineOrderMutation,
} = ordersApi;
