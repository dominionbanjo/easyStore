import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { setUser, clearUser } from "@/features/userSlice";
import { useGetUserProfileQuery } from "@/services/userApi";
import { useGoogleLoginMutation } from "@/services/authApi";
import LoadingScreen from "@/Loading";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  // 🔹 Normal user profile check (if token exists)
  const { data, error, isLoading } = useGetUserProfileQuery(undefined, {
    skip: !token,
  });

  // 🔹 Google Login mutation for One Tap
  const [googleLogin] = useGoogleLoginMutation();

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser({ user: data.user }));
      return;
    }

    if (error) {
      const status =
        (error as any)?.status || (error as any)?.originalStatus || null;
      const msg = (error as any)?.data?.message || "";

      if (status === 401 || msg.includes("invalid")) {
        toast.error("Session expired. Please log in again.");
        Cookies.remove("token");
        dispatch(clearUser());

        // Redirect with current path preserved
        const currentPath = window.location.pathname + window.location.search;
        const redirectUrl = `/auth/login?redirect=${encodeURIComponent(
          currentPath
        )}`;

        setTimeout(() => (window.location.href = redirectUrl), 800);
      }
    }
  }, [data, error, dispatch]);

  useEffect(() => {
    if (token || !window.google) return;

    (window.google.accounts.id.initialize as any)({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
      callback: async (response: { credential: string }) => {
        try {
          await googleLogin({ token: response.credential }).unwrap();
          toast.success("Welcome back!");
        } catch (err) {
          console.error("❌ One Tap login failed:", err);
          toast.error("Google login failed");
        }
      },
      auto_select: true,
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
            notification.getNotDisplayedReason()
          );
        }
        if (notification.isSkippedMoment()) {
          console.warn("One Tap skipped:", notification.getSkippedReason());
        }
      }
    );
  }, [googleLogin, token]);

  if (token && isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
