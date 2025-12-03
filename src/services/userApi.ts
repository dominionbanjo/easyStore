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
    // ✔ Auth required
    getUserProfile: builder.query<IUserProfileResponse, void>({
      query: () => ({
        url: "/api/v1/users",
        method: "GET",
      }),
      extraOptions: { auth: true },
      providesTags: ["User"],
    }),

    // ✔ Auth required
    getAllUsers: builder.query<IUserProfileResponse[], void>({
      query: () => ({
        url: "/api/v1/users",
        method: "GET",
      }),
      extraOptions: { auth: true },
      providesTags: ["User"],
    }),

    // ✔ Auth required
    getUserById: builder.query<IUserProfileResponse, string>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: "GET",
      }),
      extraOptions: { auth: true },
      providesTags: (_res, _err, id) => [{ type: "User", id }],
    }),

    // ✔ Auth required
    updateUserProfile: builder.mutation<
      IUserProfileResponse,
      { id: string; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      extraOptions: { auth: true },
      invalidatesTags: (_res, _err, { id }) => [{ type: "User", id }],
    }),

    // ✔ Auth required
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: "DELETE",
      }),
      extraOptions: { auth: true },
      invalidatesTags: ["User"],
    }),

    // ✔ Auth required
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
      extraOptions: { auth: true },
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
