import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TrendingUp, DollarSign, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SalesTrendChartProps {
  data: Array<{
    year: number;
    month: number;
    revenue: number;
    orders: number;
  }>;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number | string }>;
  label?: string | number;
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const [activeMetric, setActiveMetric] = useState<"revenue" | "orders">(
    "revenue",
  );

  // Transform data for the chart
  const chartData = data.map((item) => ({
    name: MONTH_NAMES[item.month - 1] || `${item.month}/${item.year}`,
    revenue: Number(item.revenue),
    orders: Number(item.orders),
  }));

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-md border border-border/50 p-4 rounded-sm ">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
            {label}
          </p>
          <div className="space-y-1">
            <p className="text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-sm bg-emerald-500" />
              Revenue:{" "}
              <span className="text-emerald-500 font-black">
                ₦{payload[0].value.toLocaleString()}
              </span>
            </p>
            {payload[1] && (
              <p className="text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-blue-500" />
                Orders:{" "}
                <span className="text-blue-500 font-black">
                  {payload[1].value}
                </span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-none  bg-card overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 bg-muted/20">
        <div>
          <CardTitle className="text-xl font-black flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" /> Performance
            Trends
          </CardTitle>
          <CardDescription>
            Visualizing your business growth over time
          </CardDescription>
        </div>

        <div className="flex bg-muted/50 p-1 rounded-sm border border-border/50">
          <button
            onClick={() => setActiveMetric("revenue")}
            className={cn(
              "px-4 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center gap-2",
              activeMetric === "revenue"
                ? "bg-card text-emerald-500 "
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <DollarSign className="w-3.5 h-3.5" /> Revenue
          </button>
          <button
            onClick={() => setActiveMetric("orders")}
            className={cn(
              "px-4 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center gap-2",
              activeMetric === "orders"
                ? "bg-card text-blue-500 "
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Orders
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700 }}
                tickFormatter={(val) =>
                  activeMetric === "revenue" ? `₦${val / 1000}k` : val
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={activeMetric === "revenue" ? "#10b981" : "#3b82f6"}
                strokeWidth={4}
                fillOpacity={1}
                fill={`url(#color${activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)})`}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
