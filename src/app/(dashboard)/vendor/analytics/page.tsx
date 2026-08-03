import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { useGetMyStoreAnalyticsQuery } from "@/services/storeApi";
import { Button } from "@/components/ui/button";

// Sub-components
import { AnalyticsHeader } from "@/modules/vendor/components/analytics/AnalyticsHeader";
import { StatsCards } from "@/modules/vendor/components/analytics/StatsCards";
import { SalesTrendChart } from "@/modules/vendor/components/analytics/SalesTrendChart";
import { TopProductsList } from "@/modules/vendor/components/analytics/TopProductsList";
import { CustomerInsights } from "@/modules/vendor/components/analytics/CustomerInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PayoutsView from "@/modules/vendor/components/dashboard/PayoutsView";

export default function AnalyticsPage() {
  const {
    data: analytics,
    isLoading,
    isError,
    refetch,
  } = useGetMyStoreAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center flex-col gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-sm" />
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
        <div className="h-20 w-20 rounded-sm bg-destructive/10 flex items-center justify-center text-destructive">
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
          className="rounded-sm px-8 h-12   gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    );
  }

  const analyticsData = analytics;


  // Final UI
  return (
    <div
      className="max-w-[1400px] mx-auto space-y-10 pb-20 px-4 md:px-0"
    >
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-6">
        <AnalyticsHeader />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-muted/50 p-1 h-12 rounded-sm border border-border/20 mb-8">
          <TabsTrigger value="overview" className="rounded-xs px-8 h-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all font-bold">
            Overview
          </TabsTrigger>
          <TabsTrigger value="payouts" className="rounded-xs px-8 h-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all font-bold">
            Payouts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-10 focus-visible:outline-none">
          <StatsCards summary={analyticsData?.summary} />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            <div className="xl:col-span-8 flex flex-col gap-8">
              <SalesTrendChart data={analyticsData?.trends?.monthly} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:hidden">
                <TopProductsList products={analyticsData?.top_products} />
                <CustomerInsights customers={analyticsData?.customers} />
              </div>
            </div>

            <div className="xl:col-span-4 hidden xl:flex flex-col gap-8 h-full">
              <div className="h-1/2">
                <TopProductsList products={analyticsData?.top_products} />
              </div>
              <div className="h-1/2">
                <CustomerInsights customers={analyticsData?.customers} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payouts" className="focus-visible:outline-none">
          <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-sm p-6 sm:p-8">
            <div className="mb-8">
              <h3 className="text-xl font-black tracking-tight mb-1 uppercase">Payout History</h3>
              <p className="text-sm text-muted-foreground font-medium">View and track all funds transferred to your bank account</p>
            </div>
            <PayoutsView />
          </div>
        </TabsContent>
      </Tabs>

      {/* Decorative background gradients */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-sm" />
      <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-sm" />
    </div>
  );
}
