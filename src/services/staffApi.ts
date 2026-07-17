import { apiManager } from "./apiManager";

export interface StaffMember {
  id: string;
  status: "active" | "suspended" | "invited";
  last_login_at: string | null;
  created_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string | null;
    account_status: string;
    phone_number?: string;
    created_at?: string;
  };
}

interface PaginatedStaffResponse {
  data: StaffMember[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface InviteStaffPayload {
  email: string;
  first_name: string;
  last_name: string;
}

export const staffApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    getStaffList: builder.query<PaginatedStaffResponse, { page?: number; limit?: number; status?: string; search?: string }>({
      query: (params) => ({ url: "store/staff", method: "GET", params }),
      providesTags: ["Staff"],
    }),
    getStaff: builder.query<StaffMember, string>({
      query: (id) => `store/staff/${id}`,
      providesTags: ["Staff"],
    }),
    inviteStaff: builder.mutation<{ success: boolean; id: string }, InviteStaffPayload>({
      query: (body) => ({ url: "store/staff/invite", method: "POST", body }),
      invalidatesTags: ["Staff"],
    }),
    updateStaff: builder.mutation<{ success: boolean }, { id: string; data: { first_name?: string; last_name?: string } }>({
      query: ({ id, data }) => ({ url: `store/staff/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Staff"],
    }),
    suspendStaff: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `store/staff/${id}/suspend`, method: "PATCH" }),
      invalidatesTags: ["Staff"],
    }),
    unsuspendStaff: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `store/staff/${id}/unsuspend`, method: "PATCH" }),
      invalidatesTags: ["Staff"],
    }),
    resetStaffPassword: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `store/staff/${id}/reset-password`, method: "POST" }),
      invalidatesTags: ["Staff"],
    }),
    removeStaff: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `store/staff/${id}`, method: "DELETE" }),
      invalidatesTags: ["Staff"],
    }),
  }),
});

export const {
  useGetStaffListQuery,
  useGetStaffQuery,
  useInviteStaffMutation,
  useUpdateStaffMutation,
  useSuspendStaffMutation,
  useUnsuspendStaffMutation,
  useResetStaffPasswordMutation,
  useRemoveStaffMutation,
} = staffApi;
