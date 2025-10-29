// src/services/userApi.ts
import { apiManager } from "./apiManager";
import type { User } from "@/features/userSlice";

export interface IUserProfileResponse {
  status: number;
  success: boolean;
  message: string;
  user: User;
}

export const userApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<IUserProfileResponse, void>({
      query: () => ({
        url: "/api/v1/users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getAllUsers: builder.query<IUserProfileResponse[], void>({
      query: () => ({
        url: "/api/v1/users",
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
      { id: string; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
    }),

    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserProfileMutation,
  useDeleteUserMutation,
  useLogoutMutation,
} = userApi;
