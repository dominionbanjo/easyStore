import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, X, ChevronDown, ArrowUpDown } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { DataTable } from "@/components/shared/DataTable";
import {
  createCustomerColumns,
  type ICustomer,
} from "../columns/customerColumns";
import { useGetVendorCustomersQuery } from "@/services/storeApi";

const PAGE_SIZE = 10;

const sortOptions = [
  { value: "created_at", label: "Date Joined" },
  { value: "orders_count", label: "Total Orders" },
  { value: "total_spent", label: "Amount Spent" },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [page, setPage] = useState(1);

  // Fetch customers with query parameters
  const { data, isLoading, isFetching, isError } = useGetVendorCustomersQuery({
    search: search || undefined,
    sort,
    order,
    page,
    limit: PAGE_SIZE,
  });

  const handleViewDetails = (customer: ICustomer) => {
    // You can add a modal or navigation here if needed
    console.log("View customer details:", customer);
  };

  const customerColumns = createCustomerColumns(handleViewDetails);

  if (isError) {
    return (
      <section className="space-y-6 md:space-y-8 pb-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Customers
          </h1>
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <p className="text-destructive">
                Failed to load customers. Please try again.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const customers: ICustomer[] = data?.items || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  };

  const isSearching = !!search || sort !== "created_at" || order !== "DESC";

  const clearFilters = () => {
    setSearch("");
    setSort("created_at");
    setOrder("DESC");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const handleOrderToggle = () => {
    setOrder(order === "ASC" ? "DESC" : "ASC");
    setPage(1);
  };

  return (
    <section className="space-y-6 md:space-y-8 pb-10">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Customers
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Build and manage relationship with your store customers.
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
        </motion.div>
      </div>

      {/* ─── Toolbar (Search & Filters) ─── */}
      <div className="flex flex-col gap-4 bg-card/50 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-2xl border border-border/40 shadow-sm transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <div className="relative w-full sm:flex-1 group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by name, email, location or phone..."
              className="pl-9 h-10 bg-background/50 border-border/40 focus:bg-background transition-all rounded-xl"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {search && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
            {/* Sort Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={sort !== "created_at" ? "secondary" : "outline"}
                  className="gap-2 h-10 border-dashed rounded-xl shrink-0"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wider font-bold">
                    Sort: {sortOptions.find((opt) => opt.value === sort)?.label}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 p-1.5 rounded-xl border-border/40"
                align="end"
              >
                <div className="space-y-1">
                  {sortOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={sort === opt.value ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-xs font-semibold"
                      onClick={() => handleSortChange(opt.value)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                  <div className="my-1 border-t border-border/40" />
                  <Button
                    variant={order === "ASC" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs font-semibold"
                    onClick={handleOrderToggle}
                  >
                    {order === "ASC" ? "Oldest First" : "Newest First"}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {isSearching && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground h-10 px-4 rounded-xl gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Customers Table ─── */}
      <div className="w-full space-y-4">
        <div className="flex flex-row items-center justify-between px-1">
          <h2 className="text-lg font-bold tracking-tight">Customer List</h2>
          <p className="text-sm text-muted-foreground">
            {pagination.total}{" "}
            {pagination.total === 1 ? "customer" : "customers"}
          </p>
        </div>

        <DataTable<ICustomer, unknown>
          columns={customerColumns}
          data={customers}
          isLoading={isLoading || isFetching}
          className="border-none"
          emptyMessage={
            isSearching
              ? "No customers match your search"
              : "No customers found"
          }
          pagination={
            pagination.pages > 1
              ? {
                  page: pagination.page,
                  pages: pagination.pages,
                  limit: PAGE_SIZE,
                  hasNext: pagination.hasNext,
                  hasPrev: pagination.hasPrev,
                  onPageChange: setPage,
                }
              : undefined
          }
        />
      </div>
    </section>
  );
}
