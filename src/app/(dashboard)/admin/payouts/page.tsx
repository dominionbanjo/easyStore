"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  AlertCircle,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  useGetAdminPendingManualPayoutsQuery,
  useGetAdminAllPayoutsQuery,
  useGetAdminAllEscrowsQuery,
  useMarkAdminPayoutTransferredMutation,
  type IAdminPayout,
  type IAdminTransaction,
} from "@/services/adminApi";
import { DataTable } from "@/components/shared/DataTable";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/shared/Modal";
import { Textarea } from "@/components/ui/textarea";
import { extractErrorMessage } from "@/utils/errorHandler";
import { buildAdminPayoutColumns } from "@/modules/admin/components/payouts/AdminPayoutColumns";
import { buildAdminEscrowColumns } from "@/modules/admin/components/payouts/AdminEscrowColumns";
import { AdminTransactionDetailModal } from "@/modules/admin/components/transactions/AdminTransactionDetailModal";

export default function AdminPayoutsEscrowPage() {
  const [activeTab, setActiveTab] = useState("pending-manual");
  const [page, setPage] = useState(1);
  const [adminNote, setAdminNote] = useState("");
  const [selectedPayout, setSelectedPayout] = useState<IAdminPayout | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedSearch = useDebounce(search, 500);
  
  // For viewing transaction/order details from escrow/payout rows
  const [viewingTx, setViewingTx] = useState<IAdminTransaction | null>(null);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

  // Queries
  const {
    data: pendingManualData,
    isLoading: isPendingLoading,
    isFetching: isPendingFetching,
  } = useGetAdminPendingManualPayoutsQuery({ page, limit: 10 });

  const {
    data: allPayoutsData,
    isLoading: isAllPayoutsLoading,
    isFetching: isAllPayoutsFetching,
  } = useGetAdminAllPayoutsQuery({ 
    page, 
    limit: 10,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: debouncedSearch || undefined
  });

  const {
    data: allEscrowsData,
    isLoading: isEscrowsLoading,
    isFetching: isEscrowsFetching,
  } = useGetAdminAllEscrowsQuery({ 
    page, 
    limit: 10,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: debouncedSearch || undefined
  });

  const [markTransferred, { isLoading: isMarkingTransferred }] =
    useMarkAdminPayoutTransferredMutation();

  const handleMarkTransferred = async () => {
    if (!selectedPayout) return;
    try {
      await markTransferred({
        id: selectedPayout.id,
        admin_note: adminNote,
      }).unwrap();
      toast.success("Payout marked as transferred successfully");
      setSelectedPayout(null);
      setAdminNote("");
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to update payout status"));
    }
  };

  // Data mapping from paginated response
  const pendingPayouts = pendingManualData?.data?.items ?? [];
  const allPayouts = allPayoutsData?.data?.items ?? [];
  const escrows = allEscrowsData?.data?.items ?? [];

  const pendingPagination = pendingManualData?.data?.pagination;
  const allPayoutsPagination = allPayoutsData?.data?.pagination;
  const escrowsPagination = allEscrowsData?.data?.pagination;

  // Columns
  const pendingColumns = useMemo(
    () => buildAdminPayoutColumns((p) => setSelectedPayout(p), false),
    []
  );
  const historyColumns = useMemo(() => buildAdminPayoutColumns(undefined, true), []);
  const escrowColumns = useMemo(() => buildAdminEscrowColumns(), []);

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
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      <Tabs
        defaultValue="pending-manual"
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v);
          setPage(1);
          setSearch("");
          setStatusFilter("all");
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-muted/30 border border-border/20 rounded-sm">
          <TabsTrigger
            value="pending-manual"
            className="rounded-sm font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            Pending Transfers
            {pendingPagination && pendingPagination.total > 0 && (
              <Badge className="ml-2 bg-rose-500 text-white text-[9px] px-1.5 h-4 min-w-4 flex items-center justify-center border-none">
                {pendingPagination.total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="all-payouts"
            className="rounded-sm font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            Payout History
          </TabsTrigger>
          <TabsTrigger
            value="escrows"
            className="rounded-sm font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            Escrow Tracker
          </TabsTrigger>
        </TabsList>

        {/* Shared Filters for History/Escrow */}
        <div className="flex flex-col md:flex-row gap-4 my-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === "pending-manual" ? "Search manual payouts..." : activeTab === "all-payouts" ? "Search by Payout ID, Vendor, or Reference..." : "Search by Order ID, Buyer, or Store..."}
              className="pl-10 h-11 border-border/40 rounded-sm bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {activeTab !== "pending-manual" && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {["all", "pending", "funded", "released", "completed", "failed"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={cn(
                    "px-4 h-11 rounded-sm text-[10px] font-black uppercase tracking-widest border transition-all shrink-0",
                    statusFilter === s
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-background text-muted-foreground border-border/40 hover:border-primary/50"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-0">
          <TabsContent value="pending-manual" className="m-0">
            <Card className="border-border/30 rounded-sm bg-background/60 backdrop-blur-md overflow-hidden">
              <CardContent className="p-0">
                <DataTable
                  columns={pendingColumns}
                  data={pendingPayouts}
                  isLoading={isPendingLoading || isPendingFetching}
                  pagination={createPaginationState(pendingPagination)}
                  emptyMessage="No pending manual transfers found."
                  onRowClick={(row) => {
                    setSelectedPayout(row);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all-payouts" className="m-0">
            <Card className="border-border/30 rounded-sm bg-background/60 backdrop-blur-md overflow-hidden">
              <CardContent className="p-0">
                <DataTable
                  columns={historyColumns}
                  data={allPayouts}
                  isLoading={isAllPayoutsLoading || isAllPayoutsFetching}
                  pagination={createPaginationState(allPayoutsPagination)}
                  emptyMessage="No payout history records found."
                  onRowClick={(row) => {
                    if (row.metadata?.transaction) {
                        setViewingTx(row.metadata.transaction);
                        setIsTxModalOpen(true);
                    }
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="escrows" className="m-0">
            <Card className="border-border/30 rounded-sm bg-background/60 backdrop-blur-md overflow-hidden">
              <CardContent className="p-0">
                <DataTable
                  columns={escrowColumns}
                  data={escrows}
                  isLoading={isEscrowsLoading || isEscrowsFetching}
                  pagination={createPaginationState(escrowsPagination)}
                  emptyMessage="No escrow records found."
                  onRowClick={(row) => {
                    const targetId = row.order_id || row.id;
                    if (targetId) {
                        const tx: IAdminTransaction = {
                            id: targetId,
                            order_id: null,
                            escrow_id: null,
                            user_id: null,
                            vendor_id: null,
                            reference: null,
                            amount: row.amount,
                            currency: "NGN",
                            status: row.status,
                            type: "escrow",
                            created_at: row.created_at,
                            updated_at: row.created_at,
                            user: row.buyer,
                            vendor: row.vendor,
                            description: `Escrow Fund for Order ${targetId.substring(0, 8)}`,
                        };
                        setViewingTx(tx);
                        setIsTxModalOpen(true);
                    }
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Mark Transferred Modal (Shared Component) */}
      <Modal
        open={!!selectedPayout}
        onOpenChange={(open) => !open && setSelectedPayout(null)}
        title="Confirm Bank Transfer"
        description={`Confirm manual sum transfer of ₦${(
          (selectedPayout?.amount_kobo ?? 0) / 100
        ).toLocaleString()} to the vendor.`}
        className="sm:max-w-[500px]"
        footer={
          <div className="flex p-4 gap-3">
            <Button
              variant="ghost"
              onClick={() => setSelectedPayout(null)}
              className="flex-1 font-black uppercase text-[10px] tracking-widest h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleMarkTransferred}
              isLoading={isMarkingTransferred}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-black uppercase text-[10px] tracking-widest h-12"
            >
              Confirm & Mark Paid
            </Button>
          </div>
        }
      >
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-sm bg-muted/50 border border-border/30 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Vendor Bank Details
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Name:</span>
                <span className="font-bold uppercase tracking-tight">
                  {selectedPayout?.vendor_bank?.account_name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Number:</span>
                <span className="font-bold text-primary tracking-widest">
                  {selectedPayout?.vendor_bank?.account_number}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bank Name:</span>
                <span className="font-bold uppercase tracking-tight">
                  {selectedPayout?.vendor_bank?.bank_name}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Transfer Reference / Admin Note
            </label>
            <Textarea
              placeholder="Enter bank transfer reference or any notes for internal records..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="rounded-sm border-border/40 min-h-[100px] focus:ring-primary/20 text-sm"
            />
          </div>

          <div className="flex items-start gap-3 p-3 rounded-sm bg-rose-500/5 border border-rose-500/10">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-rose-700/80 font-bold uppercase tracking-wide leading-relaxed">
              CRITICAL: Ensure the transfer is successful on your banking app
              before marking this as paid. This action is irreversible.
            </p>
          </div>
        </div>
      </Modal>

      {/* Transaction Detail Modal for Escrow/History viewing */}
      <AdminTransactionDetailModal
        transaction={viewingTx}
        open={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setViewingTx(null);
        }}
      />
    </section>
  );
}
