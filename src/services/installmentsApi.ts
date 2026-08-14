import { apiManager } from "./apiManager";
import type {
  InstallmentConfig,
  InstallmentPlanView,
  CreateInstallmentPlanArgs,
  InstallmentPaymentInitResponse,
  CreateInstallmentOrderArgs,
  CreateInstallmentOrderResponse,
  PaginatedInstallmentPlans,
} from "@/types/installment/installmentTypes";

export const installmentsApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── CONFIG ───────── */
    getInstallmentConfig: builder.query<InstallmentConfig, void>({
      query: () => ({
        url: "installments/config",
        method: "GET",
      }),
      transformResponse: (response: unknown): InstallmentConfig => {
        const payload =
          (response as { data?: InstallmentConfig }).data ?? response;
        return payload as InstallmentConfig;
      },
    }),

    /* ───────── ORDER CREATION (pending — plan charges deposit next) ───────── */
    createInstallmentOrder: builder.mutation<
      CreateInstallmentOrderResponse,
      CreateInstallmentOrderArgs
    >({
      query: (body) => ({
        url: "orders/installment",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown): CreateInstallmentOrderResponse => {
        const payload =
          (response as { data?: CreateInstallmentOrderResponse }).data ??
          response;
        return payload as CreateInstallmentOrderResponse;
      },
      invalidatesTags: ["User", "Store", "Cart"],
    }),

    /* ───────── PLAN LIFECYCLE (buyer) ───────── */
    createInstallmentPlan: builder.mutation<
      InstallmentPaymentInitResponse,
      CreateInstallmentPlanArgs
    >({
      query: (body) => ({
        url: "installments",
        method: "POST",
        body,
      }),
      transformResponse: (
        response: unknown,
      ): InstallmentPaymentInitResponse => {
        const payload =
          (response as { data?: InstallmentPaymentInitResponse }).data ??
          response;
        return payload as InstallmentPaymentInitResponse;
      },
      invalidatesTags: ["Installments", "User"],
    }),

    payInstallment: builder.mutation<
      InstallmentPaymentInitResponse,
      string
    >({
      query: (planId) => ({
        url: `installments/${planId}/pay`,
        method: "POST",
      }),
      transformResponse: (
        response: unknown,
      ): InstallmentPaymentInitResponse => {
        const payload =
          (response as { data?: InstallmentPaymentInitResponse }).data ??
          response;
        return payload as InstallmentPaymentInitResponse;
      },
      invalidatesTags: ["Installments"],
    }),

    payoffInstallment: builder.mutation<
      InstallmentPaymentInitResponse,
      string
    >({
      query: (planId) => ({
        url: `installments/${planId}/payoff`,
        method: "POST",
      }),
      transformResponse: (
        response: unknown,
      ): InstallmentPaymentInitResponse => {
        const payload =
          (response as { data?: InstallmentPaymentInitResponse }).data ??
          response;
        return payload as InstallmentPaymentInitResponse;
      },
      invalidatesTags: ["Installments"],
    }),

    cancelInstallmentPlan: builder.mutation<{ success: boolean }, string>({
      query: (planId) => ({
        url: `installments/${planId}/cancel`,
        method: "POST",
      }),
      transformResponse: (response: unknown): { success: boolean } => {
        const payload = (response as { data?: { success?: boolean } })
          ?.data ?? (response as { success?: boolean });
        return { success: payload.success ?? true };
      },
      invalidatesTags: ["Installments", "User"],
    }),

    getMyInstallmentPlans: builder.query<
      PaginatedInstallmentPlans,
      { page?: number; limit?: number; status?: string } | void
    >({
      query: (args) => ({
        url: "installments/mine",
        method: "GET",
        params: args ?? {},
      }),
      transformResponse: (
        response: unknown,
      ): PaginatedInstallmentPlans => {
        const payload = (
          response as {
            data?: {
              items?: InstallmentPlanView[];
              pagination?: PaginatedInstallmentPlans["pagination"];
              success?: boolean;
            };
          }
        )?.data;
        if (payload) {
          return {
            success: payload.success ?? true,
            data: payload.items ?? [],
            pagination: payload.pagination ?? { page: 1, limit: 10, total: 0 },
          };
        }
        const fallback = response as Partial<PaginatedInstallmentPlans>;
        return {
          success: fallback.success ?? true,
          data: fallback.data ?? [],
          pagination: fallback.pagination ?? { page: 1, limit: 10, total: 0 },
        };
      },
      providesTags: ["Installments"],
    }),

    getMyInstallmentPlan: builder.query<InstallmentPlanView, string>({
      query: (planId) => ({
        url: `installments/${planId}`,
        method: "GET",
      }),
      transformResponse: (response: unknown): InstallmentPlanView => {
        const payload =
          (response as { data?: { data?: InstallmentPlanView } }).data?.data ??
          (response as { data?: InstallmentPlanView }).data ??
          response;
        return payload as InstallmentPlanView;
      },
      providesTags: (_result, _error, planId) => [
        { type: "Installments", id: planId },
      ],
    }),

    /* ───────── VENDOR ───────── */
    getVendorInstallmentPlans: builder.query<
      PaginatedInstallmentPlans,
      { page?: number; limit?: number; status?: string } | void
    >({
      query: (args) => ({
        url: "admin/vendor/installments",
        method: "GET",
        params: args ?? {},
      }),
      transformResponse: (
        response: unknown,
      ): PaginatedInstallmentPlans => {
        const payload = (
          response as {
            data?: {
              items?: InstallmentPlanView[];
              pagination?: PaginatedInstallmentPlans["pagination"];
              success?: boolean;
            };
          }
        )?.data;
        if (payload) {
          return {
            success: payload.success ?? true,
            data: payload.items ?? [],
            pagination: payload.pagination ?? { page: 1, limit: 10, total: 0 },
          };
        }
        const fallback = response as Partial<PaginatedInstallmentPlans>;
        return {
          success: fallback.success ?? true,
          data: fallback.data ?? [],
          pagination: fallback.pagination ?? { page: 1, limit: 10, total: 0 },
        };
      },
      providesTags: ["Installments"],
    }),

    getVendorInstallmentPlan: builder.query<InstallmentPlanView, string>({
      query: (planId) => ({
        url: `admin/vendor/installments/${planId}`,
        method: "GET",
      }),
      transformResponse: (response: unknown): InstallmentPlanView => {
        const payload =
          (response as { data?: { data?: InstallmentPlanView } }).data?.data ??
          (response as { data?: InstallmentPlanView }).data ??
          response;
        return payload as InstallmentPlanView;
      },
      providesTags: (_result, _error, planId) => [
        { type: "Installments", id: planId },
      ],
    }),

    /* ───────── ADMIN ───────── */
    getAdminInstallmentPlans: builder.query<PaginatedInstallmentPlans, void>({
      query: () => ({
        url: "admin/installments",
        method: "GET",
      }),
      transformResponse: (
        response: unknown,
      ): PaginatedInstallmentPlans => {
        const payload = (
          response as {
            data?: {
              items?: InstallmentPlanView[];
              pagination?: PaginatedInstallmentPlans["pagination"];
              success?: boolean;
            };
          }
        )?.data;
        if (payload) {
          return {
            success: payload.success ?? true,
            data: payload.items ?? [],
            pagination: payload.pagination ?? { page: 1, limit: 10, total: 0 },
          };
        }
        const fallback = response as Partial<PaginatedInstallmentPlans>;
        return {
          success: fallback.success ?? true,
          data: fallback.data ?? [],
          pagination: fallback.pagination ?? { page: 1, limit: 10, total: 0 },
        };
      },
      providesTags: ["Installments"],
    }),

    getAdminInstallmentPlan: builder.query<InstallmentPlanView, string>({
      query: (planId) => ({
        url: `admin/installments/${planId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, planId) => [
        { type: "Installments", id: planId },
      ],
    }),

    forceCompletePlan: builder.mutation<{ success: boolean }, string>({
      query: (planId) => ({
        url: `admin/installments/${planId}/force-complete`,
        method: "POST",
        body: { admin_note: "Force completed by admin" },
      }),
      invalidatesTags: ["Installments"],
    }),

    forceCancelPlan: builder.mutation<{ success: boolean }, string>({
      query: (planId) => ({
        url: `admin/installments/${planId}/force-cancel`,
        method: "POST",
        body: { admin_note: "Force canceled by admin" },
      }),
      invalidatesTags: ["Installments"],
    }),
  }),
});

export const {
  useGetInstallmentConfigQuery,
  useCreateInstallmentOrderMutation,
  useCreateInstallmentPlanMutation,
  usePayInstallmentMutation,
  usePayoffInstallmentMutation,
  useCancelInstallmentPlanMutation,
  useGetMyInstallmentPlansQuery,
  useGetMyInstallmentPlanQuery,
  useGetVendorInstallmentPlansQuery,
  useGetVendorInstallmentPlanQuery,
  useGetAdminInstallmentPlansQuery,
  useGetAdminInstallmentPlanQuery,
  useForceCompletePlanMutation,
  useForceCancelPlanMutation,
} = installmentsApi;
