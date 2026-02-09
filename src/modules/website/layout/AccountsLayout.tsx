import { useEffect, Suspense } from "react";
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-foreground transition-colors duration-300">
      {/* 🌐 Header */}
      <div className="mb-20">
        <Header />
      </div>

      {/* 🧭 Protected Content */}
      <main className="flex-1 fade-in-up mt-4 md:mt-6 px-1 md:px-14 xl:px-16 max-w-[1780px] mx-auto w-full">
        <Suspense fallback={<LoadingScreen fullPage={false} />}>
          <Outlet />
        </Suspense>
      </main>

      {/* ⚓ Footer */}
      <Footer />
    </div>
  );
}
