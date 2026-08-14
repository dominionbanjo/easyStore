import { useState } from "react";
import { Loader2, RefreshCw, Filter, ChevronDown, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { DataTable } from "@/components/shared/DataTable";
import { createInstallmentPlanColumns } from "@/modules/admin/columns/installmentColumns";
import {
  useGetVendorInstallmentPlansQuery,
} from "@/services/installmentsApi";
import type { InstallmentPlanView } from "@/types/installment/installmentTypes";
import { VendorInstallmentDetailsModal } from "@/modules/vendor/components/installments/VendorInstallmentDetailsModal";

const PAGE_SIZE = 10;

const statusOptions = [
  { value: undefined, label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "defaulted", label: "Defaulted" },
  { value: "canceled", label: "Canceled" },
  { value: "refunding", label: "Refunding" },
];

export default function VendorInstallmentsPage() {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetVendorInstallmentPlansQuery({
      page,
      limit: PAGE_SIZE,
      status: status ?? undefined,
    });

  const handleViewDetails = (plan: InstallmentPlanView) => {
    setSelectedPlanId(plan.id);
    setIsModalOpen(true);
  };

  const columns = createInstallmentPlanColumns(handleViewDetails);

  const plans = data?.data ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isFiltered = status !== undefined;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={status !== undefined ? "secondary" : "outline"}
              className="gap-2 h-9 border-dashed rounded-sm text-[10px] font-black uppercase tracking-widest"
            >
              <Filter className="h-3.5 w-3.5" />
              {statusOptions.find((s) => s.value === status)?.label}
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-1.5 rounded-sm border-border/40" align="end">
            <div className="space-y-1">
              {statusOptions.map((option) => (
                <Button
                  key={option.label}
                  variant={status === option.value ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-[10px] font-black uppercase tracking-widest"
                  onClick={() => {
                    setStatus(option.value);
                    setPage(1);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 h-9 rounded-sm text-[10px] font-black uppercase tracking-widest"
            onClick={() => {
              setStatus(undefined);
              setPage(1);
            }}
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="h-9 rounded-sm text-[10px] font-black uppercase tracking-widest"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <Card className="rounded-sm border-border/40">
        <CardContent className="p-0">
          {isError ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
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
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={plans}
              isLoading={isLoading || isFetching}
              emptyMessage={
                isFiltered
                  ? "No installment plans match this status"
                  : "No installment plans yet. Buyers can pay for your installment-enabled products over time."
              }
              pagination={
                pages > 1
                  ? {
                      page,
                      pages,
                      limit: PAGE_SIZE,
                      hasNext: page < pages,
                      hasPrev: page > 1,
                      onPageChange: setPage,
                    }
                  : undefined
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <VendorInstallmentDetailsModal
        planId={selectedPlanId}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedPlanId(null);
        }}
      />
    </div>
  );
}
