import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Package, ShoppingBag, Users } from "lucide-react";
import { StatCard } from "../components/StatCard";
import AnalyticsChart from "../components/AnalyticsChart";

export default function VendorDashboardPage() {
  const stats = [
    { title: "Total Revenue", value: "₦1,230,450", icon: BarChart2 },
    { title: "Products Listed", value: "48", icon: Package },
    { title: "Orders This Month", value: "132", icon: ShoppingBag },
    { title: "Active Customers", value: "420", icon: Users },
  ];

  return (
    <motion.div layout className="space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} icon={s.icon} />
        ))}
      </div>

      {/* Analytics Section */}
      <Card className="border border-border/30 shadow-sm">
        <CardHeader>
          <CardTitle>Sales Analytics</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <AnalyticsChart />
        </CardContent>
      </Card>
    </motion.div>
  );
}
