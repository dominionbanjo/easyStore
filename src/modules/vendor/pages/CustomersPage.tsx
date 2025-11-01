import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Search,
  Mail,
  MessageSquare,
  ShoppingBag,
  Filter,
  ChevronDown,
  Phone,
  Star,
  MoreVertical,
  ArrowUpDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

//
// ─── Mock Data ─────────────────────────────────────────────────────────────
//
const mockCustomers = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+234 802 345 6789",
    totalOrders: 12,
    totalSpent: 154000,
    location: "Lagos, Nigeria",
    rating: 4.8,
    image: "/images/avatar1.jpg",
    lastOrder: "2025-10-14",
  },
  {
    id: 2,
    name: "Michael Johnson",
    email: "mikej@example.com",
    phone: "+234 803 234 6782",
    totalOrders: 8,
    totalSpent: 92000,
    location: "Abuja, Nigeria",
    rating: 4.5,
    image: "/images/avatar2.jpg",
    lastOrder: "2025-09-28",
  },
  {
    id: 3,
    name: "Amaka Okafor",
    email: "amaka.okafor@example.com",
    phone: "+234 810 777 3344",
    totalOrders: 21,
    totalSpent: 267500,
    location: "Enugu, Nigeria",
    rating: 5.0,
    image: "/images/avatar3.jpg",
    lastOrder: "2025-10-20",
  },
  {
    id: 4,
    name: "Yusuf Ibrahim",
    email: "yusuf.ibrahim@example.com",
    phone: "+234 816 334 1222",
    totalOrders: 4,
    totalSpent: 32000,
    location: "Kano, Nigeria",
    rating: 4.2,
    image: "/images/avatar4.jpg",
    lastOrder: "2025-08-15",
  },
];

//
// ─── Customers Page ───────────────────────────────────────────────────────
//
export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"orders" | "spent" | "rating">("orders");

  const filtered = mockCustomers
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase().trim()))
    .sort((a, b) => {
      if (sortBy === "orders") return b.totalOrders - a.totalOrders;
      if (sortBy === "spent") return b.totalSpent - a.totalSpent;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <section className="space-y-8">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground text-sm">
            Manage and analyze your store’s customers efficiently.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Sort by
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-2 text-sm">
              {["orders", "spent", "rating"].map((v) => (
                <Button
                  key={v}
                  variant={sortBy === v ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start capitalize"
                  onClick={() => setSortBy(v as any)}
                >
                  {v === "spent" && "Total Spent"}
                  {v === "orders" && "Total Orders"}
                  {v === "rating" && "Rating"}
                </Button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* ─── Table ─── */}
      <Card className="border border-border/30 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Customer Overview</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Export
          </Button>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/30 text-left">
                <th className="py-3 px-4 font-medium">Customer</th>
                <th className="py-3 px-4 font-medium">Location</th>
                <th className="py-3 px-4 font-medium">Orders</th>
                <th className="py-3 px-4 font-medium">Spent</th>
                <th className="py-3 px-4 font-medium">Rating</th>
                <th className="py-3 px-4 font-medium">Last Order</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "border-b border-border/20 hover:bg-muted/30 transition-colors"
                  )}
                >
                  {/* Customer */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-muted-foreground">
                    {c.location}
                  </td>

                  <td className="py-3 px-4">{c.totalOrders}</td>

                  <td className="py-3 px-4 font-medium text-foreground">
                    ₦{c.totalSpent.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-500" />
                    {c.rating.toFixed(1)}
                  </td>

                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(c.lastOrder).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Email
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Chat
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          View Orders
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 text-destructive"
                        >
                          <Phone className="h-4 w-4" />
                          Call
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No customers found.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
