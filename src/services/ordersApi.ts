import type { ICartItem } from "@/types/cart/cartTypes";
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

export interface IOrderMutationResponse {
  success: boolean;
  message?: string;
}

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
  variant_id?: string | null;
  variant_options?: Record<string, string> | null;
}

export interface IOrder {
  id: string;
  buyer_id: string;
  vendor_id: string;

  order_items: IOrderItem[];

  subtotal: number;
  shipping_fee?: number;
  platform_fee?: number;
  tax?: number;
  total: number;

  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;

  payment_reference?: string | null;
  payment_url?: string | null;
  payment_plan_id?: string | null;

  escrow_id?: string | null;
  delivery_id?: string | null;

  notes?: string | null;
  delivery_address_id?: string | null;

  // Relations
  delivery_address?: {
    id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string | null;
  } | null;

  delivery?: {
    id: string;
    delivery_status:
      | "pending"
      | "assigned"
      | "in_transit"
      | "delivered"
      | "confirmed"
      | "failed"
      | "returned";
    tracking_number?: string | null;
    estimated_delivery?: string | null;
    delivered_at?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postal_code?: string | null;
    confirmation_code?: string | null;
  } | null;

  escrow?: {
    id: string;
    status: string;
    release_code?: string | null;
  } | null;

  vendor?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string | null;
    store?: {
      id: string;
      store_name: string;
      slug: string;
      logo?: string | null;
      phone_number?: string | null;
      address_street?: string | null;
      address_city?: string | null;
      address_state?: string | null;
    } | null;
  } | null;

  buyer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string | null;
    avatar?: string | null;
  } | null;

  created_at: string;
  updated_at?: string;
  confirmed?: boolean;
}

/* ───────────────── DTO ARGS ───────────────── */

// DTO for creating order items - matches backend validation
export interface CreateOrderItemDto {
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  size?: string | null;
  color?: string | null;
}

export interface CreateOfflineOrderArgs {
  order_items: IOrderItem[];
  tax?: number;
  notes?: string;
  delivery_address_id?: string;
}

export interface CreateOnlineOrderArgs {
  email: string;
  order_items: CreateOrderItemDto[];
  delivery_rate_id?: string;
  delivery_address_id?: string;
}

export interface ICheckoutSummaryVendor {
  store_id: string | null;
  vendor_id: string;
  store_name: string;
  items: ICartItem[];
  subtotal: number;
  delivery_options: {
    id: string;
    state: string;
    location: string | null;
    fee: number;
    duration: string | null;
  }[];
  escrow_enabled: boolean;
  installments_enabled: boolean;
}

export interface CheckoutSummaryResponse {
  success: boolean;
  data: ICheckoutSummaryVendor[];
}

export interface UpdateOrderStatusArgs {
  id: string;
  status: OrderStatus;
}

export interface GetMyOrdersArgs {
  search?: string;
  status?: OrderStatus | "all";
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
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
  payment_url: string;
  reference: string;
  orders: IOrder[];
}

/* ───────────────── API ───────────────── */

export const ordersApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── CHECKOUT ───────── */
    getCheckoutSummary: builder.mutation<
      CheckoutSummaryResponse,
      { order_items: CreateOrderItemDto[] }
    >({
      query: (body) => ({
        url: "orders/summary",
        method: "POST",
        body,
      }),
    }),

    /* ───────── CREATE ───────── */

    createOfflineOrder: builder.mutation<OrderResponse, CreateOfflineOrderArgs>(
      {
        query: (body) => ({
          url: "orders/offline",
          method: "POST",
          body,
        }),
        invalidatesTags: ["User", "Store", "Cart"],
      },
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
      invalidatesTags: ["User", "Store", "Cart"],
    }),

    createOnlineOrderDirect: builder.mutation<
      {
        status: string;
        message: string;
        data: {
          success: boolean;
          payment_url: string;
          reference: string;
          orders: IOrder[];
        };
      },
      CreateOnlineOrderArgs
    >({
      query: (body) => ({
        url: "orders/online/direct",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Store", "Cart"],
    }),

    /* ───────── PAYMENT ───────── */
    verifyPayment: builder.mutation<
      {
        status: "success" | "error";
        data: {
          success: boolean;
          idempotent?: boolean;
          message?: string;
          orders?: IOrder[];
          /** True when the reference was an installment deposit. */
          installment?: boolean;
          plan_id?: string;
          order_id?: string;
        };
        message?: string;
      },
      string
    >({
      query: (reference) => ({
        url: `orders/verify/${reference}`,
        method: "POST",
      }),
    }),

    retryPayment: builder.mutation<
      {
        success: boolean;
        auto_verified: boolean;
        payment_url?: string;
        reference?: string;
        orders?: IOrder[];
      },
      string
    >({
      query: (id) => ({
        url: `orders/${id}/retry-payment`,
        method: "POST",
      }),
      invalidatesTags: ["User", "Store"],
    }),

    getMyOrders: builder.query<PaginatedResult<IOrder>, GetMyOrdersArgs | void>(
      {
        query: (params) => ({
          url: "orders",
          method: "GET",
          params: params || {},
        }),
        transformResponse: (response: unknown): PaginatedResult<IOrder> => {
          // The backend typically returns { status, message, data: { items, pagination } }
          // but some base queries or interceptors might partially unwrap it.
          const payload =
            (response as { data?: { items?: IOrder[]; pagination?: PaginatedResult<IOrder>["pagination"] } })
              ?.data ?? response;

          const unwrapped = payload as {
            items?: IOrder[];
            pagination?: PaginatedResult<IOrder>["pagination"];
          };

          return {
            items: unwrapped?.items || [],
            pagination: unwrapped?.pagination || {
              total: 0,
              page: 1,
              limit: 10,
              pages: 0,
              hasNext: false,
              hasPrev: false,
            },
          };
        },
        providesTags: ["User"],
      },
    ),

    getVendorOrders: builder.query<
      {
        items: IOrder[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          pages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      },
      { search?: string; status?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "orders/vendor/me",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: unknown) => {
        // Handle wrapped response from backend
        if (
          response &&
          typeof response === "object" &&
          "data" in response
        ) {
          const payload = (response as { data: unknown }).data as {
            items?: IOrder[];
            pagination?: {
              total: number;
              page: number;
              limit: number;
              pages: number;
              hasNext: boolean;
              hasPrev: boolean;
            };
          };
          return {
            items: payload?.items || [],
            pagination: payload?.pagination || {
              total: 0,
              page: 1,
              limit: 10,
              pages: 0,
              hasNext: false,
              hasPrev: false,
            },
          };
        }
        return {
          items: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            pages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      },
      providesTags: ["Store"],
    }),

    getOrderById: builder.query<IOrder, string>({
      query: (id) => ({
        url: `orders/${id}`,
        method: "GET",
      }),
      transformResponse: (response: unknown): IOrder => {
        // Backend returns { status, message, data: order }
        return (
          (response as { data?: IOrder }).data ??
          (response as IOrder)
        );
      },
      providesTags: (_r, _e, id) => [{ type: "Store", id }],
    }),

    /* ───────── UPDATE ───────── */

    updateOrderStatus: builder.mutation<IOrderMutationResponse, UpdateOrderStatusArgs>({
      query: ({ id, status }) => ({
        url: `orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Store"],
    }),

    cancelOrder: builder.mutation<IOrderMutationResponse, string>({
      query: (id) => ({
        url: `orders/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["User", "Store"],
    }),

    /* ───────── OFFLINE FULFILLMENT (SELLER) ───────── */

    fulfillOfflineOrder: builder.mutation<IOrderMutationResponse, string>({
      query: (orderId) => ({
        url: `orders/offline/${orderId}/fulfill`,
        method: "PATCH",
      }),
      invalidatesTags: ["Store"],
    }),

    updateDeliveryStatus: builder.mutation<
      { success: boolean; message?: string },
      { deliveryId: string; status: string }
    >({
      query: ({ deliveryId, status }) => ({
        url: `deliveries/${deliveryId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Store"],
    }),

    /* ───────── RECEIPT ───────── */
    getOrderReceipt: builder.mutation<
      {
        status: string;
        message: string;
        data: { status: string; data: string; filename: string };
      },
      string
    >({
      query: (id) => ({
        url: `orders/${id}/receipt`,
        method: "GET",
      }),
    }),
  }),
});

/* ───────────────── HOOK EXPORTS ───────────────── */

export const {
  useGetCheckoutSummaryMutation,
  useCreateOfflineOrderMutation,
  useCreateOnlineOrderMutation,
  useCreateOnlineOrderDirectMutation,
  useVerifyPaymentMutation,
  useRetryPaymentMutation,
  useGetMyOrdersQuery,
  useGetVendorOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useFulfillOfflineOrderMutation,
  useUpdateDeliveryStatusMutation,
  useGetOrderReceiptMutation,
} = ordersApi;
