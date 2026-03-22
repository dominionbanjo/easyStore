import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { setUser } from "@/features/userSlice";
import { useGetUserProfileQuery } from "@/services/userApi";
import { useGoogleLoginMutation } from "@/services/authApi";
import type { RootState } from "@/store";

import { useNavigate } from "react-router-dom";
import { handleRoleRedirect } from "@/utils/subdomain";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const token = Cookies.get("token");
  const initializedRef = useRef(false);

  // 🔹 Normal user profile check (if token exists but not authenticated in Redux)
  const { data } = useGetUserProfileQuery(undefined, {
    skip: !token || isAuthenticated,
  });

  // 🔹 Google Login mutation for One Tap
  const [googleLogin] = useGoogleLoginMutation();

  useEffect(() => {
    if (data?.data.user) {
      dispatch(setUser({ user: data.data.user }));
    }
  }, [data, dispatch]);

  useEffect(() => {
    // If already logged in (token exists) or already initialized, skip.
    if (token || initializedRef.current) return;

    const timerId = setInterval(() => {
      if (window.google?.accounts?.id) {
        // Clear timer and mark as initialized
        clearInterval(timerId);
        initializedRef.current = true;

        (window.google.accounts.id.initialize as any)({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
          callback: async (response: { credential: string }) => {
            try {
              const res: any = await googleLogin({
                token: response.credential,
              }).unwrap();
              const user = res?.data?.user || res?.user;

              const redirectTo =
                new URLSearchParams(window.location.search).get("redirect") ||
                "/";
              let finalRedirect = redirectTo;

              handleRoleRedirect(user, finalRedirect, navigate);
            } catch (err) {
              console.error("❌ One Tap login failed:", err);
              toast.error("Google login failed");
            }
          },
          auto_select: false, // 👈 KEY FIX: prevents mobile loops/crashes
          cancel_on_tap_outside: false,
          context: "signin",
        });

        (window.google.accounts.id.prompt as any)(
          (notification: {
            isNotDisplayed: () => boolean;
            getNotDisplayedReason: () => string;
            isSkippedMoment: () => boolean;
            getSkippedReason: () => string;
          }) => {
            if (notification.isNotDisplayed()) {
              console.warn(
                "One Tap not displayed:",
                notification.getNotDisplayedReason(),
              );
            }
            if (notification.isSkippedMoment()) {
              console.warn("One Tap skipped:", notification.getSkippedReason());
            }
          },
        );
      }
    }, 300);

    return () => clearInterval(timerId);
  }, [googleLogin, token]);

  return <>{children}</>;
}
