import { apiManager } from "./apiManager";

export interface IPayout {
  id: string;
  vendor_id: string;
  order_id: string | null;
  escrow_id: string | null;
  amount: number;
  currency: string;
  status: "pending" | "pending_manual" | "success" | "failed" | "reversed";
  payout_type: "auto" | "manual";
  transfer_code: string | null;
  transfer_reference: string | null;
  recipient_code: string | null;
  transferred_at: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  order?: {
    id: string;
    total: number;
    status: string;
  } | null;
  escrow?: {
    id: string;
    status: string;
    amount: number;
    released_at?: string | null;
  } | null;
}

export interface PayoutQueryArgs {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedPayoutResponse {
  status: string;
  message: string;
  data: {
    items: IPayout[];
    pagination: IPaginationMeta;
  };
}

export const payoutsApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    getVendorPayouts: builder.query<PaginatedPayoutResponse, PayoutQueryArgs | void>({
      query: (params) => ({
        url: "payouts/vendor/me",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Payout"],
    }),
  }),
});

export const { useGetVendorPayoutsQuery } = payoutsApi;
