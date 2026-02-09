import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  summary: {
    total_sales: number;
    orders: number;
    customers: number;
    conversion_rate: number;
  };
}

export function StatsCards({ summary }: StatsCardsProps) {
  const cards = [
    {
      title: "Gross Revenue",
      value: `₦${summary.total_sales.toLocaleString()}`,
      icon: DollarSign,
      color: "emerald",
      trend: "+12.5%",
    },
    {
      title: "Total Orders",
      value: summary.orders.toLocaleString(),
      icon: ShoppingBag,
      color: "blue",
      trend: "+5.2%",
    },
    {
      title: "Total Customers",
      value: summary.customers.toLocaleString(),
      icon: Users,
      color: "purple",
      trend: "+8.1%",
    },
    {
      title: "Conversion Rate",
      value: `${summary.conversion_rate}%`,
      icon: TrendingUp,
      color: "orange",
      trend: "+2.4%",
    },
  ];

  const colorConfig: Record<string, string> = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="border-none shadow-xl bg-card overflow-hidden group hover:ring-2 hover:ring-primary/20 transition-all duration-300">
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "p-3 rounded-2xl border transition-transform duration-500 group-hover:scale-110",
                    colorConfig[card.color],
                  )}
                >
                  <card.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                  <ArrowUpRight className="w-3 h-3" /> {card.trend}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {card.title}
                </p>
                <h3 className="text-2xl font-black tracking-tight">
                  {card.value}
                </h3>
              </div>

              {/* Decorative background shape */}
              <div
                className={cn(
                  "absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700",
                  `bg-${card.color}-500`,
                )}
              />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
