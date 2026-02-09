import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useStoreSetup } from "../hooks/useStoreSetup";
import { SetupEnforcementModal } from "../components/modals/SetupEnforcementModal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  Package,
  Download,
  List,
  SearchX,
  X,
  LayoutGrid,
} from "lucide-react";

import { DataTable } from "@/components/shared/DataTable";
import { useGetMyStoreProductsQuery } from "@/services/productApi";
import type { IStoreProduct } from "@/types/product/productTypes";
import { productColumns } from "../columns/productColumns";
import { cn } from "@/lib/utils";

/* ───────────────── CONSTANTS ───────────────── */
const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

/* ───────────────── PAGE ───────────────── */
export default function ProductsPage() {
  const navigate = useNavigate();
  const { isReady, isLoading: checkingSetup } = useStoreSetup();
  const [showSetupModal, setShowSetupModal] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isOutOfStock, setIsOutOfStock] = useState<boolean | undefined>(
    undefined,
  );
  const [onSale, setOnSale] = useState<boolean | undefined>(undefined);
  const [status, setStatus] = useState<"active" | "inactive" | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

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
  }, [debouncedSearch, isOutOfStock, onSale, status]);

  /* ─── PRODUCTS QUERY (Unified) ─── */
  const { data, isLoading, isFetching, isError } = useGetMyStoreProductsQuery({
    q: debouncedSearch,
    page,
    limit: PAGE_SIZE,
    isOutOfStock: isOutOfStock === undefined ? undefined : String(isOutOfStock),
    onSale: onSale === undefined ? undefined : String(onSale),
    status,
  });

  const isSearching =
    debouncedSearch.length > 0 ||
    isOutOfStock !== undefined ||
    onSale !== undefined ||
    status !== undefined;

  /* ─── HANDLERS ─── */
  const clearFilters = () => {
    setSearch("");
    setIsOutOfStock(undefined);
    setOnSale(undefined);
    setStatus(undefined);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Package className="h-12 w-12 text-muted-foreground/30" />
        <p className="text-muted-foreground text-sm">
          Failed to load products. Please check your connection.
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const isActuallyLoading =
    isLoading || isFetching || search.trim() !== debouncedSearch;
  const items: IStoreProduct[] = data?.data.items ?? [];
  const pagination = data?.data.pagination;

  return (
    <section className="space-y-6 md:space-y-8 pb-10">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Products
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your inventory and product listings in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex gap-2 border-border/60"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            className="bg-primary text-primary-foreground gap-2 rounded-xl shadow-lg shadow-primary/20"
            disabled={checkingSetup}
            onClick={() => {
              if (!isReady) {
                setShowSetupModal(true);
              } else {
                navigate("/vendor/products/new");
              }
            }}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </motion.div>
      </div>

      {/* ─── Toolbar (Search & Filters) ─── */}
      <div className="flex flex-col gap-4 bg-card/50 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-2xl border border-border/40 shadow-sm transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <div className="relative w-full sm:flex-1 group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Find products by name, tag or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-background/50 border-border/40 focus:bg-background transition-all rounded-xl"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
            {/* Status Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={status !== undefined ? "secondary" : "outline"}
                  className="gap-2 h-10 border-dashed rounded-xl shrink-0"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span className="text-xs uppercase tracking-wider font-bold">
                    {status === undefined ? "Status" : status}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-48 p-1.5 rounded-xl border-border/40"
                align="end"
              >
                <div className="space-y-1">
                  {["all", "active", "inactive"].map((s) => (
                    <Button
                      key={s}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start font-medium rounded-lg",
                        (status === undefined && s === "all") || status === s
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground",
                      )}
                      onClick={() =>
                        setStatus(s === "all" ? undefined : (s as any))
                      }
                    >
                      {s === "active" && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                      )}
                      {s === "inactive" && (
                        <span className="h-2 w-2 rounded-full bg-slate-400 mr-2" />
                      )}
                      <span className="capitalize">
                        {s === "all" ? "All Visibilities" : s}
                      </span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Out of Stock Filter (Checkbox) */}
            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border/40 rounded-xl hover:bg-background transition-all duration-200 cursor-pointer group shrink-0">
              <Checkbox
                id="out_of_stock"
                checked={isOutOfStock === true}
                onCheckedChange={(checked) =>
                  setIsOutOfStock(checked === true ? true : undefined)
                }
                className="rounded-md border-border/60 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
              />
              <Label
                htmlFor="out_of_stock"
                className="text-xs font-bold uppercase tracking-widest cursor-pointer select-none text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
              >
                Out of Stock
              </Label>
            </div>

            {/* Sale Filter (Checkbox) */}
            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border/40 rounded-xl hover:bg-background transition-all duration-200 cursor-pointer group shrink-0">
              <Checkbox
                id="on_sale"
                checked={onSale === true}
                onCheckedChange={(checked) =>
                  setOnSale(checked === true ? true : undefined)
                }
                className="rounded-md border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor="on_sale"
                className="text-xs font-bold uppercase tracking-widest cursor-pointer select-none text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
              >
                On Sale
              </Label>
            </div>

            {isSearching && (
              <Button
                variant="ghost"
                size="sm"
                className="h-10 px-3 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={clearFilters}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Products Table / Grid ─── */}
      {/* ─── Products Table / Grid ─── */}
      <div className="w-full space-y-4">
        <div className="flex flex-row items-center justify-between px-1">
          <h3 className="text-lg font-bold">Inventory Overview</h3>
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border/40">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-md",
                viewMode === "table" && "bg-background shadow-sm",
              )}
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-md",
                viewMode === "grid" && "bg-background shadow-sm",
              )}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "table" ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DataTable<IStoreProduct, unknown>
                columns={productColumns}
                data={items}
                isLoading={isActuallyLoading}
                className="border-none"
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
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {isActuallyLoading ? (
                // Grid Skeleton
                [...Array(8)].map((_, i) => (
                  <Card
                    key={i}
                    className="p-2 rounded-2xl border-border/40 animate-pulse bg-card"
                  >
                    <div className="aspect-square bg-muted rounded-xl" />
                    <CardContent className="p-3 pt-4 space-y-3">
                      {" "}
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : items.length > 0 ? (
                items.map((product) => (
                  <Card
                    key={product.id}
                    className="p-2 rounded-2xl border-border/40 hover:border-primary/40 transition-all group bg-card shadow-sm hover:shadow-md"
                  >
                    <div className="aspect-square relative overflow-hidden rounded-xl bg-muted/20">
                      <img
                        src={product.image?.url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        <Badge
                          variant={
                            product.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {product.status}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3 pt-4">
                      <p className="font-bold line-clamp-1">{product.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-primary font-bold">
                          ₦{Number(product.price).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Stock: {product.stock}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full h-[400px] flex flex-col items-center justify-center gap-3">
                  <div className="p-4 rounded-full bg-muted/50 text-muted-foreground/40">
                    <SearchX className="h-10 w-10" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      No products found
                    </p>
                    <p className="text-sm text-muted-foreground max-w-[200px]">
                      {isSearching
                        ? "Try adjusting your filters or search terms."
                        : "You haven't added any products to your store yet."}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SetupEnforcementModal
        open={showSetupModal}
        onOpenChange={setShowSetupModal}
      />
    </section>
  );
}
