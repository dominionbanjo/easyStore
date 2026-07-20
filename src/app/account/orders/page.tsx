import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  useGetMyOrdersQuery,
  type OrderStatus,
  type IOrder,
} from "@/services/ordersApi";
import { Pagination } from "@/components/shared/Pagination";
import { OrderCard } from "@/modules/website/components/orders/OrderCard";
import { OrdersSkeleton } from "@/modules/website/components/skeletons/OrdersSkeleton";
import { OrdersHeader } from "@/modules/website/components/orders/OrdersHeader";
import { OrdersFilters } from "@/modules/website/components/orders/OrdersFilters";
import { OrdersEmptyState } from "@/modules/website/components/orders/OrdersEmptyState";
import { OrdersErrorState } from "@/modules/website/components/orders/OrdersErrorState";
import { OrdersNoResults } from "@/modules/website/components/orders/OrdersNoResults";

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
      <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="space-y-6 sm:space-y-10">
          {/* Header */}
          <div>
            <OrdersHeader totalOrders={totalOrders} isLoading={isLoading} />
          </div>

          {/* Filters - More integrated */}
          <div className="pb-2 px-1">
            <OrdersFilters
              searchValue={search}
              statusFilter={statusFilter}
              onSearchChange={setSearch}
              onStatusChange={setStatusFilter}
              isLoading={isLoading}
            />
          </div>

          {/* Content Area */}
          <div className="relative pt-2">
            {/* Loading Indicator */}
            {isFetching && hasOrders && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-emerald-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-sm border border-emerald-500/20 shadow-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Fetching Data...
                </div>
              </div>
            )}

            {/* Error State */}
            {error ? (
              <div className="bg-card/50 backdrop-blur-sm rounded-sm border border-red-500/20 p-8">
                <OrdersErrorState onRetry={handleRetry} />
              </div>
            ) : isLoading ? (
              /* Initial Loading */
              <OrdersSkeleton />
            ) : hasOrders ? (
              /* Orders List */
              <div className="space-y-3 sm:space-y-4">
                {orders.map((order: IOrder) => (
                  <OrderCard key={order.id} order={order} index={0} />
                ))}

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center mt-10 pt-8 border-t border-border/40">
                    <Pagination
                      page={pagination.page}
                      pages={pagination.pages}
                      hasNext={pagination.hasNext}
                      hasPrev={pagination.hasPrev}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </div>
            ) : (
              /* Empty States */
              <div className="bg-card/50 backdrop-blur-sm rounded-sm border border-border/40 p-12">
                {hasActiveFilters ? (
                  <OrdersNoResults
                    searchTerm={search}
                    statusFilter={statusFilter}
                    onClearFilters={handleClearFilters}
                  />
                ) : (
                  <OrdersEmptyState />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
