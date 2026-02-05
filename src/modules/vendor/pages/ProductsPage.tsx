import { useEffect, useState } from "react";
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
const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

/* ───────────────── PAGE ───────────────── */
export default function ProductsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [inStock, setInStock] = useState<boolean | undefined>(undefined);
  const [onSale, setOnSale] = useState<boolean | undefined>(undefined);
  const [status, setStatus] = useState<"active" | "inactive" | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);

  /* ─── Debounce search input ─── */
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(id);
  }, [search]);

  /* Reset page when filters change */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, inStock, onSale, status]);

  /* ─── PRODUCTS QUERY (Unified) ─── */
  const { data, isLoading, isFetching, isError } = useGetMyStoreProductsQuery({
    q: debouncedSearch,
    page,
    limit: PAGE_SIZE,
    // Pass string 'true'/'false' to ensure query param is set correctly
    inStock: inStock === undefined ? undefined : String(inStock),
    onSale: onSale === undefined ? undefined : String(onSale),
    status,
  });

  const isSearching =
    debouncedSearch.length > 0 ||
    inStock !== undefined ||
    onSale !== undefined ||
    status !== undefined;

  /* ─── HANDLERS ─── */
  const clearFilters = () => {
    setSearch("");
    setInStock(undefined);
    setOnSale(undefined);
    setStatus(undefined);
  };

  if (isError) {
    return (
      <div className="text-center text-sm text-muted-foreground p-10">
        Failed to load products. please check your connection.
      </div>
    );
  }

  const items: IStoreProduct[] = data?.data.items ?? [];
  const pagination = data?.data.pagination;

  return (
    <section className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm">
            Manage your product listings and inventory.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button
            className="bg-primary text-white gap-2 rounded-full w-full sm:w-auto"
            onClick={() => navigate("/vendor/products/new")}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* ─── Toolbar (Search & Filters) ─── */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card p-3 rounded-lg border shadow-sm">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {/* Status Filter (Active/Inactive) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={status !== undefined ? "secondary" : "outline"}
                className="gap-2 h-10 border-dashed"
              >
                <Filter className="h-3.5 w-3.5" />
                {status === undefined
                  ? "Visibility"
                  : status === "active"
                    ? "Active"
                    : "Inactive"}
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="end">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                  onClick={() => setStatus(undefined)}
                >
                  All Visibilities
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                  onClick={() => setStatus("active")}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                  Active
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                  onClick={() => setStatus("inactive")}
                >
                  <span className="h-2 w-2 rounded-full bg-slate-400 mr-2" />
                  Inactive
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Stock Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={inStock !== undefined ? "secondary" : "outline"}
                className="gap-2 h-10 border-dashed"
              >
                <Filter className="h-3.5 w-3.5" />
                {inStock === undefined
                  ? "Stock"
                  : inStock
                    ? "In Stock"
                    : "Out of Stock"}
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="end">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                  onClick={() => setInStock(undefined)}
                >
                  All Statuses
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                  onClick={() => setInStock(true)}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                  In Stock
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                  onClick={() => setInStock(false)}
                >
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                  Out of Stock
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Sale Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={onSale !== undefined ? "secondary" : "outline"}
                className="gap-2 h-10 border-dashed"
              >
                <Filter className="h-3.5 w-3.5" />
                {onSale === undefined
                  ? "Sale"
                  : onSale
                    ? "On Sale"
                    : "Regular Price"}
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="end">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                  onClick={() => setOnSale(true)}
                >
                  On Sale
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                  onClick={() => setOnSale(false)}
                >
                  Regular Price
                </Button>
                {onSale !== undefined && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start font-normal text-muted-foreground hover:text-foreground"
                    onClick={() => setOnSale(undefined)}
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {isSearching && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={clearFilters}
              title="Clear filters"
            >
              <span className="text-xl">×</span>
            </Button>
          )}
        </div>
      </div>

      {/* ─── Products Table ─── */}
      <Card className="border border-border/30 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            {isSearching ? "Search Results" : "Product Inventory"}
          </CardTitle>
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
            emptyMessage={
              isSearching
                ? "No products match your search"
                : "No products found"
            }
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
