import { apiManager } from "./apiManager";
import { setUser, clearUser } from "@/features/userSlice";
import Cookies from "js-cookie";

import type {
  IAuthResponse,
  IRegisterUserPayload,
  IRegisterUserResponse,
} from "@/types/auth/authTypes";

export const authApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── REGISTER ───────── */
    register: builder.mutation<IAuthResponse, IRegisterUserPayload>({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          const authData = data.data;

          if (authData?.access && authData?.user) {
            Cookies.set("token", authData.access, {
              expires: 7,
              secure: true,
              sameSite: "strict",
            });

            dispatch(setUser({ user: authData.user }));
          }
        } catch (error) {
          console.error("❌ Register failed:", error);
        }
      },
    }),

    /* ───────── LOGIN ───────── */
    login: builder.mutation<IAuthResponse, { email: string; password: string }>(
      {
        query: (body) => ({
          url: "auth/login",
          method: "POST",
          body,
        }),
        async onQueryStarted(_, { queryFulfilled, dispatch }) {
          try {
            const { data } = await queryFulfilled;

            const authData = data.data;

            if (authData?.access && authData?.user) {
              Cookies.set("token", authData.access, {
                expires: 7,
                secure: true,
                sameSite: "strict",
              });

              dispatch(setUser({ user: authData.user }));
            }
          } catch (error) {
            console.error("❌ Login failed:", error);
          }
        },
      }
    ),

    /* ───────── GOOGLE LOGIN ───────── */
    googleLogin: builder.mutation<IAuthResponse, { token: string }>({
      query: (body) => ({
        url: "auth/google",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          const authData = data.data;

          if (authData?.access && authData?.user) {
            Cookies.set("token", authData.access, {
              expires: 7,
              secure: true,
              sameSite: "strict",
            });

            dispatch(setUser({ user: authData.user }));
          }
        } catch (error) {
          console.error("❌ Google login failed:", error);
        }
      },
    }),

    /* ───────── VERIFY OTP ───────── */
    verifyOtp: builder.mutation<
      IRegisterUserResponse,
      { email: string; otp: string }
    >({
      query: (body) => ({
        url: "auth/verify-otp",
        method: "POST",
        body,
      }),
    }),

    /* ───────── RESEND OTP ───────── */
    resendOtp: builder.mutation<IRegisterUserResponse, { email: string }>({
      query: (body) => ({
        url: "auth/resend-otp",
        method: "POST",
        body,
      }),
    }),

    /* ───────── FORGOT PASSWORD ───────── */
    forgotPassword: builder.mutation<IRegisterUserResponse, { email: string }>({
      query: (body) => ({
        url: "auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    /* ───────── RESET PASSWORD ───────── */
    resetPassword: builder.mutation<
      IRegisterUserResponse,
      { email: string; password: string; token: string }
    >({
      query: (body) => ({
        url: "auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    /* ───────── LOGOUT ───────── */
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch {
          // backend may fail — client MUST still logout
        } finally {
          // ✅ ALWAYS clear client auth
          Cookies.remove("token", {
            secure: true,
            sameSite: "strict",
          });

          dispatch(clearUser());

          // OPTIONAL but recommended:
          dispatch(apiManager.util.resetApiState());
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi;
