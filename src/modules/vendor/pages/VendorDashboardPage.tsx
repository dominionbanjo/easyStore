import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import {
  BarChart2,
  Package,
  ShoppingBag,
  Users,
  ArrowUpRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { DashboardStatsLoader } from "../components/dashboard/DashboardStatsLoader";
import { StatCard } from "../components/dashboard/StatCard";
import { DashboardOverviewHeader } from "../components/dashboard/DashboardOverviewHeader";

// Lazy-load heavy below-fold components — Recharts is the biggest LCP offender
const SalesChart = lazy(() =>
  import("../components/dashboard/SalesChart").then((m) => ({ default: m.SalesChart }))
);
const StoreSetupTracker = lazy(() =>
  import("../components/shared/StoreSetupTracker").then((m) => ({ default: m.StoreSetupTracker }))
);

import { useGetMyStoreAnalyticsQuery } from "@/services/storeApi";
import { formatCompactNumber } from "@/utils/numberUtils";
import { useAppSelector } from "@/hooks";
import { selectCurrentUser } from "@/features/userSlice";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function VendorDashboardPage() {
  const user = useAppSelector(selectCurrentUser);
  const { data, isLoading, isError } = useGetMyStoreAnalyticsQuery();

  const summary = data?.summary;
  const trends = data?.trends;

  // Store status is used for the banner, account status for blocking access
  const storeStatus = summary?.store_status;
  const accountStatus = summary?.account_status || user?.account_status;

  // We allow pending/active vendors to view the dashboard structure (even if analytics return 404/403)
  if (isError && accountStatus === "banned") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Account Banned</AlertTitle>
          <AlertDescription>
            Your account has been banned. Please contact support if you believe
            this is an error.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: formatCompactNumber(Number(summary?.total_sales || 0) / 100, "₦"),
      icon: BarChart2,
      color: "primary" as const,
      trend: { value: 12, isPositive: true },
      delay: 0.1,
    },
    {
      title: "Total Orders",
      value: formatCompactNumber(summary?.orders || 0),
      icon: ShoppingBag,
      color: "orange" as const,
      trend: { value: 8, isPositive: true },
      delay: 0.2,
    },
    {
      title: "Products",
      value: formatCompactNumber(summary?.total_products || 0),
      icon: Package,
      color: "emerald" as const,
      trend: { value: 2, isPositive: true },
      delay: 0.3,
    },
    {
      title: "Customers",
      value: formatCompactNumber(summary?.customers || 0),
      icon: Users,
      color: "secondary" as const,
      trend: { value: 5, isPositive: true },
      delay: 0.4,
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6">
      {/* ─── Header Section ─── */}
      <DashboardOverviewHeader />

      {/* ─── Status Banners ─── */}
      {!isLoading && storeStatus === "pending" && (
        <Alert
          variant="default"
          className="mt-4 mb-2 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900"
        >
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-500 font-bold">
            Store Pending Approval
          </AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            Your store is currently under review by our team. You can continue
            setting it up and adding products, but your store won't be visible
            to the public until it is approved.{" "}
            <a
              href="mailto:support@eazystore.com.ng"
              className="font-semibold underline underline-offset-2"
            >
              Contact Support
            </a>
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && storeStatus === "restricted" && (
        <Alert
          variant="destructive"
          className="mt-4 mb-2 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900"
        >
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
          <AlertTitle className="text-red-800 dark:text-red-500 font-bold">
            Store Restricted
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-400">
            Your store has been restricted by an administrator. It is currently
            hidden from the public. If you believe this is an error, please{" "}
            <a
              href="mailto:support@eazystore.com.ng"
              className="font-semibold underline underline-offset-2"
            >
              Contact Support
            </a>
            .
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && accountStatus === "restricted" && (
        <Alert
          variant="destructive"
          className="mt-4 mb-2 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900"
        >
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
          <AlertTitle className="text-red-800 dark:text-red-500 font-bold">
            Account Restricted
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-400">
            Your personal account has been restricted. You can still access your
            dashboard, but you may have limited functionality.
          </AlertDescription>
        </Alert>
      )}

      {/* ─── Setup Progress Call to Action ─── */}
      <div className="mb-8 mt-4">
        <Suspense fallback={<div className="h-24 rounded-sm bg-muted/40 animate-pulse" />}>
          <StoreSetupTracker />
        </Suspense>
      </div>

      {/* ─── Stats Overview ─── */}
      {isLoading ? (
        <DashboardStatsLoader />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard
              key={i}
              title={s.title}
              value={s.value}
              icon={s.icon}
              color={s.color}
              trend={s.trend}
              delay={s.delay}
            />
          ))}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3 mt-8">
          {/* ─── Main Analytics Chart ─── */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="h-[450px] w-full rounded-sm bg-muted/40 animate-pulse border border-border/40" />
            ) : (
              <Suspense fallback={<div className="h-[450px] w-full rounded-sm bg-muted/40 animate-pulse border border-border/40" />}>
                <SalesChart
                  data={
                    trends?.monthly?.map((m: any) => ({
                      ...m,
                      month: MONTH_NAMES[m.month - 1] || m.month.toString(),
                      sales: Number(m.revenue || 0) / 100,
                      online: Number(m.online_revenue || 0) / 100,
                      offline: Number(m.offline_revenue || 0) / 100,
                    })) ?? []
                  }
                />
              </Suspense>
            )}
          </div>

          {/* ─── Secondary Info / Quick Actions ─── */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-primary/5 rounded-sm p-6 border border-primary/10 relative overflow-hidden group"
            >
              <div className="relative z-10">
                <h4 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Store Review
                </h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Your store is performing{" "}
                  <span className="text-primary font-bold">12% better</span>{" "}
                  than last month. Keep up the great work!
                </p>
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                  View Full Report
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Decorative Circle */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-sm blur-3xl group-hover:bg-primary/20 transition-colors" />
            </motion.div>

            {/* Quick Tips / Info Cards */}
            <div className="grid gap-4">
              {Number(summary?.out_of_stock_count) > 0 && (
                <div className="p-4 rounded-sm border border-border/40 bg-card hover:bg-muted/30 transition-colors flex items-center gap-4 group cursor-pointer">
                  <div className="h-10 w-10 rounded-sm bg-orange-100 dark:bg-orange-500/10 text-orange-600 flex items-center justify-center">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Out of Stock</p>
                    <p className="text-xs text-muted-foreground">
                      {summary?.out_of_stock_count} products need attention
                    </p>
                  </div>
                </div>
              )}

              {Number(summary?.pending_orders_count) > 0 && (
                <div className="p-4 rounded-sm border border-border/40 bg-card hover:bg-muted/30 transition-colors flex items-center gap-4 group cursor-pointer">
                  <div className="h-10 w-10 rounded-sm bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Pending Orders</p>
                    <p className="text-xs text-muted-foreground">
                      {summary?.pending_orders_count} orders waiting for
                      dispatch
                    </p>
                  </div>
                </div>
              )}

              {(!summary?.out_of_stock_count ||
                summary.out_of_stock_count === 0) &&
                (!summary?.pending_orders_count ||
                  summary.pending_orders_count === 0) && (
                  <div className="p-6 rounded-sm border border-dashed border-border/60 bg-muted/20 text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      All Caught Up
                    </p>
                  </div>
                )}
            </div>
          </div>
      </div>
    </div>
  );
}
