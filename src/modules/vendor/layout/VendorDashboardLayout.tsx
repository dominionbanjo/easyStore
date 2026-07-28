import { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";

import { cn } from "@/lib/utils";
import type { RootState } from "@/store";
import { getBaseDomain, areSubdomainsDisabled } from "@/utils/subdomain";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { DashboardBottomNav } from "../components/DashboardBottomNav";
import { VendorReviewModal } from "@/modules/vendor/components/modals/VendorReviewModal";
import { NoStoreBanner } from "@/modules/vendor/components/dashboard/NoStoreBanner";
import { useGetMyStoresQuery } from "@/services/storeApi";
import LoadingScreen from "@/Loading";

export default function VendorDashboardLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { isAuthenticated, isLoading, currentUser } = useSelector(
    (state: RootState) => state.user,
  );

  const token = Cookies.get("token");
  const { data: stores = [], isLoading: isStoresLoading } = useGetMyStoresQuery(undefined, {
    skip: !token || !isAuthenticated || currentUser?.account_type !== "vendor",
  });

  useEffect(() => {
    if (!token && !isAuthenticated && !isLoading) {
      const redirectPath = encodeURIComponent(window.location.pathname);
      if (areSubdomainsDisabled()) {
        navigate(`/auth/login?redirect=${redirectPath}`, { replace: true });
      } else {
        window.location.href = `${window.location.protocol}//${getBaseDomain()}/auth/login?redirect=${redirectPath}`;
      }
      return;
    }

    if (
      !isLoading &&
      isAuthenticated &&
      currentUser &&
      currentUser.account_type !== "vendor"
    ) {
      toast.error("You do not have access to the vendor dashboard");
      if (areSubdomainsDisabled()) {
        navigate("/", { replace: true });
      } else {
        window.location.href = `${window.location.protocol}//${getBaseDomain()}/`;
      }
    }
  }, [token, isAuthenticated, isLoading, currentUser, navigate]);

  // Review modal popup logic
  useEffect(() => {
    if (!isAuthenticated || !currentUser || currentUser.account_type !== "vendor") return;

    const checkReview = async () => {
      try {
        const res = await fetch("/reviews/vendor/meta", {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        });
        if (!res.ok) return;
        const meta = (await res.json()).data;
        if (meta.hasReviewed) return;

        const daysSinceCreated = currentUser.created_at
          ? differenceInDays(new Date(), new Date(currentUser.created_at))
          : 999;
        const daysSincePrompt = meta.lastReviewPromptAt
          ? differenceInDays(new Date(), new Date(meta.lastReviewPromptAt))
          : 999;

        if (daysSinceCreated >= 30 && daysSincePrompt >= 30) {
          setShowReviewModal(true);
        }
      } catch {}
    };

    checkReview();
  }, [isAuthenticated, currentUser]);

  const handleSubmitReview = useCallback(async (rating: number, comment: string) => {
    const res = await fetch("/reviews/vendor", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${Cookies.get("token")}` },
      body: JSON.stringify({ rating, comment }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
  }, []);

  const handleDismissReview = useCallback(async () => {
    await fetch("/reviews/vendor/dismiss", {
      method: "POST",
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
  }, []);

  if (
    isLoading ||
    (token && !isAuthenticated) ||
    (isAuthenticated && currentUser && currentUser.account_type !== "vendor")
  ) {
    return <LoadingScreen />;
  }

  return (
    <section className="flex min-h-screen bg-background text-foreground pb-20 lg:pb-0">
      <DashboardSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isCollapsed={isCollapsed}
        onCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300",
          isCollapsed ? "lg:pl-[80px]" : "lg:pl-[260px]",
        )}
      >
        <DashboardHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {!isStoresLoading && stores.length === 0 && <NoStoreBanner />}

        <main className="px-2 py-2 sm:p-4 md:p-6 w-full transition-all duration-300">
          <Outlet />
        </main>
      </div>

      <DashboardBottomNav />

      <VendorReviewModal
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        onSubmit={handleSubmitReview}
        onDismiss={handleDismissReview}
      />
    </section>
  );
}
