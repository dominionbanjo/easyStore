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
  Edit,
  Eye,
  Trash2,
  Plus,
  Package,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

//
// ─── Mock Product Data ─────────────────────────────────────────────────────
//
const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    category: "Electronics",
    price: 99999,
    stock: 12,
    status: "Active",
    image: "/images/elect2.png",
    lastUpdated: "2025-10-18",
  },
  {
    id: 2,
    name: "Leather Crossbody Bag",
    category: "Fashion",
    price: 42000,
    stock: 0,
    status: "Out of Stock",
    image: "/images/fash1.png",
    lastUpdated: "2025-10-15",
  },
  {
    id: 3,
    name: "Minimal Ceramic Vase",
    category: "Home & Living",
    price: 18500,
    stock: 36,
    status: "Active",
    image: "/images/home3.png",
    lastUpdated: "2025-10-16",
  },
  {
    id: 4,
    name: "Organic Shea Butter Lotion",
    category: "Beauty",
    price: 9500,
    stock: 8,
    status: "Draft",
    image: "/images/home5.png",
    lastUpdated: "2025-10-12",
  },
];

const categories = ["All", "Electronics", "Fashion", "Home & Living", "Beauty"];

//
// ─── Products Page ─────────────────────────────────────────────────────────
//
export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredProducts = mockProducts.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCategory = filter === "All" || product.category === filter;
    return matchSearch && matchCategory;
  });

  const getStatusBadge = (status: string) => {
    const base =
      "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full";
    switch (status) {
      case "Active":
        return (
          <Badge
            variant="outline"
            className={cn(base, "bg-green-50 text-green-700 border-green-200")}
          >
            <CheckCircle className="h-3.5 w-3.5" /> Active
          </Badge>
        );
      case "Out of Stock":
        return (
          <Badge
            variant="outline"
            className={cn(base, "bg-red-50 text-red-700 border-red-200")}
          >
            <XCircle className="h-3.5 w-3.5" /> Out of Stock
          </Badge>
        );
      case "Draft":
        return (
          <Badge
            variant="outline"
            className={cn(
              base,
              "bg-yellow-50 text-yellow-700 border-yellow-200"
            )}
          >
            <Clock className="h-3.5 w-3.5" /> Draft
          </Badge>
        );
    }
  };

  return (
    <section className="space-y-8">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm">
            Manage your product listings and inventory.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {filter}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-2 text-sm">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={filter === cat ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </Button>
              ))}
            </PopoverContent>
          </Popover>

          <Button className="bg-primary text-white gap-2 rounded-full">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* ─── Products Table ─── */}
      <Card className="border border-border/30 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Product Inventory</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Package className="h-4 w-4" />
            Export
          </Button>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/30 text-left">
                <th className="py-3 px-4 font-medium">Product</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Price</th>
                <th className="py-3 px-4 font-medium">Stock</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Last Updated</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/20 hover:bg-muted/30 transition-colors"
                >
                  {/* Product Column */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-md object-cover border"
                    />
                    <div>
                      <p className="font-medium line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ID: #{product.id}
                      </p>
                    </div>
                  </td>

                  <td className="py-3 px-4">{product.category}</td>

                  <td className="py-3 px-4 font-semibold text-foreground">
                    ₦{product.price.toLocaleString()}
                  </td>

                  <td
                    className={cn(
                      "py-3 px-4 font-medium",
                      product.stock <= 0 ? "text-red-600" : "text-green-600"
                    )}
                  >
                    {product.stock <= 0
                      ? "Out of Stock"
                      : `${product.stock} pcs`}
                  </td>

                  <td className="py-3 px-4">
                    {getStatusBadge(product.status)}
                  </td>

                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(product.lastUpdated).toLocaleDateString()}
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
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No products found.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
