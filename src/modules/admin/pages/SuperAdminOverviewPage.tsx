import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Store,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Shield,
  Activity,
  Settings,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

const metrics = [
  {
    title: "Total Vendors",
    value: "1,254",
    change: "+8.4%",
    icon: Store,
    trend: "up",
  },
  {
    title: "Active Users",
    value: "87,203",
    change: "+12.1%",
    icon: Users,
    trend: "up",
  },
  {
    title: "Revenue (This Month)",
    value: "$402,910",
    change: "+5.2%",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Pending Reports",
    value: "73",
    change: "-2.3%",
    icon: AlertTriangle,
    trend: "down",
  },
];

const chartData = [
  { name: "Jan", vendors: 400, users: 2400, revenue: 2400 },
  { name: "Feb", vendors: 300, users: 1398, revenue: 2210 },
  { name: "Mar", vendors: 200, users: 9800, revenue: 2290 },
  { name: "Apr", vendors: 278, users: 3908, revenue: 2000 },
  { name: "May", vendors: 189, users: 4800, revenue: 2181 },
  { name: "Jun", vendors: 239, users: 3800, revenue: 2500 },
  { name: "Jul", vendors: 349, users: 4300, revenue: 2100 },
];

const recentActivity = [
  {
    title: "Vendor account verified",
    description: "UrbanStayz Ltd has been verified",
    time: "2 mins ago",
  },
  {
    title: "System maintenance completed",
    description: "Database migration finished successfully",
    time: "30 mins ago",
  },
  {
    title: "User reported fraud",
    description: "Investigation started for transaction #40921",
    time: "2 hrs ago",
  },
  {
    title: "New payout requests",
    description: "23 vendors requested payouts today",
    time: "4 hrs ago",
  },
];

export default function SuperAdminOverviewPage() {
  return (
    <section className="space-y-10">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Super Admin Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor overall platform performance and vendor ecosystem health.
          </p>
        </div>
        <Button className="gap-2">
          <Settings className="h-4 w-4" /> System Settings
        </Button>
      </div>

      {/* ─── Stats Cards ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((stat, i) => (
          <Card
            key={i}
            className="border border-border/40 shadow-sm hover:shadow-md transition-all"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs mt-1 ${
                  stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* ─── Analytics Charts ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card className="border border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>
              Users, vendors, and revenue performance over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVendors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis />
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="vendors"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorVendors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue (in USD).</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Activity Feed & System Health ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-6 lg:grid-cols-3"
      >
        <Card className="border border-border/40 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system and platform updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((a, i) => (
              <div
                key={i}
                className="flex items-start justify-between border-b last:border-none border-border/20 pb-3"
              >
                <div>
                  <p className="font-medium text-sm">{a.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {a.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Server status and uptime overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" />
                <p className="text-sm font-medium">Server Uptime</p>
              </div>
              <span className="text-xs text-muted-foreground">99.98%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Security Status</p>
              </div>
              <span className="text-xs text-muted-foreground">
                All systems secure
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-yellow-500" />
                <p className="text-sm font-medium">API Latency</p>
              </div>
              <span className="text-xs text-muted-foreground">~120ms</span>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-3 gap-2">
              View Full Logs <ArrowRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
