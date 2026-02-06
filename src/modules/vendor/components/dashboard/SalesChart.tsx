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

interface SalesChartProps {
  data: {
    month: string;
    sales: number;
  }[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <Card className="border border-border/40 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-8">
        <div className="space-y-1.5 text-center md:text-left">
          <CardTitle className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Revenue Analytics
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Monthly performance overview
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 bg-muted/50 p-1 rounded-lg border w-fit mx-auto md:mx-0">
          <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-background shadow-sm whitespace-nowrap">
            Monthly
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-background/50 transition-colors whitespace-nowrap">
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
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--muted-foreground))"
                strokeOpacity={0.1}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `₦${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
                labelStyle={{
                  marginBottom: "4px",
                  fontWeight: "bold",
                  color: "hsl(var(--muted-foreground))",
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="hsl(var(--primary))"
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
