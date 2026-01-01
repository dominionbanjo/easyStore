import { apiManager } from "./apiManager";
import { setUser, clearUser } from "@/features/userSlice";
import Cookies from "js-cookie";

// ✅ Import the strongly-typed interfaces you already defined
import {
  type IAuthResponse,
  type ILoginResponse,
  type IRegisterUserPayload,
  type IRegisterUserResponse,
} from "@/types/auth/SignUpResponse"; // adjust path if needed

export const authApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 REGISTER
    register: builder.mutation<IRegisterUserResponse, IRegisterUserPayload>({
      query: (body) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          if (data.token && data.user) {
            // ✅ Store JWT token in cookies
            Cookies.set("token", data.token, {
              expires: 7,
              secure: true,
              sameSite: "strict",
            });

            // ✅ Update Redux store with user
            dispatch(setUser({ user: data.user }));
          }
        } catch (error) {
          console.error("❌ Register failed:", error);
        }
      },
    }),

    /* ───────── LOGIN ───────── */
    login: builder.mutation<
      ILoginResponse,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          Cookies.set("token", data.data.access, {
            expires: 7,
            secure: true,
            sameSite: "strict",
          });

          dispatch(setUser({ user: data.data.user }));
        } catch (error) {
          console.error("❌ Login failed:", error);
        }
      },
    }),

    // 🔹 VERIFY OTP
    verifyOtp: builder.mutation<
      IRegisterUserResponse,
      { email: string; otp: string }
    >({
      query: (body) => ({
        url: "/api/v1/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),

    // 🔹 RESEND OTP
    resendOtp: builder.mutation<IRegisterUserResponse, { email: string }>({
      query: (body) => ({
        url: "/api/v1/auth/resend-otp",
        method: "POST",
        body,
      }),
    }),

    // 🔹 FORGOT PASSWORD
    forgotPassword: builder.mutation<IRegisterUserResponse, { email: string }>({
      query: (body) => ({
        url: "/api/v1/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    // 🔹 RESET PASSWORD
    resetPassword: builder.mutation<
      IRegisterUserResponse,
      { email: string; password: string; token: string }
    >({
      query: (body) => ({
        url: "/api/v1/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    // 🔹 LOGOUT (client-side only)
    logout: builder.mutation<void, void>({
      queryFn: async (_arg, { dispatch }) => {
        Cookies.remove("token");
        dispatch(clearUser());
        return { data: undefined };
      },
    }),
    // inside authApi (authApi.ts)
    googleLogin: builder.mutation<IAuthResponse, { token: string }>({
      query: (body) => ({
        url: "/auth/google",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token && data.user) {
            Cookies.set("token", data.token, {
              expires: 7,
              secure: true,
              sameSite: "strict",
            });
            dispatch(setUser({ user: data.user }));
          }
        } catch (error) {
          console.error("❌ Google login failed:", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGoogleLoginMutation,
} = authApi;
