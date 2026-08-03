import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Users,
  Package,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  useGetAdminOverviewQuery,
  useGetAdminRevenueQuery,
  useGetAdminOrderBreakdownQuery,
  useGetAdminTransactionBreakdownQuery,
  useGetAdminTopStoresQuery,
} from "@/services/adminApi";
import { format } from "date-fns";

const PIE_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];
const BAR_COLORS = [
  "#6366f1",
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

function pctChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const pct = ((current - previous) / previous) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

export default function SuperAdminReportsPage() {
  const { data: overview, isLoading: overviewLoading } =
    useGetAdminOverviewQuery();
  const { data: revenueData, isLoading: revenueLoading } =
    useGetAdminRevenueQuery({ months: 12 });
  const { data: orderBreakdown, isLoading: ordersLoading } =
    useGetAdminOrderBreakdownQuery();
  const { data: txBreakdown, isLoading: txLoading } =
    useGetAdminTransactionBreakdownQuery();
  const { data: topStoresData, isLoading: topStoresLoading } =
    useGetAdminTopStoresQuery({ limit: 5 });

  const stats = overview?.data;
  const revenueChart = revenueData?.data ?? [];
  const orderStatuses = orderBreakdown?.data ?? [];
  const txTypes = txBreakdown?.data ?? [];
  const topStores = topStoresData?.data ?? [];

  const revenueThisMonth = (stats?.revenue.thisMonth ?? 0) / 100;
  const revenueLastMonth = (stats?.revenue.lastMonth ?? 0) / 100;

  const totalSuccessfulTx = stats?.transactionStatusBreakdown?.find(
    (t) => t.status === "success",
  );

  const metrics = [
    {
      label: "Total Revenue",
      value: `₦${revenueThisMonth.toLocaleString(undefined, { minimumFractionDigits: 0 })}`,
      trend: pctChange(revenueThisMonth, revenueLastMonth),
      icon: CreditCard,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      label: "Active Vendors",
      value: stats?.totals.vendors?.toLocaleString() ?? "—",
      trend: `${stats?.pendingVendors ?? 0} pending`,
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "New Users (Month)",
      value: stats?.newUsers.thisMonth?.toLocaleString() ?? "—",
      trend: pctChange(
        stats?.newUsers.thisMonth ?? 0,
        stats?.newUsers.lastMonth ?? 0,
      ),
      icon: Users,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      label: "Successful Txns",
      value: Number(totalSuccessfulTx?.count ?? 0).toLocaleString(),
      trend: `₦${(Number(totalSuccessfulTx?.total ?? 0) / 100).toLocaleString()} total`,
      icon: ShoppingBag,
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <section className="space-y-10 pb-10">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 font-bold border-border/40 "
          >
            <Filter className="h-4 w-4" /> Filter Reports
          </Button>
          <Button className="gap-2 font-bold  ">
            <Download className="h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      {/* ─── Summary Metrics ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {metrics.map((m, i) => {
          const isUp = m.trend.startsWith("+");
          const showTrend = m.trend.startsWith("+") || m.trend.startsWith("-");
          return (
            <div key={i}>
              <Card className="border-border/30   hover: transition-all duration-300 overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                  <CardTitle className="text-[11px] sm:text-[13px] font-bold text-muted-foreground uppercase tracking-wider truncate mr-2">
                    {m.label}
                  </CardTitle>
                  <div
                    className={cn(
                      "p-1.5 sm:p-2 rounded-sm flex-shrink-0",
                      m.bgColor,
                    )}
                  >
                    <m.icon
                      className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", m.color)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                  {overviewLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <>
                      <div className="text-2xl sm:text-3xl font-black truncate">
                        {m.value}
                      </div>
                      <p
                        className={cn(
                          "text-[10px] sm:text-xs mt-1 sm:mt-1.5 font-bold flex items-center gap-1",
                          showTrend
                            ? isUp
                              ? "text-emerald-500"
                              : "text-rose-500"
                            : "text-muted-foreground",
                        )}
                      >
                        {showTrend &&
                          (isUp ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          ))}
                        <span className="truncate">{m.trend}</span>
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* ─── Revenue Trend Area Chart ─── */}
      <Card className="border-border/30   overflow-hidden">
        <CardHeader className="border-b border-border/20 bg-muted/10 px-4 py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-4 w-4 text-primary shrink-0" />
              <div>
                <CardTitle className="text-sm sm:text-base font-black">
                  Revenue Trend
                </CardTitle>
                <CardDescription className="text-[10px] sm:text-xs font-medium">
                  Financial performance (12 months)
                </CardDescription>
              </div>
            </div>
            <span className="self-start sm:self-center text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase bg-muted px-2.5 py-1 rounded-sm">
              {revenueChart.length} months data
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6 px-2 sm:px-6">
          <div className="h-64 sm:h-80 w-full">
            {revenueLoading ? (
              <Skeleton className="h-full w-full rounded-sm" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueChart}
                  margin={{ left: -20, right: 10 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/30"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fontWeight: 600 }}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      border: "1px solid hsl(var(--border))",
                    }}
                    formatter={(value: number) => [
                      `₦${(value / 100).toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                    dot={{ r: 3, fill: "#22c55e" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ─── Order Breakdown + Top Stores ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Status Pie */}
        <Card className="border-border/30   overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-muted/10 px-4 py-4 sm:px-6">
            <CardTitle className="text-base font-black flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-primary" /> Order Status
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Monthly breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 px-2 sm:px-6">
            <div className="h-64 sm:h-72">
              {ordersLoading ? (
                <Skeleton className="h-full w-full rounded-sm" />
              ) : orderStatuses.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  No order data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatuses}
                      dataKey="count"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={100}
                      paddingAngle={3}
                      strokeWidth={2}
                      stroke="hsl(var(--background))"
                    >
                      {orderStatuses.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      formatter={(v: string) => (
                        <span className="text-xs font-bold capitalize">
                          {v}
                        </span>
                      )}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Types Bar Chart */}
        <Card className="border-border/30   overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-muted/10 px-4 py-4 sm:px-6">
            <CardTitle className="text-base font-black flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Transaction Volume
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              By transaction type
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 px-2 sm:px-6">
            <div className="h-64 sm:h-72">
              {txLoading ? (
                <Skeleton className="h-full w-full rounded-sm" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={txTypes.slice(0, 7)}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border/30"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 9, fontWeight: 600 }}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 10 }} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={30}>
                      {txTypes.slice(0, 7).map((_, i) => (
                        <Cell
                          key={i}
                          fill={BAR_COLORS[i % BAR_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Top Stores Table ─── */}
      <Card className="border-border/30   overflow-hidden">
        <CardHeader className="border-b border-border/20 bg-muted/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-black">
                Revenue Leaders
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Top performing stores by total revenue
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-bold text-xs border-border/30"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/20">
            {topStoresLoading
              ? [...Array(5)].map((_, i) => (
                  <div key={i} className="px-6 py-4 flex justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))
              : topStores.map((store, i) => (
                  <div
                    key={store.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          "h-8 w-8 rounded-sm flex items-center justify-center text-xs font-black text-white ",
                          i === 0
                            ? "bg-gradient-to-br from-amber-400 to-amber-600 -amber-200/50"
                            : i === 1
                              ? "bg-gradient-to-br from-slate-300 to-slate-500"
                              : i === 2
                                ? "bg-gradient-to-br from-amber-600 to-amber-800"
                                : "bg-muted text-muted-foreground",
                        )}
                      >
                        #{i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold">{store.store_name}</p>
                        <p className="text-[11px] text-muted-foreground font-medium capitalize">
                          {store.category || "General"} •{" "}
                          {format(new Date(store.created_at), "MMM yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-foreground">
                        ₦{Number(store.total_revenue).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {store.total_orders} orders
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
