import { motion } from "framer-motion";
import { BarChart2, Package, ShoppingBag, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { StatCard } from "../components/StatCard";
import AnalyticsChart from "../components/AnalyticsChart";

import { useGetMyStoreAnalyticsQuery } from "@/services/analyticsApi";

export default function VendorDashboardPage() {
  const { data, isLoading, isError } = useGetMyStoreAnalyticsQuery();

  if (isError) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Failed to load analytics
      </div>
    );
  }

  const summary = data?.data.summary;
  const trends = data?.data.trends;

  const stats = summary
    ? [
        {
          title: "Total Revenue",
          value: `₦${Number(summary.total_sales).toLocaleString()}`,
          icon: BarChart2,
        },
        {
          title: "Products Listed",
          value: summary.total_products.toString(),
          icon: Package,
        },
        {
          title: "Orders",
          value: summary.orders.toString(),
          icon: ShoppingBag,
        },
        {
          title: "Customers",
          value: summary.customers.toString(),
          icon: Users,
        },
      ]
    : [];

  return (
    <motion.div layout className="space-y-8">
      {/* ─── Stats Overview ─── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border border-border/30 shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </CardContent>
              </Card>
            ))
          : stats.map((s, i) => (
              <StatCard key={i} title={s.title} value={s.value} icon={s.icon} />
            ))}
      </div>

      {/* ─── Analytics Section ─── */}
      <Card className="border border-border/30 shadow-sm">
        <CardContent className="pt-4">
          {isLoading ? (
            <Skeleton className="h-[320px] w-full rounded-md" />
          ) : (
            <AnalyticsChart data={trends?.monthly ?? []} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
