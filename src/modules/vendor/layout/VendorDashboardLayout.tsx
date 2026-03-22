import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "sonner"; // Keep toast as it's used for vendor-specific error

import { cn } from "@/lib/utils";
import type { RootState } from "@/store";
import { getBaseDomain } from "@/utils/subdomain";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import LoadingScreen from "@/Loading";

export default function VendorDashboardLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { isAuthenticated, isLoading, currentUser } = useSelector(
    (state: RootState) => state.user,
  );

  const token = Cookies.get("token");

  useEffect(() => {
    // 🚫 No token + not authenticated → redirect to landing page
    if (!token && !isAuthenticated && !isLoading) {
      window.location.href = `${window.location.protocol}//${getBaseDomain()}/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    // ⛔ Authenticated but not vendor
    if (
      !isLoading &&
      isAuthenticated &&
      currentUser &&
      currentUser.account_type !== "vendor"
    ) {
      toast.error("You do not have access to the vendor dashboard");
      window.location.href = `${window.location.protocol}//${getBaseDomain()}/`;
    }
  }, [token, isAuthenticated, isLoading, currentUser, navigate]);

  // ⏳ Block UI while auth is resolving
  if (
    isLoading ||
    (token && !isAuthenticated) ||
    (isAuthenticated && currentUser && currentUser.account_type !== "vendor")
  ) {
    return <LoadingScreen />;
  }

  return (
    <section className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <DashboardSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isCollapsed={isCollapsed}
        onCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main content */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300",
          isCollapsed ? "md:pl-[80px]" : "md:pl-[260px]",
        )}
      >
        <DashboardHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="px-2 py-2 sm:p-4 md:p-6 w-full transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </section>
  );
}
