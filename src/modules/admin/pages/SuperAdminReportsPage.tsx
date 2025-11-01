import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Filter,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Mock report summary
const metrics = [
  {
    label: "Total Revenue",
    value: "$42,560",
    trend: "+12.4%",
    icon: TrendingUp,
    color: "text-emerald-500",
  },
  {
    label: "Active Vendors",
    value: "1,245",
    trend: "+3.2%",
    icon: TrendingUp,
    color: "text-blue-500",
  },
  {
    label: "New Users",
    value: "5,680",
    trend: "+8.9%",
    icon: TrendingUp,
    color: "text-indigo-500",
  },
  {
    label: "Refunds Processed",
    value: "$1,220",
    trend: "-4.3%",
    icon: TrendingDown,
    color: "text-red-500",
  },
];

// Mock revenue trend data
const revenueData = [
  { month: "Jan", revenue: 8000 },
  { month: "Feb", revenue: 9600 },
  { month: "Mar", revenue: 11000 },
  { month: "Apr", revenue: 10200 },
  { month: "May", revenue: 12000 },
  { month: "Jun", revenue: 13600 },
  { month: "Jul", revenue: 14200 },
];

// Mock report log
const reports = [
  {
    id: 1,
    title: "Quarterly Financial Overview",
    type: "Finance",
    date: "2025-07-01",
    status: "Completed",
  },
  {
    id: 2,
    title: "Vendor Compliance Audit",
    type: "Compliance",
    date: "2025-06-20",
    status: "In Progress",
  },
  {
    id: 3,
    title: "User Growth & Retention Report",
    type: "Analytics",
    date: "2025-05-18",
    status: "Completed",
  },
  {
    id: 4,
    title: "Platform Incident Summary",
    type: "System",
    date: "2025-04-28",
    status: "Pending",
  },
];

export default function SuperAdminReportsPage() {
  const [search, setSearch] = useState("");

  const filteredReports = reports.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="space-y-8">
      {/* ─── Page Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Generate, review, and export system-wide insights on performance,
            revenue, and compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Export Data
          </Button>
        </div>
      </motion.div>

      {/* ─── Summary Metrics ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border border-border/30 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{m.label}</CardTitle>
                <m.icon className={cn("h-5 w-5", m.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{m.value}</div>
                <p className={cn("text-xs mt-1 font-medium", m.color)}>
                  {m.trend}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Revenue Trend Chart ─── */}
      <Card className="border border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>
            Monthly revenue trends across all vendors and services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/40"
                />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ─── Reports Table ─── */}
      <Card className="border border-border/40 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                Access previously generated system, compliance, and analytics
                reports.
              </CardDescription>
            </div>
            <div className="relative w-60">
              <Input
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
              <FileText className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-md border border-border/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/20 hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{r.title}</TableCell>
                      <TableCell>{r.type}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            r.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : r.status === "In Progress"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                          )}
                        >
                          {r.status}
                        </span>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-10 text-muted-foreground text-sm"
                    >
                      No matching reports found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
