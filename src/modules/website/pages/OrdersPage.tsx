import { useState } from "react";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// ✅ Mock data for demo
const mockOrders = [
  {
    id: "ORD-98432",
    product: "Handcrafted Leather Bag",
    image: "/images/mock-bag.jpg",
    price: 95000,
    quantity: 1,
    status: "Delivered",
    date: "2025-10-12",
  },
  {
    id: "ORD-72143",
    product: "Minimal Ceramic Vase",
    image: "/images/mock-vase.jpg",
    price: 18000,
    quantity: 2,
    status: "Shipped",
    date: "2025-10-16",
  },
  {
    id: "ORD-41237",
    product: "Classic White Sneakers",
    image: "/images/mock-shoes.jpg",
    price: 52000,
    quantity: 1,
    status: "Pending",
    date: "2025-10-21",
  },
  {
    id: "ORD-30215",
    product: "Wireless Bluetooth Speaker",
    image: "/images/mock-speaker.jpg",
    price: 40000,
    quantity: 1,
    status: "Cancelled",
    date: "2025-09-25",
  },
];

export default function MyOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.product
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <section className="min-h-screen bg-emerald-50/40 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 🧭 Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
            <p className="text-gray-600">
              Track, filter, and manage all your purchases.
            </p>
          </div>

          {/* 🔍 Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map(
                  (s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 📦 Orders Grid */}
        <div className="grid gap-5 mt-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="flex flex-col sm:flex-row justify-between items-center sm:items-stretch hover:shadow-md transition-all bg-white rounded-xl border"
              >
                {/* Image */}
                <div className="w-full sm:w-48 h-40 bg-gray-100 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none overflow-hidden">
                  <img
                    src={order.image}
                    alt={order.product}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <CardContent className="flex flex-col justify-between flex-1 py-4 px-5">
                  <div className="flex justify-between flex-col sm:flex-row gap-2">
                    <div>
                      <CardTitle className="text-base font-semibold">
                        {order.product}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Order ID: {order.id}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <span>Qty:</span>
                      <span className="font-medium">{order.quantity}</span>
                    </div>

                    <div className="text-gray-800 font-semibold">
                      ₦{order.price.toLocaleString()}
                    </div>

                    <Badge
                      variant="outline"
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-full capitalize",
                        order.status === "Delivered" &&
                          "bg-green-100 text-green-700 border-green-300",
                        order.status === "Pending" &&
                          "bg-yellow-100 text-yellow-700 border-yellow-300",
                        order.status === "Cancelled" &&
                          "bg-red-100 text-red-700 border-red-300",
                        order.status === "Shipped" &&
                          "bg-blue-100 text-blue-700 border-blue-300"
                      )}
                    >
                      {order.status === "Delivered" && (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      {order.status === "Pending" && (
                        <Package className="h-4 w-4" />
                      )}
                      {order.status === "Shipped" && (
                        <Truck className="h-4 w-4" />
                      )}
                      {order.status === "Cancelled" && (
                        <XCircle className="h-4 w-4" />
                      )}
                      {order.status}
                    </Badge>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => navigate("/orders/1")}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No orders found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
