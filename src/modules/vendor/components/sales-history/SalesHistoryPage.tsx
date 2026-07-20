import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, X } from "lucide-react";
import { salesHistoryColumns } from "@/modules/vendor/columns/salesHistoryColumns";
import { useGetSalesHistoryQuery } from "@/services/salesHistoryApi";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { SalesReceiptModal } from "./SalesReceiptModal";

export function SalesHistoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ dateFrom?: string; dateTo?: string }>({});

  const { data, isLoading } = useGetSalesHistoryQuery({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    dateFrom: dateRange.dateFrom,
    dateTo: dateRange.dateTo,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  };

  const clearFilters = () => {
    setDateRange({});
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  const hasFilters = dateRange.dateFrom || dateRange.dateTo || debouncedSearch;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales History</h1>
          <p className="text-muted-foreground">Record of all offline sales</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or notes..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <div className="flex gap-2">
          {hasFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={() => setPage(1)}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DataTable
        columns={salesHistoryColumns}
        data={data?.data ?? []}
        isLoading={isLoading}
        pagination={
          data?.pagination
            ? {
                page: data.pagination.page,
                pages: data.pagination.pages,
                hasNext: data.pagination.hasNext,
                hasPrev: data.pagination.hasPrev,
                onPageChange: setPage,
              }
            : undefined
        }
        onRowClick={(row) => setSelectedOrderId(row.id)}
      />

      <SalesReceiptModal
        orderId={selectedOrderId}
        open={!!selectedOrderId}
        onOpenChange={(open) => { if (!open) setSelectedOrderId(null); }}
      />
    </div>
  );
}
