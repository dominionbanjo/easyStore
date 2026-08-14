import { useState } from "react";
import { Loader2, RefreshCw, Wallet } from "lucide-react";
import { useGetMyInstallmentPlansQuery } from "@/services/installmentsApi";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { InstallmentPlanListItem } from "@/modules/website/components/installments/InstallmentPlanListItem";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const statusOptions = [
  { value: undefined, label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "defaulted", label: "Defaulted" },
  { value: "canceled", label: "Canceled" },
  { value: "refunding", label: "Refunding" },
];

export default function InstallmentsPage() {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } =
    useGetMyInstallmentPlansQuery({
      page,
      limit: PAGE_SIZE,
      status: status ?? undefined,
    });

  const plans = data?.data ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/20 transition-colors duration-300">
      <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                Buy Now · Pay Later
              </p>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                My Installments
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                {isLoading
                  ? "Loading your plans…"
                  : total > 0
                    ? `${total} installment plan${total === 1 ? "" : "s"}`
                    : "Track and manage your installment plans"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="h-9 rounded-sm text-[10px] font-black uppercase tracking-widest self-start sm:self-auto"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1 pb-1">
            {statusOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => {
                  setStatus(option.value);
                  setPage(1);
                }}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest border transition-all",
                  status === option.value
                    ? "bg-primary text-white border-primary"
                    : "bg-card border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="relative pt-1">
            {isFetching && plans.length > 0 && (
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-emerald-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-sm border border-emerald-500/20 shadow-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Fetching Data...
                </div>
              </div>
            )}

            {isError ? (
              <div className="bg-card/50 backdrop-blur-sm rounded-sm border border-red-500/20 p-10 text-center space-y-3">
                <p className="text-sm font-bold text-rose-500">
                  Failed to load installment plans
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="h-9 rounded-sm text-[10px] font-black uppercase tracking-widest"
                >
                  Try Again
                </Button>
              </div>
            ) : isLoading ? (
              <div className="space-y-3 sm:space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-5 rounded-sm border border-border/40 bg-card/50 animate-pulse space-y-3"
                  >
                    <div className="h-3 w-1/3 bg-muted rounded-sm" />
                    <div className="h-2 w-full bg-muted rounded-sm" />
                    <div className="h-2 w-2/3 bg-muted rounded-sm" />
                  </div>
                ))}
              </div>
            ) : plans.length > 0 ? (
              <>
                <div className="space-y-3 sm:space-y-4">
                  {plans.map((plan) => (
                    <InstallmentPlanListItem key={plan.id} plan={plan} />
                  ))}
                </div>

                {pages > 1 && (
                  <div className="flex justify-center mt-10 pt-8 border-t border-border/40">
                    <Pagination
                      page={page}
                      pages={pages}
                      hasNext={page < pages}
                      hasPrev={page > 1}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-card/50 backdrop-blur-sm rounded-sm border border-border/40 p-12 text-center space-y-3">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-sm flex items-center justify-center mx-auto">
                  <Wallet className="h-7 w-7" />
                </div>
                <h2 className="text-lg font-black text-foreground">
                  No installment plans
                </h2>
                <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">
                  {status
                    ? "No plans match this status filter."
                    : "When you buy an installment-enabled product, your payment plan shows up here."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
