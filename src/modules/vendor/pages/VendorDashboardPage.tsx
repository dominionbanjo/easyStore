import { motion } from "framer-motion";
import {
  BarChart2,
  Package,
  ShoppingBag,
  Users,
  ArrowUpRight,
  Calendar,
  AlertCircle,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { DashboardStatsLoader } from "../components/dashboard/DashboardStatsLoader";
import { StatCard } from "../components/dashboard/StatCard";
import { SalesChart } from "../components/dashboard/SalesChart";
import { DashboardOverviewHeader } from "../components/dashboard/DashboardOverviewHeader";

import { useGetMyStoreAnalyticsQuery } from "@/services/analyticsApi";

export default function VendorDashboardPage() {
  const { data, isLoading, isError, refetch } = useGetMyStoreAnalyticsQuery();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            We couldn't load your store analytics. This might be due to a
            connection issue.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          Try Again
        </Button>
      </div>
    );
  }

  const summary = data?.data.summary;
  const trends = data?.data.trends;

  const stats = [
    {
      title: "Total Revenue",
      value: `₦${Number(summary?.total_sales || 0).toLocaleString()}`,
      icon: BarChart2,
      color: "primary" as const,
      trend: { value: 12, isPositive: true },
      delay: 0.1,
    },
    {
      title: "Total Orders",
      value: (summary?.orders || 0).toString(),
      icon: ShoppingBag,
      color: "orange" as const,
      trend: { value: 8, isPositive: true },
      delay: 0.2,
    },
    {
      title: "Products",
      value: (summary?.total_products || 0).toString(),
      icon: Package,
      color: "emerald" as const,
      trend: { value: 2, isPositive: true },
      delay: 0.3,
    },
    {
      title: "Customers",
      value: (summary?.customers || 0).toString(),
      icon: Users,
      color: "secondary" as const,
      trend: { value: 5, isPositive: true },
      delay: 0.4,
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto p-1">
      {/* ─── Header Section ─── */}
      <DashboardOverviewHeader />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
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

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ─── Main Analytics Chart ─── */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="h-[450px] w-full rounded-2xl bg-muted/40 animate-pulse border border-border/40" />
            ) : (
              <SalesChart data={trends?.monthly ?? []} />
            )}
          </div>

          {/* ─── Secondary Info / Quick Actions ─── */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-primary/5 rounded-2xl p-6 border border-primary/10 relative overflow-hidden group"
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
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
            </motion.div>

            {/* Quick Tips / Info Cards */}
            <div className="grid gap-4">
              <div className="p-4 rounded-xl border border-border/40 bg-card hover:bg-muted/30 transition-colors flex items-center gap-4 group cursor-pointer">
                <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Out of Stock</p>
                  <p className="text-xs text-muted-foreground">
                    3 products need attention
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/40 bg-card hover:bg-muted/30 transition-colors flex items-center gap-4 group cursor-pointer">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Pending Orders</p>
                  <p className="text-xs text-muted-foreground">
                    5 orders waiting for dispatch
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
