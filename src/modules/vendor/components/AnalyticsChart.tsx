import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  YAxis,
  CartesianGrid,
} from "recharts";

type AnalyticsChartProps = {
  data: {
    month: string;
    sales: number;
  }[];
};

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <div className="w-full">
      {/* ─── Chart Heading ─── */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground">
          Monthly Sales Trend
        </h3>
        <p className="text-xs text-muted-foreground">
          Overview of revenue performance over time
        </p>
      </div>

      {/* ─── Chart ─── */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data ?? []}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted-foreground/30"
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />

            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                stroke: "hsl(var(--primary))",
                strokeWidth: 2,
                fill: "hsl(var(--background))",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
