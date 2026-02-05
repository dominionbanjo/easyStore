import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { FormInput } from "@/components/shared/form/FormInput";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Search, Package, Loader2 } from "lucide-react";
import {
  useGetMyOrdersQuery,
  type OrderStatus,
  type IOrder,
} from "@/services/ordersApi";
import { Pagination } from "@/components/shared/Pagination";
import { OrderCard } from "../components/orders/OrderCard";
import { OrdersSkeleton } from "../components/skeletons/OrdersSkeleton";

// ─────────────────────────────────────────────────────────────
// COMPONENT: MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function MyOrdersPage() {
  const methods = useForm({
    defaultValues: {
      search: "",
    },
    mode: "onChange",
  });

  const search = methods.watch("search");

  // debouncedSearch state to control API calls
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // RTK Query Hook
  const {
    data: paginatedOrders,
    isLoading,
    isFetching,
    error,
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

  return (
    <FormProvider {...methods}>
      <section className="min-h-screen bg-emerald-50/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* HEADER & FILTERS */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  My Orders
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Manage your recent purchases and track shipments
                </p>
              </div>

              <Button
                asChild
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
              >
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 z-10" />
                <FormInput
                  name="search"
                  placeholder="Search by Order ID or Reference..."
                  className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="canceled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ERROR STATE */}
          {error ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-red-100">
              <div className="bg-red-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Unable to load orders
              </h3>
              <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                There was a problem fetching your orders. Please try again
                later.
              </p>
            </div>
          ) : isLoading ? (
            <OrdersSkeleton />
          ) : (
            /* ORDERS LIST */
            <div className="space-y-4 relative">
              {/* Subtle Overlay during refetching */}
              {isFetching && orders.length > 0 && (
                <div className="absolute inset-x-0 -top-2 flex justify-center z-10">
                  <div className="bg-emerald-50/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm flex items-center gap-2 text-[11px] font-bold text-emerald-600 animate-in fade-in slide-in-from-top-2 duration-300 uppercase tracking-wider">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Refreshing Results
                  </div>
                </div>
              )}

              {orders.length > 0 ? (
                <>
                  {orders.map((order: IOrder) => (
                    <OrderCard key={order.id} order={order} />
                  ))}

                  {/* PAGINATION */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex justify-center mt-8">
                      <Pagination
                        page={pagination.page}
                        pages={pagination.pages}
                        hasNext={pagination.hasNext}
                        hasPrev={pagination.hasPrev}
                        onPageChange={setPage}
                      />
                    </div>
                  )}
                </>
              ) : isFetching ? (
                <OrdersSkeleton />
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                  <div className="bg-emerald-100/50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No orders found
                  </h3>
                  <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                    {search || statusFilter !== "all"
                      ? "Try adjusting your filters to find what you're looking for."
                      : "You haven't placed any orders yet."}
                  </p>
                  {(search || statusFilter !== "all") && (
                    <Button
                      variant="link"
                      onClick={() => {
                        methods.setValue("search", "");
                        setStatusFilter("all");
                      }}
                      className="mt-2 text-emerald-600"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </FormProvider>
  );
}
