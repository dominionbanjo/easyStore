import type { IUser } from "@/types/auth/authTypes";
import { apiManager } from "./apiManager";

export interface IUserProfileResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    user: IUser;
  };
}

export interface UpdateProfileArgs {
  data: FormData;
}

export interface IUserAddressInput {
  street?: string;
  country?: string;
  state?: string;
  city?: string;
  postal_code?: string;
  is_default?: boolean;
}

type VerifyBankApiResponse = {
  status: string;
  message: string;
  data: {
    account_name: string;
    account_number: string;
    bank_id: number;
    bank_name: string;
  };
};

export const userApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<IUserProfileResponse, void>({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getAllUsers: builder.query<IUserProfileResponse[], void>({
      query: () => ({
        url: "users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getUserById: builder.query<IUserProfileResponse, string>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    updateUserProfile: builder.mutation<
      IUserProfileResponse,
      UpdateProfileArgs
    >({
      query: ({ data }) => ({
        url: "users/me",
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    registerBankAccount: builder.mutation<
      { success: boolean; message: string },
      {
        bank_code: string;
        account_number: string;
        settlement_email?: string;
      }
    >({
      query: (body) => ({
        url: "users/bank/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    verifyBankAccount: builder.mutation<
      VerifyBankApiResponse["data"],
      { account_number: string; bank_code: string }
    >({
      query: (body) => ({
        url: "payments/paystack/bank/verify",
        method: "POST",
        body,
      }),

      transformResponse: (response: VerifyBankApiResponse) => response.data,
    }),

    getNigerianBanks: builder.query<
      {
        status: string;
        message: string;
        data: {
          name: string;
          code: string;
          slug: string;
          type: string;
        }[];
      },
      void
    >({
      query: () => ({
        url: "payments/paystack/banks",
        method: "GET",
      }),
    }),

    addUserAddress: builder.mutation<
      { success: boolean; message?: string },
      IUserAddressInput | undefined
    >({
      query: (body) => ({
        url: "users/me/addresses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    updateUserAddress: builder.mutation<
      { success: boolean; message?: string },
      { id: string; body: IUserAddressInput | undefined }
    >({
      query: ({ id, body }) => ({
        url: `users/me/addresses/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUserAddress: builder.mutation<
      { success: boolean; message?: string },
      string
    >({
      query: (id) => ({
        url: `users/me/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserProfileMutation,
  useDeleteUserMutation,
  useRegisterBankAccountMutation,
  useVerifyBankAccountMutation,
  useGetNigerianBanksQuery,
  useAddUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
} = userApi;
