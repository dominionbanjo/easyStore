"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { setUser, clearUser } from "@/features/userSlice";
import { useGetUserProfileQuery } from "@/services/userApi";
import LoadingScreen from "@/Loading";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  const { data, error, isLoading } = useGetUserProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser({ user: data.user }));
      return;
    }

    // ❌ Invalid token or 401
    if (error) {
      const status =
        (error as any)?.status || (error as any)?.originalStatus || null;
      const msg = (error as any)?.data?.message || "";

      if (status === 401 || msg.includes("invalid")) {
        toast.error("Session expired. Please log in again.");
        Cookies.remove("token");
        dispatch(clearUser());

        // Capture current path and redirect to login with it
        const currentPath = window.location.pathname + window.location.search;
        const redirectUrl = `/auth/login?redirect=${encodeURIComponent(
          currentPath
        )}`;

        setTimeout(() => (window.location.href = redirectUrl), 800);
      }
    }
  }, [data, error, dispatch]);

  if (token && isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
