import { apiManager } from "./apiManager";
import type { IUser } from "@/types/auth/authTypes";

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

const buildQuery = (params: Record<string, any>) => {
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
    // ─── All users (any type) ───
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
      providesTags: ["Analytics"], // Using Analytics tag for now or define a new one
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useGetAdminVendorsQuery,
  useGetAdminUserQuery,
  useUpdateAdminUserStatusMutation,
  useGetAdminTransactionsQuery,
} = adminApi;
