"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Search,
  Filter,
} from "lucide-react";
import {
  useGetAdminOrdersQuery,
} from "@/services/adminApi";
import type { IAdminTransaction, IAdminUser } from "@/services/adminApi";
import { DataTable } from "@/components/shared/DataTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildAdminOrderColumns } from "@/modules/admin/components/orders/AdminOrderColumns";
import { AdminTransactionDetailModal } from "@/modules/admin/components/transactions/AdminTransactionDetailModal";
import { useDebounce } from "@/hooks";

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // For viewing order details
  const [viewingOrder, setViewingOrder] = useState<IAdminTransaction | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: ordersData,
    isLoading,
    isFetching,
  } = useGetAdminOrdersQuery({
    page,
    limit: 10,
    status: status === "all" ? undefined : status,
    search: debouncedSearch || undefined,
  });

  const orders = ordersData?.data?.items ?? [];
  const pagination = ordersData?.data?.pagination;

  const columns = useMemo(() => buildAdminOrderColumns(), []);

  const createPaginationState = (pagination: {
    page: number | string;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | undefined) =>
    pagination
      ? {
          page: Number(pagination.page),
          pages: Number(pagination.pages),
          limit: 10,
          hasNext: pagination.hasNext,
          hasPrev: pagination.hasPrev,
          onPageChange: (p: number) => setPage(p),
        }
      : undefined;

  return (
    <section className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        <Button
          variant="outline"
          className="gap-2 h-10 border-border/40 font-black uppercase tracking-widest text-[10px] bg-background"
        >
          <Download className="h-4 w-4" /> Export Orders
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID, Buyer, or Store..."
            className="pl-10 h-11 border-border/40 rounded-sm bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="h-11 border-border/40 rounded-sm bg-background">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="All Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-border/30 rounded-sm bg-background/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={orders}
            isLoading={isLoading || isFetching}
            pagination={createPaginationState(pagination)}
            emptyMessage="No orders found matching your criteria."
            onRowClick={(row) => {
              // Map order to transaction interface for the modal
              const tx: IAdminTransaction = {
                id: row.id,
                order_id: null,
                escrow_id: null,
                user_id: null,
                vendor_id: null,
                reference: null,
                amount: row.total,
                currency: "NGN",
                status: row.status,
                type: "order",
                created_at: row.created_at,
                updated_at: row.created_at,
                user: row.buyer as unknown as IAdminUser | null,
                vendor: row.vendor as unknown as IAdminUser | null,
                description: `Order ${row.id.substring(0, 8)}`,
              };
              setViewingOrder(tx);
              setIsModalOpen(true);
            }}
          />
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <AdminTransactionDetailModal
        transaction={viewingOrder}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setViewingOrder(null);
        }}
      />
    </section>
  );
}
