import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Search, Filter, ChevronDown, Download, X } from "lucide-react";

import { DataTable } from "@/components/shared/DataTable";
import { createOrderColumns } from "@/modules/vendor/columns/orderColumns";
import { useGetVendorOrdersQuery } from "@/services/ordersApi";
import type { IOrder } from "@/services/ordersApi";
import { OrderDetailsModal } from "@/modules/vendor/components/OrderDetailsModal";
import { useNavigate } from "react-router-dom";
import { useStartConversationMutation } from "@/services/messagingApi";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const statusOptions = [
  { value: undefined, label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "assigned", label: "Assigned" },
  { value: "in_transit", label: "In Transit" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "returned", label: "Returned" },
  { value: "canceled", label: "Cancelled" },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [startConversation, { isLoading: isMessagingLoading }] = useStartConversationMutation();

  // Fetch orders with query parameters
  const { data, isLoading, isFetching, isError } = useGetVendorOrdersQuery({
    search: search || undefined,
    status: status || undefined,
    page,
    limit: PAGE_SIZE,
  });

  // Handle view details
  const handleViewDetails = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Handle message buyer
  const handleMessageBuyer = async (order: IOrder) => {
    if (!order.buyer_id) {
      toast.error("Cannot message guest buyers without an account.");
      return;
    }

    try {
      const result = await startConversation({ recipient_id: order.buyer_id }).unwrap();
      toast.success("Redirecting to conversation...");
      navigate(`/messages/${result.data.id}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to start conversation.");
    }
  };

  // Create columns with callback
  const orderColumns = createOrderColumns(handleViewDetails, handleMessageBuyer);

  if (isError) {
    return (
      <section className="space-y-6 md:space-y-8 pb-10">
        <div className="flex flex-col gap-4">
          <Card className="border-destructive/50 mt-4">
            <CardContent className="pt-6">
              <p className="text-destructive">
                Failed to load orders. Please try again.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // Extract data from paginated response
  const orders: IOrder[] = data?.items || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  };

  const isSearching = !!search || !!status;

  const clearFilters = () => {
    setSearch("");
    setStatus(undefined);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  const handleStatusChange = (value: string | undefined) => {
    setStatus(value);
    setPage(1); // Reset to first page on filter
  };

  return (
    <section className="space-y-4 md:space-y-6 pb-10">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            Manage all orders and their fulfillment statuses.
          </p>
        </div>

        <div
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
        </div>
      </div>

      {/* ─── Toolbar (Search & Filters) ─── */}
      <div className="flex flex-col gap-4 bg-card/50 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-sm border border-border/40  transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <div className="relative w-full sm:flex-1 group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by order ID or reference..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 h-10 bg-background/50 border-border/40 focus:bg-background transition-all rounded-sm"
            />
            {search && (
              <button
                onClick={() => handleSearchChange("")}
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
                  className="gap-2 h-10 border-dashed rounded-sm shrink-0"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span className="text-xs uppercase tracking-wider font-bold">
                    {status === undefined
                      ? "Status"
                      : statusOptions.find((s) => s.value === status)?.label}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-48 p-1.5 rounded-sm border-border/40"
                align="end"
              >
                <div className="space-y-1">
                  {statusOptions.map((s) => (
                    <Button
                      key={s.label}
                      variant={status === s.value ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStatusChange(s.value)}
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Clear Filters */}
            {isSearching && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2 h-10 rounded-sm shrink-0"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Orders Table ─── */}
      <div className="w-full space-y-4">
        <div className="flex flex-row items-center justify-between px-1">
          <h2 className="text-lg font-bold tracking-tight">Order Overview</h2>
          <p className="text-sm text-muted-foreground">
            {pagination.total} {pagination.total === 1 ? "order" : "orders"}
          </p>
        </div>

        <DataTable<IOrder, unknown>
          columns={orderColumns}
          data={orders}
          isLoading={isLoading || isFetching || isMessagingLoading}
          className="border-none"
          onRowClick={handleViewDetails}
          emptyMessage={
            isSearching ? "No orders match your search" : "No orders found"
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

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedOrder(null);
        }}
      />
    </section>
  );
}
