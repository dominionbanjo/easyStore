import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Search, Filter, ChevronDown, Plus, Package } from "lucide-react";

import { DataTable } from "@/components/shared/DataTable";

import { useGetMyStoreProductsQuery } from "@/services/productApi";
import type { IStoreProduct } from "@/types/product/productTypes";

import { productColumns } from "../columns/productColumns";

/* ───────────────── CONSTANTS ───────────────── */
const categories = ["All"];

/* ───────────────── PAGE ───────────────── */
export default function ProductsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } = useGetMyStoreProductsQuery({
    page,
    limit: 10,
  });

  if (isError) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Failed to load products
      </div>
    );
  }

  const items = data?.data.items ?? [];
  const pagination = data?.data.pagination;

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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
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
                  onClick={() => {
                    setFilter(cat);
                    setPage(1);
                  }}
                >
                  {cat}
                </Button>
              ))}
            </PopoverContent>
          </Popover>

          {/* ✅ ADD PRODUCT BUTTON */}
          <Button
            className="bg-primary text-white gap-2 rounded-full"
            onClick={() => navigate("/vendor/products/new")}
          >
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

        <CardContent>
          <DataTable<IStoreProduct, unknown>
            columns={productColumns}
            data={items}
            isLoading={isLoading || isFetching}
            emptyMessage="No products found"
            pagination={
              pagination
                ? {
                    page: pagination.page,
                    pages: pagination.pages,
                    hasNext: pagination.hasNext,
                    hasPrev: pagination.hasPrev,
                    onPageChange: setPage,
                  }
                : undefined
            }
          />
        </CardContent>
      </Card>
    </section>
  );
}
