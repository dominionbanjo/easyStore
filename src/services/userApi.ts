import type { IUser } from "@/types/auth/authTypes";
import { apiManager } from "./apiManager";

export interface IUserWithStore extends IUser {
  username?: string | null;

  rating_average?: string;
  rating_count?: number;
  review_count?: number;

  address?: {
    city: string;
    state: string;
    country: string;
  } | null;

  payout_verified?: boolean;

  store_id?: string | null;
  store_name?: string | null;
}

export interface IUserProfileResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    user: IUserWithStore;
  };
}

export interface UpdateProfileArgs {
  data: FormData;
}

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

    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // logout: builder.mutation<void, void>({
    //   query: () => ({
    //     url: "/api/v1/auth/logout",
    //     method: "POST",
    //   }),
    //   invalidatesTags: ["User"],
    // }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserProfileMutation,
  useDeleteUserMutation,
  // useLogoutMutation,
} = userApi;
