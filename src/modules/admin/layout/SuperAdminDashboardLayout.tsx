import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { getBaseDomain, areSubdomainsDisabled } from "@/utils/subdomain";
import type { RootState } from "@/store";
import LoadingScreen from "@/Loading";

import SuperAdminHeader from "../components/SuperAdminHeader";
import SuperAdminSidebar from "../components/SuperAdminSidebar";

export default function SuperAdminDashboardLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isAuthenticated, isLoading, currentUser } = useSelector(
    (state: RootState) => state.user,
  );

  const token = Cookies.get("token");

  useEffect(() => {
    // 🚫 No token + not authenticated → redirect to login
    if (!token && !isAuthenticated && !isLoading) {
      toast.error("Unauthorized access", {
        description: "Please login to access the admin dashboard",
      });
      const redirectPath = encodeURIComponent(window.location.pathname);
      if (areSubdomainsDisabled()) {
        navigate(`/auth/login?redirect=${redirectPath}`, { replace: true });
      } else {
        window.location.href = `${window.location.protocol}//${getBaseDomain()}/auth/login?redirect=${redirectPath}`;
      }
      return;
    }

    // ⛔ Authenticated but not admin
    if (
      !isLoading &&
      isAuthenticated &&
      currentUser &&
      currentUser.account_type !== "admin"
    ) {
      toast.error("You do not have access to the admin dashboard");
      if (areSubdomainsDisabled()) {
        navigate("/", { replace: true });
      } else {
        window.location.href = `${window.location.protocol}//${getBaseDomain()}/`;
      }
    }
  }, [token, isAuthenticated, isLoading, currentUser, navigate]);

  // ⏳ Block UI while auth is resolving or access denied
  if (
    isLoading ||
    (token && !isAuthenticated) ||
    (isAuthenticated && currentUser && currentUser.account_type !== "admin")
  ) {
    return <LoadingScreen />;
  }

  return (
    <section className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <SuperAdminSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Content area */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300",
          "md:ml-[260px]",
        )}
      >
        <SuperAdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <motion.main layout className="p-6 md:p-10 w-full space-y-10">
          <Outlet />
        </motion.main>
      </div>
    </section>
  );
}
