import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import {
  useGetMyOrdersQuery,
  type OrderStatus,
  type IOrder,
} from "@/services/ordersApi";
import { Pagination } from "@/components/shared/Pagination";
import { OrderCard } from "../components/orders/OrderCard";
import { OrdersSkeleton } from "../components/skeletons/OrdersSkeleton";
import { OrdersHeader } from "../components/orders/OrdersHeader";
import { OrdersFilters } from "../components/orders/OrdersFilters";
import { OrdersEmptyState } from "../components/orders/OrdersEmptyState";
import { OrdersErrorState } from "../components/orders/OrdersErrorState";
import { OrdersNoResults } from "../components/orders/OrdersNoResults";

export default function OrdersPage() {
  // State Management
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // Fetch Orders
  const {
    data: paginatedOrders,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetMyOrdersQuery(
    {
      search: debouncedSearch || undefined,
      status:
        statusFilter === "all" ? undefined : (statusFilter as OrderStatus),
      page,
      limit,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const orders: IOrder[] = paginatedOrders?.items || [];
  const pagination = paginatedOrders?.pagination;
  const totalOrders = pagination?.total || 0;

  // Clear Filters Handler
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  // Retry Handler
  const handleRetry = () => {
    refetch();
  };

  // Check if filters are active
  const hasActiveFilters = search || statusFilter !== "all";
  const hasOrders = orders.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <OrdersHeader totalOrders={totalOrders} isLoading={isLoading} />
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-gray-100 dark:border-white/5 shadow-sm p-6"
          >
            <OrdersFilters
              searchValue={search}
              statusFilter={statusFilter}
              onSearchChange={setSearch}
              onStatusChange={setStatusFilter}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Content Area */}
          <div className="relative">
            {/* Loading Indicator */}
            <AnimatePresence>
              {isFetching && hasOrders && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                >
                  <div className="bg-emerald-600 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error State */}
            {error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-red-100 dark:border-red-950/20 shadow-sm"
              >
                <OrdersErrorState onRetry={handleRetry} />
              </motion.div>
            ) : isLoading ? (
              /* Initial Loading */
              <OrdersSkeleton />
            ) : hasOrders ? (
              /* Orders List */
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {orders.map((order: IOrder, index: number) => (
                    <OrderCard key={order.id} order={order} index={index} />
                  ))}
                </AnimatePresence>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mt-8 pt-8 border-t-2 border-gray-100 dark:border-white/5"
                  >
                    <Pagination
                      page={pagination.page}
                      pages={pagination.pages}
                      hasNext={pagination.hasNext}
                      hasPrev={pagination.hasPrev}
                      onPageChange={setPage}
                    />
                  </motion.div>
                )}
              </div>
            ) : (
              /* Empty States */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-gray-100 dark:border-white/5 shadow-sm"
              >
                {hasActiveFilters ? (
                  <OrdersNoResults
                    searchTerm={search}
                    statusFilter={statusFilter}
                    onClearFilters={handleClearFilters}
                  />
                ) : (
                  <OrdersEmptyState />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
