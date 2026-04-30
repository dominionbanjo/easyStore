import { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  X,
  Banknote,
  AlertCircle,
} from "lucide-react";
import { useGetVendorPayoutsQuery } from "@/services/payoutsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { DataTable } from "@/components/shared/DataTable";
import { createPayoutColumns } from "@/modules/vendor/columns/payoutColumns";
import type { IPayout } from "@/services/payoutsApi";
import { Modal } from "@/components/shared/Modal";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 10;

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "pending_manual", label: "In Review" },
  { value: "success", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "reversed", label: "Reversed" },
];

export default function PayoutsView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedPayout, setSelectedPayout] = useState<IPayout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetVendorPayoutsQuery({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: status === "all" ? undefined : status,
  });

  const payouts = data?.data?.items || [];
  const pagination = data?.data?.pagination;
  const isSearching = !!search || status !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const payoutColumns = createPayoutColumns(
    (payout) => {
      setSelectedPayout(payout);
      setIsModalOpen(true);
    },
    (orderId) => console.log("View Order", orderId),
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* ─── Toolbar (Search & Filters) ─── */}
      <div className="flex flex-col gap-4 bg-card/50 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-sm border border-border/40 transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <div className="relative w-full sm:flex-1 group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by transfer reference or code..."
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={status !== "all" ? "secondary" : "outline"}
                  className="gap-2 h-10 border-dashed rounded-sm shrink-0"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span className="text-xs uppercase tracking-wider font-bold">
                    {status === "all"
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
                      key={s.value}
                      variant={status === s.value ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-xs font-bold uppercase tracking-widest"
                      onClick={() => handleStatusChange(s.value)}
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

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

      {/* ─── Payouts Table ─── */}
      <div className="w-full space-y-4">
        <div className="flex flex-row items-center justify-between px-1">
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            Payout History
          </h2>
          {pagination && (
            <p className="text-sm text-muted-foreground">
              {pagination.total} {pagination.total === 1 ? "payout" : "payouts"}
            </p>
          )}
        </div>

        <DataTable<IPayout, unknown>
          columns={payoutColumns}
          data={payouts}
          isLoading={isLoading || isFetching}
          className="border-none"
          onRowClick={(payout) => {
            setSelectedPayout(payout);
            setIsModalOpen(true);
          }}
          emptyMessage={
            isSearching ? "No payouts match your search" : "No payouts found"
          }
          pagination={
            pagination && pagination.pages > 1
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

      {/* ─── Payout Details Modal ─── */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Payout Details"
        description="Detailed breakdown of your earnings and transaction status."
        className="sm:max-w-[500px]"
      >
        {selectedPayout && (
          <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Status & Amount Header */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-border/40">
              <div
                className={cn(
                  "w-16 h-16 rounded-sm flex items-center justify-center border transition-all duration-500",
                  selectedPayout.status === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : "bg-blue-500/10 border-blue-500/20 text-blue-500",
                )}
              >
                <Banknote className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black tracking-tight">
                  ₦{(selectedPayout.amount / 100).toLocaleString()}
                </p>
                <Badge
                  variant="secondary"
                  className={cn(
                    "font-black uppercase tracking-widest px-3 py-1",
                    selectedPayout.status === "success"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-blue-500/10 text-blue-500",
                  )}
                >
                  {selectedPayout.status === "pending_manual"
                    ? "PENDING"
                    : selectedPayout.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Transaction Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Reference
                </p>
                <p className="text-sm font-bold font-mono">
                  {selectedPayout.transfer_reference ||
                    `PAY-${selectedPayout.id.slice(0, 8).toUpperCase()}`}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Order ID
                </p>
                <p className="text-sm font-bold font-mono text-primary">
                  #{selectedPayout.order_id?.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Method
                </p>
                <p className="text-sm font-bold uppercase">
                  {selectedPayout.payout_type}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Currency
                </p>
                <p className="text-sm font-bold uppercase">
                  {selectedPayout.currency}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Initiated
                </p>
                <p className="text-sm font-bold italic">
                  {format(
                    new Date(selectedPayout.created_at),
                    "MMM dd, yyyy · hh:mm a",
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Paid Date
                </p>
                <p className="text-sm font-bold italic">
                  {selectedPayout.transferred_at
                    ? format(
                        new Date(selectedPayout.transferred_at),
                        "MMM dd, yyyy · hh:mm a",
                      )
                    : "Not yet transferred"}
                </p>
              </div>
            </div>

            {/* Escrow/Direct Info */}
            <div className="bg-muted/30 p-4 rounded-sm border border-border/40 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Payment Type
                </p>
                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border",
                    selectedPayout.escrow_id
                      ? "text-indigo-500 border-indigo-500/20"
                      : "text-emerald-500 border-emerald-500/20",
                  )}
                >
                  {selectedPayout.escrow_id
                    ? "Escrow Payment"
                    : "Direct Payment"}
                </span>
              </div>
              {selectedPayout.escrow && (
                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <p className="text-xs font-bold">Escrow Released At</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedPayout.escrow.released_at
                      ? format(
                          new Date(selectedPayout.escrow.released_at),
                          "MMM dd, hh:mm a",
                        )
                      : "N/A"}
                  </p>
                </div>
              )}
            </div>

            {/* Admin Notes */}
            {selectedPayout.admin_note && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> Admin Note
                </p>
                <p className="text-sm bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-sm border border-blue-100 dark:border-blue-900/20 italic text-blue-800 dark:text-blue-400">
                  &ldquo;{selectedPayout.admin_note}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
