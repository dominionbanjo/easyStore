import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useTheme } from "@/components/shared/ThemeContext";

interface SalesChartProps {
  data: {
    month: string;
    sales: number;
  }[];
}

export function SalesChart({ data }: SalesChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const colors = {
    primary: "#10b981", // emerald-500
    axis: isDark ? "#a3a3a3" : "#525252",
    grid: isDark ? "#404040" : "#e5e5e5",
    tooltipBg: isDark ? "#171717" : "#ffffff",
    tooltipBorder: isDark ? "#262626" : "#e5e5e5",
    tooltipText: isDark ? "#e5e5e5" : "#171717",
  };

  return (
    <Card className="border border-border/40 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-8">
        <div className="space-y-1.5 text-center md:text-left">
          <CardTitle className="text-xl font-bold flex items-center justify-center md:justify-start gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Revenue Analytics
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Monthly performance overview
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 bg-muted/50 p-1 rounded-lg border w-fit mx-auto md:mx-0">
          <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-background shadow-sm whitespace-nowrap text-foreground">
            Monthly
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-background/50 transition-colors whitespace-nowrap text-foreground">
            Weekly
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colors.primary}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.primary}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={colors.grid}
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.axis, fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.axis, fontSize: 12 }}
                tickFormatter={(value) =>
                  `₦${value > 0 ? value / 1000 + "k" : 0}`
                }
              />
              <Tooltip
                formatter={(value: number) => `₦${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: colors.tooltipBg,
                  border: `1px solid ${colors.tooltipBorder}`,
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  color: colors.tooltipText,
                }}
                itemStyle={{
                  color: colors.primary,
                  fontSize: "12px",
                  fontWeight: "600",
                }}
                labelStyle={{
                  marginBottom: "4px",
                  fontWeight: "bold",
                  color: colors.axis,
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke={colors.primary}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSales)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
