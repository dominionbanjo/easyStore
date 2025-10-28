import { apiManager } from "./apiManager";

export const userApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<any, void>({
      query: () => "/users/me/",
      providesTags: ["User"],
    }),

    getAllUsers: builder.query<any, void>({
      query: () => "/users/",
      providesTags: ["User"],
    }),

    getUserById: builder.query<any, string>({
      query: (id) => `/users/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    updateUserProfile: builder.mutation<
      any,
      { id: string; data: Record<string, any> }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
    }),

    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout/",
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
} = userApi;
