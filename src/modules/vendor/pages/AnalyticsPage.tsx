import { motion } from "framer-motion";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import {
  useGetMyStoreAnalyticsQuery,
  useGetMyStoreQuery,
} from "@/services/storeApi";
import { Button } from "@/components/ui/button";

// Sub-components
import { AnalyticsHeader } from "../components/analytics/AnalyticsHeader";
import { StatsCards } from "../components/analytics/StatsCards";
import { SalesTrendChart } from "../components/analytics/SalesTrendChart";
import { TopProductsList } from "../components/analytics/TopProductsList";
import { CustomerInsights } from "../components/analytics/CustomerInsights";

export default function AnalyticsPage() {
  const {
    data: analytics,
    isLoading,
    isError,
    refetch,
  } = useGetMyStoreAnalyticsQuery();

  const { data: store } = useGetMyStoreQuery();

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center flex-col gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-full" />
        </div>
        <div className="text-center">
          <p className="font-black text-xl tracking-tight">
            Crunching Your Numbers...
          </p>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold mt-1">
            Fetching latest store insights
          </p>
        </div>
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="flex h-[60vh] items-center justify-center flex-col gap-6 max-w-md mx-auto text-center">
        <div className="h-20 w-20 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground font-medium">
            We couldn't load your analytics data right now. This might be due to
            an unauthorized access or connection issue.
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          className="rounded-2xl px-8 h-12 shadow-lg shadow-primary/20 gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    );
  }

  const analyticsData = analytics;

  // Final UI
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1400px] mx-auto space-y-10 pb-20 px-4 md:px-0"
    >
      <AnalyticsHeader storeName={store?.store_name} />

      <StatsCards summary={analyticsData?.summary} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Main Chart Area */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          <SalesTrendChart data={analyticsData?.trends?.monthly} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:hidden">
            <TopProductsList products={analyticsData?.top_products} />
            <CustomerInsights customers={analyticsData?.customers} />
          </div>
        </div>

        {/* Sidebar Insights (Desktop) */}
        <div className="xl:col-span-4 hidden xl:flex flex-col gap-8 h-full">
          <div className="h-1/2">
            <TopProductsList products={analyticsData?.top_products} />
          </div>
          <div className="h-1/2">
            <CustomerInsights customers={analyticsData?.customers} />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Fallback for lists if viewport is small */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:hidden">
        {/* This is handled by the conditional above, but keeping grid logic clean */}
      </div>

      {/* Decorative background gradients */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
      <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
    </motion.div>
  );
}
