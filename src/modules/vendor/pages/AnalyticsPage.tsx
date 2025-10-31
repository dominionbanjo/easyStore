"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

// Mock Data
const salesData = [
  { month: "Jan", sales: 22000 },
  { month: "Feb", sales: 28000 },
  { month: "Mar", sales: 25000 },
  { month: "Apr", sales: 31000 },
  { month: "May", sales: 36000 },
  { month: "Jun", sales: 41000 },
  { month: "Jul", sales: 39000 },
  { month: "Aug", sales: 45000 },
];

const topProducts = [
  { name: "Smart Watch", sales: 340 },
  { name: "Leather Bag", sales: 295 },
  { name: "Wireless Speaker", sales: 240 },
  { name: "Sneakers", sales: 200 },
  { name: "Phone Case", sales: 190 },
];

const customerSegments = [
  { name: "Returning", value: 65 },
  { name: "New", value: 25 },
  { name: "Abandoned", value: 10 },
];

const COLORS = ["#22c55e", "#0ea5e9", "#f97316"];

export default function AnalyticsPage() {
  return (
    <section className="space-y-10">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Analytics Overview
          </h1>
          <p className="text-muted-foreground text-sm">
            Track your sales performance and customer activity.
          </p>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            title: "Total Sales",
            value: "₦230,000",
            change: "+12.5%",
            positive: true,
            icon: DollarSign,
          },
          {
            title: "Orders",
            value: "1,340",
            change: "+5.1%",
            positive: true,
            icon: ShoppingBag,
          },
          {
            title: "Customers",
            value: "896",
            change: "-2.3%",
            positive: false,
            icon: Users,
          },
          {
            title: "Conversion Rate",
            value: "4.5%",
            change: "+0.6%",
            positive: true,
            icon: TrendingUp,
          },
        ].map(({ title, value, change, positive, icon: Icon }) => (
          <Card
            key={title}
            className="border border-border/40 shadow-sm hover:shadow-md transition-all bg-card"
          >
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{title}</p>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{value}</h3>
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  positive ? "text-emerald-600" : "text-red-500"
                )}
              >
                {positive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* ─── Tabs for Charts ─── */}
      <Tabs defaultValue="sales" className="mt-8">
        <TabsList className="flex flex-wrap gap-2 border-b border-border/20 pb-2">
          {[
            { value: "sales", label: "Sales Overview" },
            { value: "products", label: "Top Products" },
            { value: "customers", label: "Customer Segments" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "px-4 py-2 rounded-full text-sm transition-all",
                "data-[state=active]:bg-primary/30 data-[state=active]:text-foreground"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ───────────────────────────── */}
        {/* SALES OVERVIEW TAB */}
        {/* ───────────────────────────── */}
        <TabsContent value="sales" className="pt-6">
          <Card className="border border-border/40 shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>
                Monthly sales performance overview
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ───────────────────────────── */}
        {/* TOP PRODUCTS TAB */}
        {/* ───────────────────────────── */}
        <TabsContent value="products" className="pt-6">
          <Card className="border border-border/40 shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Based on total quantity sold</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topProducts.map((product, i) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between border-b border-border/20 py-3"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <p className="text-sm font-medium">{product.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {product.sales} sold
                  </span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ───────────────────────────── */}
        {/* CUSTOMER SEGMENTS TAB */}
        {/* ───────────────────────────── */}
        <TabsContent value="customers" className="pt-6">
          <Card className="border border-border/40 shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>
                Breakdown of customer engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex justify-center">
              <ResponsiveContainer width="90%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegments}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {customerSegments.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
