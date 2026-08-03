import { apiManager } from "./apiManager";
import type { IUser } from "@/types/auth/authTypes";
import type { IOrder } from "./ordersApi";

// Extended type with store relation + extra admin fields
export interface IAdminUser extends IUser {
  store?: {
    id: string;
    store_name: string;
    slug: string;
    logo: string | null;
    category: string | null;
    rating_average: number | null;
    created_at: string;
    address_city?: string | null;
    address_state?: string | null;
    address_country?: string | null;
    status?: "active" | "pending" | "restricted" | "banned";
  } | null;
  phone_number: string | null;
  username: string | null;
  signup_medium: string | null;
  payout_verified: boolean;
}

export interface IAdminTransaction {
  id: string;
  order_id: string | null;
  escrow_id: string | null;
  user_id: string | null;
  vendor_id: string | null;
  type: string;
  amount: number;
  currency: string;
  reference: string | null;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user?: IAdminUser | null;
  vendor?: IAdminUser | null;
  is_flagged?: boolean;
}

export interface IBroadcast {
  id: string;
  subject: string;
  body: string;
  target: "all" | "vendors" | "users" | "specific";
  recipients: string[] | null;
  scheduled_at: string | null;
  sent_at: string | null;
  status: "pending" | "sent" | "failed";
  is_recurring: boolean;
  is_active: boolean;
  recurrence_type: "daily" | "weekly" | "monthly" | null;
  recurrence_days: string[] | null;
  recurrence_time: string | null;
  recurrence_day_of_month: string[] | null;
  failure_reason: string | null;
  created_at: string;
}

export interface IAutomatedNotification {
  id: string;
  title: string;
  message: string;
  type: "system" | "vendor" | "user" | "alert" | "announcement";
  status: "active" | "read" | "unread" | "pending" | "sent" | "failed";
  target: "all" | "vendors" | "users" | "specific";
  recipients: string[] | null;
  scheduled_at: string | null;
  sent_at: string | null;
  is_recurring: boolean;
  is_active: boolean;
  recurrence_type: "daily" | "weekly" | "monthly" | null;
  recurrence_days: string[] | null;
  recurrence_time: string | null;
  recurrence_day_of_month: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface IAdminPayout {
  id: string;
  vendor_id: string;
  amount_kobo: number;
  status: "pending" | "processing" | "paid" | "failed" | "pending_manual" | "success" | "reversed";
  reference: string;
  metadata: { transaction?: IAdminTransaction } | null;
  created_at: string;
  updated_at: string;
  vendor?: IAdminUser | null;
  vendor_bank?: {
    store_name: string;
    bank_name: string;
    account_number: string;
    account_name: string | null;
  } | null;
}

export interface IAdminEscrow {
  id: string;
  order_id: string;
  buyer_id: string;
  vendor_id: string;
  subtotal_kobo: number;
  shipping_kobo: number;
  escrow_fee_kobo: number;
  total_amount_kobo: number;
  amount: number;
  status: "held" | "released" | "disputed" | "refunded" | "completed" | "funded" | "pending";
  payout_id: string | null;
  created_at: string;
  updated_at: string;
  buyer?: IAdminUser | null;
  vendor?: IAdminUser | null;
  order?: IOrder | null;
}

interface IPaginationMeta {
  total: number;
  page: number | string;
  limit: number | string;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface IPaginatedResponse<T> {
  message: string;
  data: {
    items: T[];
    pagination: IPaginationMeta;
  };
}

export interface IUpdateUserStatusPayload {
  userId: string;
  status: "active" | "pending" | "restricted" | "banned";
}

export interface IUpdateVendorStatusPayload {
  storeId: string;
  status: "active" | "pending" | "restricted" | "banned";
}

/* ─── Analytics Types ─── */
export interface IOverviewStats {
  totals: {
    users: number;
    vendors: number;
    stores: number;
    products: number;
    orders: number;
  };
  revenue: { thisMonth: number; lastMonth: number };
  newUsers: { thisMonth: number; lastMonth: number };
  orders: { thisMonth: number; lastMonth: number };
  pendingVendors: number;
  userStatusBreakdown: { status: string; count: string }[];
  vendorStatusBreakdown: { status: string; count: string }[];
  transactionStatusBreakdown: {
    status: string;
    count: string;
    total: string;
  }[];
}

export interface IGrowthDataPoint {
  label: string;
  period: string;
  users: number;
  vendors: number;
  revenue: number;
  orders: number;
}

export interface IDistributionItem {
  name: string;
  value: number;
}

export interface ITransactionTypeItem {
  name: string;
  count: number;
  total: number;
}

export interface IRecentSignup {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  account_type: string;
  account_status: string;
  created_at: string;
}

export interface ITopStore {
  id: string;
  store_name: string;
  slug: string;
  category: string | null;
  total_revenue: number;
  total_orders: number;
  total_products: number;
  rating_average: number;
  created_at: string;
}

export interface IOrderStatusItem {
  name: string;
  count: number;
  totalAmount: number;
}

export interface IRevenueDataPoint {
  month: string;
  revenue: number;
  txCount: number;
}

const buildQuery = (params: Record<string, unknown>) => {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "all" && val !== "")
      urlParams.append(key, String(val));
    if (val === 0) urlParams.append(key, "0");
  });
  return urlParams.toString();
};

export const adminApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    // ─── All users ───
    getAdminUsers: builder.query<
      IPaginatedResponse<IAdminUser>,
      {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
        status?: string;
      }
    >({
      query: (params) => `admin/users?${buildQuery(params)}`,
      providesTags: ["User"],
    }),

    // ─── Vendor-only list ───
    getAdminVendors: builder.query<
      IPaginatedResponse<IAdminUser>,
      { page?: number; limit?: number; search?: string; status?: string }
    >({
      query: (params) => `admin/users/vendors?${buildQuery(params)}`,
      providesTags: ["User"],
    }),

    // ─── Single user by ID ───
    getAdminUser: builder.query<{ message: string; data: IAdminUser }, string>({
      query: (id) => `admin/users/${id}`,
      providesTags: (_res, _err, id) => [{ type: "User", id }],
    }),

    // ─── Update status ───
    updateAdminUserStatus: builder.mutation<
      { message: string; user: { id: string; account_status: string } },
      IUpdateUserStatusPayload
    >({
      query: ({ userId, status }) => ({
        url: `admin/users/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["User"],
    }),

    // ─── Update vendor store status ───
    updateAdminVendorStatus: builder.mutation<
      { message: string; store: { id: string; status: string } },
      IUpdateVendorStatusPayload
    >({
      query: ({ storeId, status }) => ({
        url: `admin/users/vendor/${storeId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["User"],
    }),

    // ─── Transactions ───
    getAdminTransactions: builder.query<
      IPaginatedResponse<IAdminTransaction>,
      {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
        status?: string;
      }
    >({
      query: (params) => `admin/transactions?${buildQuery(params)}`,
      providesTags: ["Analytics"],
    }),

    // ─── Analytics: Overview ───
    getAdminOverview: builder.query<
      { message: string; data: IOverviewStats },
      void
    >({
      query: () => "admin/analytics/overview",
      providesTags: ["Analytics"],
    }),

    // ─── Analytics: Growth Chart ───
    getAdminGrowthChart: builder.query<
      { message: string; data: IGrowthDataPoint[] },
      { months?: number }
    >({
      query: (params) => `admin/analytics/growth?${buildQuery(params)}`,
      providesTags: ["Analytics"],
    }),

    // ─── Analytics: User Distribution ───
    getAdminUserDistribution: builder.query<
      { message: string; data: IDistributionItem[] },
      void
    >({
      query: () => "admin/analytics/user-distribution",
      providesTags: ["Analytics"],
    }),

    // ─── Analytics: Transaction Type Breakdown ───
    getAdminTransactionBreakdown: builder.query<
      { message: string; data: ITransactionTypeItem[] },
      void
    >({
      query: () => "admin/analytics/transaction-breakdown",
      providesTags: ["Analytics"],
    }),

    // ─── Analytics: Recent Signups ───
    getAdminRecentSignups: builder.query<
      { message: string; data: IRecentSignup[] },
      { limit?: number }
    >({
      query: (params) => `admin/analytics/recent-signups?${buildQuery(params)}`,
      providesTags: ["Analytics"],
    }),

    // ─── Analytics: Top Stores ───
    getAdminTopStores: builder.query<
      { message: string; data: ITopStore[] },
      { limit?: number }
    >({
      query: (params) => `admin/analytics/top-stores?${buildQuery(params)}`,
      providesTags: ["Analytics"],
    }),

    // ─── Analytics: Order Breakdown ───
    getAdminOrderBreakdown: builder.query<
      { message: string; data: IOrderStatusItem[] },
      void
    >({
      query: () => "admin/analytics/order-breakdown",
      providesTags: ["Analytics"],
    }),

    // ─── Analytics: Revenue by Month ───
    getAdminRevenue: builder.query<
      { message: string; data: IRevenueDataPoint[] },
      { months?: number }
    >({
      query: (params) => `admin/analytics/revenue?${buildQuery(params)}`,
      providesTags: ["Analytics"],
    }),

    // ─── Analytics: Signup Methods ───
    getAdminSignupMethods: builder.query<
      { message: string; data: IDistributionItem[] },
      void
    >({
      query: () => "admin/analytics/signup-methods",
      providesTags: ["Analytics"],
    }),

    // ─── Action: Flag Transaction ───
    flagAdminTransaction: builder.mutation<
      { message: string; data: unknown },
      { transactionId: string }
    >({
      query: ({ transactionId }) => ({
        url: `admin/transactions/${transactionId}/flag`,
        method: "PATCH",
      }),
      invalidatesTags: ["Analytics"],
    }),
    
    // ─── Broadcasts ───
    getAdminBroadcasts: builder.query<{ message: string; data: IBroadcast[] }, void>({
      query: () => "admin/broadcasts",
      providesTags: ["Broadcast"],
    }),

    createAdminBroadcast: builder.mutation<
      { message: string; data: IBroadcast },
      Partial<IBroadcast>
    >({
      query: (body) => ({
        url: "admin/broadcasts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Broadcast"],
    }),

    updateAdminBroadcast: builder.mutation<
      IBroadcast,
      { id: string; data: Partial<IBroadcast> }
    >({
      query: ({ id, data }) => ({
        url: `admin/broadcasts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Broadcast"],
    }),

    deleteAdminBroadcast: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `admin/broadcasts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Broadcast"],
    }),

    // ─── Automated Notifications ───
    getAdminAutomatedNotifications: builder.query<
      { message: string; data: IAutomatedNotification[] },
      { type?: string; status?: string; search?: string }
    >({
      query: (params) => `admin/notifications/automated?${buildQuery(params)}`,
      providesTags: ["Notification"],
    }),

    createAdminAutomatedNotification: builder.mutation<
      IAutomatedNotification,
      Partial<IAutomatedNotification>
    >({
      query: (data) => ({
        url: `admin/notifications/automated`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),

    updateAdminAutomatedNotification: builder.mutation<
      IAutomatedNotification,
      { id: string; data: Partial<IAutomatedNotification> }
    >({
      query: ({ id, data }) => ({
        url: `admin/notifications/automated/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),

    markAdminAutomatedNotificationRead: builder.mutation<
      IAutomatedNotification,
      string
    >({
      query: (id) => ({
        url: `admin/notifications/automated/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteAdminAutomatedNotification: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `admin/notifications/automated/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    toggleAdminBroadcastStatus: builder.mutation<
      { message: string; data: IBroadcast },
      { id: string; is_active: boolean }
    >({
      query: ({ id, is_active }) => ({
        url: `admin/broadcasts/${id}`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: ["Broadcast"],
    }),

    toggleAdminAutomatedNotificationStatus: builder.mutation<
      { message: string; data: IAutomatedNotification },
      { id: string; is_active: boolean }
    >({
      query: ({ id, is_active }) => ({
        url: `admin/notifications/automated/${id}`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: ["Notification"],
    }),

    // ─── Payouts & Escrow ───
    getAdminPendingManualPayouts: builder.query<
      IPaginatedResponse<IAdminPayout>,
      { page?: number; limit?: number }
    >({
      query: (params) => `admin/payouts/escrow?${buildQuery(params)}`,
      providesTags: ["Analytics"],
    }),

    getAdminAllPayouts: builder.query<
      IPaginatedResponse<IAdminPayout>,
      { page?: number; limit?: number; status?: string; search?: string }
    >({
      query: (params) => `admin/payouts?${buildQuery(params)}`,
      providesTags: ["Analytics"],
    }),

    markAdminPayoutTransferred: builder.mutation<
      { message: string; data: IAdminPayout },
      { id: string; admin_note?: string }
    >({
      query: ({ id, admin_note }) => ({
        url: `admin/payouts/escrow/${id}/mark-transferred`,
        method: "PATCH",
        body: { admin_note },
      }),
      invalidatesTags: ["Analytics"],
    }),

    getAdminAllEscrows: builder.query<
      IPaginatedResponse<IAdminEscrow>,
      { page?: number; limit?: number; status?: string; search?: string }
    >({
      query: (params) => `admin/payouts/escrow/all-escrows?${buildQuery(params)}`,
      providesTags: ["Analytics"],
    }),
    
    getAdminOrders: builder.query<
      IPaginatedResponse<IOrder>,
      { page?: number; limit?: number; status?: string; search?: string }
    >({
      query: (params) => `admin/orders?${buildQuery(params)}`,
      providesTags: ["Analytics"],
    }),

    updateAdminOrderStatus: builder.mutation<
      { message: string; success: boolean },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `admin/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useGetAdminVendorsQuery,
  useGetAdminUserQuery,
  useUpdateAdminUserStatusMutation,
  useUpdateAdminVendorStatusMutation,
  useGetAdminTransactionsQuery,
  useGetAdminOverviewQuery,
  useGetAdminGrowthChartQuery,
  useGetAdminUserDistributionQuery,
  useGetAdminTransactionBreakdownQuery,
  useGetAdminRecentSignupsQuery,
  useGetAdminTopStoresQuery,
  useGetAdminOrderBreakdownQuery,
  useGetAdminRevenueQuery,
  useGetAdminSignupMethodsQuery,
  useFlagAdminTransactionMutation,
  useGetAdminBroadcastsQuery,
  useCreateAdminBroadcastMutation,
  useUpdateAdminBroadcastMutation,
  useDeleteAdminBroadcastMutation,
  useGetAdminAutomatedNotificationsQuery,
  useCreateAdminAutomatedNotificationMutation,
  useUpdateAdminAutomatedNotificationMutation,
  useMarkAdminAutomatedNotificationReadMutation,
  useDeleteAdminAutomatedNotificationMutation,
  useToggleAdminBroadcastStatusMutation,
  useToggleAdminAutomatedNotificationStatusMutation,
  useGetAdminPendingManualPayoutsQuery,
  useGetAdminAllPayoutsQuery,
  useMarkAdminPayoutTransferredMutation,
  useGetAdminAllEscrowsQuery,
  useGetAdminOrdersQuery,
  useUpdateAdminOrderStatusMutation,
} = adminApi;
