"use client";
import { useEffect } from "react";
import { type ReactNode } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { setUser, clearUser } from "@/features/userSlice";
import { useGetUserProfileQuery } from "@/services/userApi";
import LoadingScreen from "@/Loading";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  const { data, error, isLoading } = useGetUserProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser({ user: data.user }));
    } else if (error) {
      dispatch(clearUser());
    }
  }, [data, error, dispatch]);

  if (token && isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
