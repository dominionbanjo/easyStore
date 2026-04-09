import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "sonner"; // Added toast import

import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { BottomNav } from "@/components/shared/BottomNav";
import { HomeFloater } from "@/components/shared/HomeFloater";
import { AUTH_ROUTES } from "@/routes";
import type { RootState } from "@/store";
import LoadingScreen from "@/Loading";

export default function AccountsLayout() {
  const navigate = useNavigate();

  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.user,
  );

  const token = Cookies.get("token");

  useEffect(() => {
    // 🚫 No token + not authenticated → redirect to landing page
    if (!token && !isAuthenticated && !isLoading) {
      toast.error("Unauthorized access", {
        // Added toast notification
        description: "Please login to access your account", // Adjusted description for AccountsLayout
      });
      navigate(AUTH_ROUTES.LOGIN, { state: { from: window.location.pathname }, replace: true });
      return; // Added return to prevent further execution
    }
  }, [token, isAuthenticated, isLoading, navigate]);

  // ⏳ While auth is resolving, block UI
  if (isLoading || (token && !isAuthenticated)) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-foreground transition-colors duration-300">
      {/* 🌐 Header */}
      <div className="mb-14">
        <Header />
      </div>

      {/* 🧭 Protected Content */}
      <main className="flex-1 fade-in-up mt-4 md:mt-6 px-1 md:px-14 xl:px-16 w-full">
        <Outlet />
      </main>

      {/* ⚓ Footer */}
      <Footer />
      <BottomNav />
      <HomeFloater />
    </div>
  );
}
