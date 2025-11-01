import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Eye,
  MessageSquare,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

//
// ─── Mock Orders ─────────────────────────────────────────────────────────────
//
const mockOrders = [
  {
    id: "ORD-10234",
    customer: "Jane Doe",
    email: "jane.doe@example.com",
    date: "2025-10-14",
    total: 54000,
    status: "Processing",
    items: 3,
  },
  {
    id: "ORD-10221",
    customer: "Michael Johnson",
    email: "mikej@example.com",
    date: "2025-10-12",
    total: 120000,
    status: "Delivered",
    items: 5,
  },
  {
    id: "ORD-10199",
    customer: "Amaka Okafor",
    email: "amaka.okafor@example.com",
    date: "2025-10-09",
    total: 78000,
    status: "Shipped",
    items: 2,
  },
  {
    id: "ORD-10188",
    customer: "Yusuf Ibrahim",
    email: "yusuf.ibrahim@example.com",
    date: "2025-10-03",
    total: 40000,
    status: "Cancelled",
    items: 1,
  },
];

const statusOptions = [
  "All",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

//
// ─── Orders Page ─────────────────────────────────────────────────────────────
//
export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredOrders = mockOrders.filter((order) => {
    const matchSearch =
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "All" || order.status === status;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const base =
      "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full";
    switch (status) {
      case "Processing":
        return (
          <Badge
            variant="outline"
            className={cn(
              base,
              "bg-yellow-50 text-yellow-700 border-yellow-200"
            )}
          >
            <Clock className="h-3.5 w-3.5" /> Processing
          </Badge>
        );
      case "Shipped":
        return (
          <Badge
            variant="outline"
            className={cn(base, "bg-blue-50 text-blue-700 border-blue-200")}
          >
            <Truck className="h-3.5 w-3.5" /> Shipped
          </Badge>
        );
      case "Delivered":
        return (
          <Badge
            variant="outline"
            className={cn(base, "bg-green-50 text-green-700 border-green-200")}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Delivered
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge
            variant="outline"
            className={cn(base, "bg-red-50 text-red-700 border-red-200")}
          >
            <XCircle className="h-3.5 w-3.5" /> Cancelled
          </Badge>
        );
    }
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground text-sm">
            Manage all orders and their fulfillment statuses.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {status}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-2 text-sm">
              {statusOptions.map((s) => (
                <Button
                  key={s}
                  variant={status === s ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setStatus(s)}
                >
                  {s}
                </Button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border border-border/30 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Order Overview</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/30 text-left">
                <th className="py-3 px-4 font-medium">Order ID</th>
                <th className="py-3 px-4 font-medium">Customer</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Items</th>
                <th className="py-3 px-4 font-medium">Total</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/20 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{order.id}</td>

                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.email}
                      </p>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(order.date).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4">{order.items}</td>

                  <td className="py-3 px-4 font-semibold text-foreground">
                    ₦{order.total.toLocaleString()}
                  </td>

                  <td className="py-3 px-4">{getStatusBadge(order.status)}</td>

                  <td className="py-3 px-4 text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-44 p-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Message Buyer
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2"
                        >
                          <Truck className="h-4 w-4" />
                          Mark as Shipped
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No orders found.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
