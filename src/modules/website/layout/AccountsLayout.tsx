import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import type { RootState } from "@/store";
import LoadingScreen from "@/Loading";

export default function AccountsLayout() {
  const navigate = useNavigate();

  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.user,
  );

  const token = Cookies.get("token");

  useEffect(() => {
    // 🚫 No token + not authenticated → redirect to landing
    if (!token && !isAuthenticated && !isLoading) {
      navigate("/", { replace: true });
    }
  }, [token, isAuthenticated, isLoading, navigate]);

  // ⏳ While auth is resolving, block UI
  if (isLoading || (token && !isAuthenticated)) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🌐 Header */}
      <div className="mb-5">
        <Header />
      </div>

      {/* 🧭 Protected Content */}
      <main className="flex-1 fade-in-up mt-4 md:mt-6 px-1 md:px-14 xl:px-16 max-w-[1780px] mx-auto w-full">
        <Outlet />
      </main>

      {/* ⚓ Footer */}
      <Footer />
    </div>
  );
}
