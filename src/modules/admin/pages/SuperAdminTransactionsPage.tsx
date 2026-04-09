import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download } from "lucide-react";
import { useDebounce } from "@/hooks";
import {
  useGetAdminTransactionsQuery,
  useFlagAdminTransactionMutation,
  type IAdminTransaction,
} from "@/services/adminApi";
import { DataTable } from "@/components/shared/DataTable";
import { buildAdminTransactionColumns } from "../components/transactions/AdminTransactionColumns";
import { cn } from "@/lib/utils";
import { AdminTransactionDetailModal } from "../components/transactions/AdminTransactionDetailModal";
import { ConfirmActionDialog } from "../components/shared/ConfirmActionDialog";
import { toast } from "sonner";

export default function SuperAdminTransactionsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter] = useState("all");

  // Transaction States
  const [selectedTx, setSelectedTx] = useState<IAdminTransaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    tx: IAdminTransaction;
    type: "flag";
  } | null>(null);

  const { data, isLoading, isFetching } = useGetAdminTransactionsQuery({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
  });

  const transactions = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;

  const handleViewDetails = (tx: IAdminTransaction) => {
    setSelectedTx(tx);
    setIsDetailModalOpen(true);
  };

  const [flagTransaction, { isLoading: isFlagging }] =
    useFlagAdminTransactionMutation();

  const handleActionClick = (tx: IAdminTransaction, type: "flag") => {
    setPendingAction({ tx, type });
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    try {
      await flagTransaction({ transactionId: pendingAction.tx.id }).unwrap();
      toast.success("Transaction flagged for review");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to flag transaction");
    } finally {
      setPendingAction(null);
    }
  };

  const columns = useMemo(
    () => buildAdminTransactionColumns(handleViewDetails, handleActionClick),
    [],
  );

  const paginationState = pagination
    ? {
        page: Number(pagination.page),
        pages: Number(pagination.pages),
        limit: 20,
        hasNext: pagination.hasNext,
        hasPrev: pagination.hasPrev,
        onPageChange: (p: number) => setPage(p),
      }
    : undefined;

  return (
    <section className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground/90">
            Transactions
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Complete platform oversight of financial flows, refunds, and vendor
            payouts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            variant="outline"
            className="gap-2 h-9 sm:h-10 border-border/40 font-bold bg-background  text-xs sm:text-sm"
          >
            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Filters
          </Button>
          <Button className="gap-2 h-9 sm:h-10 bg-primary font-bold   text-xs sm:text-sm">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Export
          </Button>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-sm bg-muted/20 border border-border/30 backdrop-blur-sm"
      >
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 h-10 sm:h-11 bg-background border-border/50 focus:border-primary/50 transition-all rounded-sm  text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide -mx-2 px-2 lg:mx-0 lg:px-0">
          {(["all", "success", "pending", "failed", "reversed"] as const).map(
            (key) => (
              <Button
                key={key}
                variant={statusFilter === key ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 sm:h-9 px-4 sm:px-5 rounded-sm text-[12px] sm:text-[13px] font-bold transition-all shrink-0",
                  statusFilter === key
                    ? "  scale-[1.02]"
                    : "border-border/30 bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
                onClick={() => {
                  setStatusFilter(key);
                  setPage(1);
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Button>
            ),
          )}
        </div>
      </motion.div>

      {/* Transactions Table */}
      <Card className="border-border/30   overflow-hidden rounded-sm bg-background/60 backdrop-blur-md">
        <CardHeader className="bg-muted/10 pb-4 border-b border-border/20 px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-black text-foreground/80">
                Transaction History
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Showing {pagination?.total || 0} financial records found across
                the platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={transactions}
            isLoading={isLoading || isFetching}
            pagination={paginationState}
            emptyMessage="Zero transactions matched your current filters"
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <AdminTransactionDetailModal
        transaction={selectedTx}
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <ConfirmActionDialog
        open={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirmAction}
        isLoading={isFlagging}
        title="Flag Transaction"
        description={`This will mark transaction ${pendingAction?.tx.id.substring(0, 8).toUpperCase()} for manual review by the compliance team.`}
        confirmLabel="Flag for Review"
        confirmVariant="default"
      />
    </section>
  );
}
