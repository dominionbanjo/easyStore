import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Users, UserCheck, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoreCustomer {
  id: string;
  name: string;
  email: string;
  location: string | null;
  spent: number;
  orders: number;
}

interface CustomerInsightsProps {
  customers: StoreCustomer[];
}

export function CustomerInsights({ customers }: CustomerInsightsProps) {
  // Sort by spent for "VIPs"
  const topVIPs = [...customers].sort((a, b) => b.spent - a.spent).slice(0, 5);

  return (
    <Card className="border-none shadow-xl bg-card flex flex-col h-full overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-muted/20">
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-500" /> Customer Insights
        </CardTitle>
        <CardDescription>Identifying your most loyal buyers</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto max-h-[440px] custom-scrollbar">
        {customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center opacity-40 h-full">
            <Users className="w-12 h-12 mb-4" />
            <p className="font-bold">No customers yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border/30 pr-1">
            {topVIPs.map((customer, idx) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group"
              >
                <Avatar className="h-12 w-12 rounded-2xl border border-border/50 ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.email}`}
                  />
                  <AvatarFallback className="rounded-2xl bg-blue-500/10 text-blue-600 font-bold">
                    {customer.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">
                    {customer.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 opacity-60">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {customer.location || "Online"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-foreground">
                    ₦{Number(customer.spent).toLocaleString()}
                  </p>
                  <p className="text-[10px] font-black uppercase text-blue-500">
                    {customer.orders} Orders
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
