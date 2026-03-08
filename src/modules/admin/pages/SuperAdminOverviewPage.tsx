import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Store,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Shield,
  Activity,
  Settings,
  ArrowRight,
  ShoppingBag,
  Package,
  Clock,
  UserPlus,
} from "lucide-react";
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  useGetAdminOverviewQuery,
  useGetAdminGrowthChartQuery,
  useGetAdminRecentSignupsQuery,
  useGetAdminUserDistributionQuery,
} from "@/services/adminApi";
import { format } from "date-fns";

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

function pctChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const pct = ((current - previous) / previous) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  isLoading,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  iconColor: string;
  isLoading?: boolean;
}) {
  const isUp = change.startsWith("+");
  return (
    <Card className="border-border/30 shadow-lg shadow-black/5 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/20 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-4 pt-4 sm:px-6 sm:pt-6">
        <CardTitle className="text-[11px] sm:text-[13px] font-bold text-muted-foreground uppercase tracking-wider truncate mr-2">
          {title}
        </CardTitle>
        <div className={cn("p-1.5 sm:p-2 rounded-xl flex-shrink-0", iconColor)}>
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl sm:text-3xl font-black tracking-tight truncate">
              {value}
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
              <span className="truncate">{change} from last month</span>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function SuperAdminOverviewPage() {
  const { data: overview, isLoading: overviewLoading } =
    useGetAdminOverviewQuery();
  const { data: growthData, isLoading: growthLoading } =
    useGetAdminGrowthChartQuery({ months: 7 });
  const { data: signupsData, isLoading: signupsLoading } =
    useGetAdminRecentSignupsQuery({ limit: 6 });
  const { data: distData, isLoading: distLoading } =
    useGetAdminUserDistributionQuery();

  const stats = overview?.data;
  const chartData = growthData?.data ?? [];
  const recentSignups = signupsData?.data ?? [];
  const distribution = distData?.data ?? [];

  const revenueThisMonth = (stats?.revenue.thisMonth ?? 0) / 100;
  const revenueLastMonth = (stats?.revenue.lastMonth ?? 0) / 100;

  const metrics = [
    {
      title: "Total Vendors",
      value: stats?.totals.vendors?.toLocaleString() ?? "—",
      change: pctChange(
        stats?.totals.vendors ?? 0,
        Math.max(
          (stats?.totals.vendors ?? 0) - (stats?.pendingVendors ?? 0),
          1,
        ),
      ),
      icon: Store,
      iconColor:
        "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    },
    {
      title: "Active Users",
      value: stats?.totals.users?.toLocaleString() ?? "—",
      change: pctChange(
        stats?.newUsers.thisMonth ?? 0,
        stats?.newUsers.lastMonth ?? 0,
      ),
      icon: Users,
      iconColor:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    },
    {
      title: "Revenue (Month)",
      value: `₦${revenueThisMonth.toLocaleString(undefined, { minimumFractionDigits: 0 })}`,
      change: pctChange(revenueThisMonth, revenueLastMonth),
      icon: DollarSign,
      iconColor:
        "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    },
    {
      title: "Pending Vendors",
      value: stats?.pendingVendors?.toString() ?? "—",
      change: stats?.pendingVendors ? `${stats.pendingVendors} awaiting` : "0",
      icon: AlertTriangle,
      iconColor:
        "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    },
  ];

  return (
    <section className="space-y-10 pb-10 animate-in fade-in duration-500">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground/90">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            Real-time platform performance and vendor ecosystem metrics.
          </p>
        </div>
        <Button className="gap-2 shadow-md shadow-primary/20 font-bold">
          <Settings className="h-4 w-4" /> System Settings
        </Button>
      </div>

      {/* ─── Stats Cards ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((stat, i) => (
          <StatCard key={i} {...stat} isLoading={overviewLoading} />
        ))}
      </motion.div>

      {/* ─── Charts Row ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-6 lg:grid-cols-5"
      >
        {/* Growth Chart (3 cols) */}
        <Card className="border-border/30 shadow-lg shadow-black/5 lg:col-span-3 overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-muted/10 px-4 py-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-black">
                  Platform Growth
                </CardTitle>
                <CardDescription className="text-xs font-medium">
                  Monthly user and vendor signups
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 text-[10px] sm:text-[11px] font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500" />{" "}
                  Users
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-blue-500" />{" "}
                  Vendors
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[280px] sm:h-[320px] pt-6 px-2 sm:px-6">
            {growthLoading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-full w-full rounded-xl" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#22c55e"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="gradVendors"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/30"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fontWeight: 600 }}
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#gradUsers)"
                  />
                  <Area
                    type="monotone"
                    dataKey="vendors"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#gradVendors)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* User Distribution Pie (2 cols) */}
        <Card className="border-border/30 shadow-lg shadow-black/5 lg:col-span-2 overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-muted/10 px-4 py-4 sm:px-6">
            <CardTitle className="text-base font-black">
              User Distribution
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Accounts by type
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] sm:h-[320px] pt-6 px-2 sm:px-6">
            {distLoading ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
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
                    formatter={(value: string) => (
                      <span className="text-xs font-bold">{value}</span>
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
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Activity + System Health + Quick Stats ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* Recent Signups */}
        <Card className="border-border/30 shadow-lg shadow-black/5 md:col-span-2 overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-muted/10 px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-black flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-primary" />
                  Recent Signups
                </CardTitle>
                <CardDescription className="text-xs font-medium">
                  Latest platform registrations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-border/20">
            {signupsLoading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="py-4 flex items-center justify-between"
                  >
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))
              : recentSignups.map((u) => (
                  <div
                    key={u.id}
                    className="py-3.5 flex items-start justify-between gap-3 group hover:bg-muted/30 -mx-6 px-6 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-sm">
                        {u.first_name?.charAt(0)}
                        {u.last_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-none">
                          {u.first_name} {u.last_name}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                          {u.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-black uppercase",
                          u.account_type === "vendor"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
                        )}
                      >
                        {u.account_type}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(u.created_at), "MMM d")}
                      </p>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-border/30 shadow-lg shadow-black/5 overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-muted/10">
            <CardTitle className="text-base font-black">
              Platform Totals
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Lifetime platform numbers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {[
              {
                icon: Activity,
                label: "Total Orders",
                value: stats?.totals.orders?.toLocaleString() ?? "—",
                color: "text-emerald-500",
              },
              {
                icon: Package,
                label: "Total Products",
                value: stats?.totals.products?.toLocaleString() ?? "—",
                color: "text-blue-500",
              },
              {
                icon: ShoppingBag,
                label: "Total Stores",
                value: stats?.totals.stores?.toLocaleString() ?? "—",
                color: "text-indigo-500",
              },
              {
                icon: Shield,
                label: "Pending Vendors",
                value: stats?.pendingVendors?.toString() ?? "0",
                color: "text-amber-500",
              },
              {
                icon: TrendingUp,
                label: "Orders This Month",
                value: stats?.orders.thisMonth?.toLocaleString() ?? "0",
                color: "text-rose-500",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl border border-border/20 hover:border-border/40 transition-colors bg-background"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted/60">
                    <item.icon className={cn("h-4 w-4", item.color)} />
                  </div>
                  <p className="text-sm font-bold">{item.label}</p>
                </div>
                {overviewLoading ? (
                  <Skeleton className="h-5 w-12" />
                ) : (
                  <span className="text-base font-black">{item.value}</span>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 gap-2 font-bold border-border/30"
            >
              View Full Analytics <ArrowRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
