import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "secondary" | "orange" | "green" | "emerald";
  className?: string;
  delay?: number;
}

const colorMap = {
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  orange: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  green: "bg-green-500/10 text-green-600 border-green-500/20",
  emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary",
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="h-fit"
    >
      <Card
        className={cn(
          "group relative overflow-hidden border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col",
          className,
        )}
      >
        <CardContent className="p-4 sm:p-5 flex flex-col z-10 relative">
          {/* Header: Title & Secondary Icon */}
          <div className="flex items-center justify-between w-full mb-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
              {title}
            </p>
            <div
              className={cn(
                "p-1.5 rounded-lg border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs",
                colorMap[color],
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Body: Primary Value */}
          <div className="flex flex-col items-center justify-center w-full py-0.5">
            <h3
              className={cn(
                "font-extrabold tracking-tight text-foreground truncate w-full text-center transition-all duration-300",
                value.length > 12
                  ? "text-xl sm:text-2xl"
                  : value.length > 8
                    ? "text-2xl sm:text-3xl"
                    : "text-3xl sm:text-4xl",
              )}
            >
              {value}
            </h3>
          </div>

          {/* Footer: Trend */}
          {trend && (
            <div className="mt-2 flex items-center justify-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full",
                  trend.isPositive
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-red-500/10 text-red-600",
                )}
              >
                <span>{trend.isPositive ? "+" : "-"}</span>
                <span>{trend.value}%</span>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">
                vs last month
              </span>
            </div>
          )}

          {/* Background Decorative Element */}
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
            <Icon className="w-24 h-24" />
          </div>
        </CardContent>

        {/* Bottom Decorative Line */}
        <div
          className={cn(
            "h-1 w-full bg-gradient-to-r opacity-80 transition-all duration-300 group-hover:h-1.5 mt-1",
            color === "primary" ? "from-primary to-primary/30" : "",
            color === "emerald" ? "from-emerald-500 to-emerald-200" : "",
            color === "orange" ? "from-orange-500 to-orange-200" : "",
            color === "secondary" ? "from-blue-500 to-blue-200" : "",
            color === "green" ? "from-green-500 to-green-200" : "",
          )}
        />
      </Card>
    </motion.div>
  );
}
