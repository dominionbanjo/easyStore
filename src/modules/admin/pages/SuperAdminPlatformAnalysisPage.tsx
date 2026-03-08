import { motion } from "framer-motion";
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
  Users,
  Building2,
  ShoppingBag,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Package,
  Star,
  Crown,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  useGetAdminOverviewQuery,
  useGetAdminGrowthChartQuery,
  useGetAdminUserDistributionQuery,
  useGetAdminTransactionBreakdownQuery,
  useGetAdminTopStoresQuery,
  useGetAdminSignupMethodsQuery,
} from "@/services/adminApi";

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];
const BAR_COLORS = [
  "#6366f1",
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

function pctChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const pct = ((current - previous) / previous) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

export default function SuperAdminPlatformAnalysisPage() {
  const { data: overview, isLoading: overviewLoading } =
    useGetAdminOverviewQuery();
  const { data: growthData, isLoading: growthLoading } =
    useGetAdminGrowthChartQuery({ months: 9 });
  const { data: distData, isLoading: distLoading } =
    useGetAdminUserDistributionQuery();
  const { data: txBreakdown, isLoading: txBreakdownLoading } =
    useGetAdminTransactionBreakdownQuery();
  const { data: topStoresData, isLoading: topStoresLoading } =
    useGetAdminTopStoresQuery({ limit: 5 });
  const { data: signupMethodsData, isLoading: signupMethodsLoading } =
    useGetAdminSignupMethodsQuery();

  const stats = overview?.data;
  const chart = growthData?.data ?? [];
  const distribution = distData?.data ?? [];
  const txTypes = txBreakdown?.data ?? [];
  const topStores = topStoresData?.data ?? [];
  const signupMethods = signupMethodsData?.data ?? [];

  const revenueThisMonth = (stats?.revenue.thisMonth ?? 0) / 100;
  const revenueLastMonth = (stats?.revenue.lastMonth ?? 0) / 100;

  const kpis = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `₦${revenueThisMonth.toLocaleString(undefined, { minimumFractionDigits: 0 })}`,
      trend: pctChange(revenueThisMonth, revenueLastMonth),
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      icon: Building2,
      label: "Active Vendors",
      value: stats?.totals.vendors?.toLocaleString() ?? "—",
      trend: "+3.2%",
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Users,
      label: "Active Users",
      value: stats?.totals.users?.toLocaleString() ?? "—",
      trend: pctChange(
        stats?.newUsers.thisMonth ?? 0,
        stats?.newUsers.lastMonth ?? 0,
      ),
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      icon: ShoppingBag,
      label: "Orders This Month",
      value: stats?.orders.thisMonth?.toLocaleString() ?? "—",
      trend: pctChange(
        stats?.orders.thisMonth ?? 0,
        stats?.orders.lastMonth ?? 0,
      ),
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <section className="space-y-10 pb-10 animate-in fade-in duration-500">
      {/* ─── Page Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground/90">
            Platform Analysis
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            Comprehensive insight into platform health, growth, and performance
            metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 font-bold border-border/40 shadow-sm"
          >
            <Calendar className="h-4 w-4" /> Last 90 Days
          </Button>
          <Button className="gap-2 font-bold shadow-md shadow-primary/20">
            <Download className="h-4 w-4" /> Export Insights
          </Button>
        </div>
      </motion.div>

      {/* ─── KPI Overview Cards ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
      >
        {kpis.map((item, i) => {
          const isUp = item.trend.startsWith("+");
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/30 shadow-lg shadow-black/5 hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                  <CardTitle className="text-[11px] sm:text-[13px] font-bold text-muted-foreground uppercase tracking-wider truncate mr-2">
                    {item.label}
                  </CardTitle>
                  <div
                    className={cn(
                      "p-1.5 sm:p-2 rounded-xl flex-shrink-0",
                      item.bgColor,
                    )}
                  >
                    <item.icon
                      className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", item.color)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                  {overviewLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <>
                      <div className="text-2xl sm:text-3xl font-black truncate">
                        {item.value}
                      </div>
                      <p
                        className={cn(
                          "text-[10px] sm:text-xs mt-1 sm:mt-1.5 font-bold flex items-center gap-1",
                          isUp ? "text-emerald-500" : "text-rose-500",
                        )}
                      >
                        {isUp ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span className="truncate">{item.trend}</span>
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ─── Revenue Growth Line Chart ─── */}
      <Card className="border-border/30 shadow-lg shadow-black/5 overflow-hidden">
        <CardHeader className="border-b border-border/20 bg-muted/10 px-4 py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-black">
                Revenue & Orders Growth
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Monthly earnings and order volume over time
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-[10px] sm:text-[11px] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500" />{" "}
                Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-indigo-500" />{" "}
                Orders
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 px-2 sm:px-6">
          <div className="h-64 sm:h-80 w-full">
            {growthLoading ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/30"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fontWeight: 600 }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="revenue"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="orders"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Line
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#22c55e" }}
                  />
                  <Line
                    yAxisId="orders"
                    type="monotone"
                    dataKey="orders"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#6366f1" }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ─── Distribution + Activity Row ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart — User Distribution */}
        <Card className="border-border/30 shadow-lg shadow-black/5 overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-muted/10 px-4 py-4 sm:px-6">
            <CardTitle className="text-base font-black">
              User & Vendor Distribution
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Account type composition
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 px-2 sm:px-6">
            <div className="h-64 sm:h-72">
              {distLoading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={distribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={100}
                      paddingAngle={4}
                      strokeWidth={2}
                      stroke="hsl(var(--background))"
                    >
                      {distribution.map((_, index) => (
                        <Cell
                          key={index}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      formatter={(v: string) => (
                        <span className="text-xs font-bold">{v}</span>
                      )}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart — Transaction Types */}
        <Card className="border-border/30 shadow-lg shadow-black/5 overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-muted/10 px-4 py-4 sm:px-6">
            <CardTitle className="text-base font-black">
              Transaction Types
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Volume by transaction category
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 px-2 sm:px-6">
            <div className="h-64 sm:h-72">
              {txBreakdownLoading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={txTypes}
                    layout="vertical"
                    margin={{ left: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border/30"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10, fontWeight: 600 }}
                      tickLine={false}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={24}>
                      {txTypes.map((_, i) => (
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

      {/* ─── Top Stores + Signup Methods row ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Top Stores */}
        <Card className="border-border/30 shadow-lg shadow-black/5 md:col-span-2 lg:col-span-3 overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-muted/10 px-4 py-4 sm:px-6">
            <CardTitle className="text-base font-black flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" /> Top Performing Stores
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              By lifetime revenue
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-border/20">
            {topStoresLoading
              ? [...Array(5)].map((_, i) => (
                  <div key={i} className="py-4 flex justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))
              : topStores.map((store, i) => (
                  <div
                    key={store.id}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-muted/30 -mx-6 px-6 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "h-7 w-7 rounded-lg flex items-center justify-center text-xs font-black text-white",
                          i === 0
                            ? "bg-gradient-to-br from-amber-400 to-amber-600"
                            : i === 1
                              ? "bg-gradient-to-br from-slate-300 to-slate-500"
                              : i === 2
                                ? "bg-gradient-to-br from-amber-600 to-amber-800"
                                : "bg-muted text-muted-foreground",
                        )}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold leading-none">
                          {store.store_name}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-medium mt-0.5 flex items-center gap-1.5">
                          <span className="capitalize">
                            {store.category || "General"}
                          </span>
                          <span className="text-border">•</span>
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />{" "}
                          {Number(store.rating_average).toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black">
                        ₦{Number(store.total_revenue).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {store.total_orders} orders • {store.total_products}{" "}
                        products
                      </p>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>

        {/* Signup Methods + System Health */}
        <Card className="border-border/30 shadow-lg shadow-black/5 lg:col-span-2 overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-muted/10">
            <CardTitle className="text-base font-black">
              Signup Methods
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              How users join the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-52">
              {signupMethodsLoading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={signupMethods}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      paddingAngle={3}
                    >
                      {signupMethods.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      formatter={(v: string) => (
                        <span className="text-xs font-bold">{v}</span>
                      )}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>

          {/* System Health */}
          <div className="border-t border-border/20 p-6 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              System Health
            </h3>
            {[
              {
                icon: Activity,
                label: "Uptime",
                value: "99.98%",
                color: "text-emerald-500",
              },
              {
                icon: TrendingUp,
                label: "API Latency",
                value: "~120ms",
                color: "text-amber-500",
              },
              {
                icon: Package,
                label: "Total Products",
                value: stats?.totals.products?.toLocaleString() ?? "—",
                color: "text-blue-500",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className={cn("h-4 w-4", item.color)} />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                {overviewLoading ? (
                  <Skeleton className="h-4 w-12" />
                ) : (
                  <span className="text-sm font-black">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
