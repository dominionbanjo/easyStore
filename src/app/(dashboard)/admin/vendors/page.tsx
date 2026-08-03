import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Store } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAdminVendorsQuery } from "@/services/adminApi";
import { buildAdminVendorColumns } from "@/modules/admin/components/vendors/AdminVendorColumns";
import { AdminUserDetailModal } from "@/modules/admin/components/shared/AdminUserDetailModal";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "active" | "pending" | "restricted" | "banned";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Approved" },
  { key: "pending", label: "Pending" },
  { key: "restricted", label: "Restricted" },
  { key: "banned", label: "Banned" },
];

export default function SuperAdminVendorsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 350);

  const { data, isLoading, isFetching } = useGetAdminVendorsQuery({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const vendors = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;

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

  const columns = useMemo(
    () => buildAdminVendorColumns((id) => setSelectedUserId(id)),
    [],
  );

  return (
    <section className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        {pagination && (
          <Badge variant="secondary" className="text-sm px-3 py-1.5 gap-1.5 w-fit">
            <Store className="h-3.5 w-3.5" />
            {pagination.total.toLocaleString()} vendors
          </Badge>
        )}
      </div>

      {/* ── Search + Status Filters ── */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
          <Input
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-10 "
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide -mx-2 px-2 lg:mx-0 lg:px-0">
          {STATUS_TABS.map(({ key, label }) => (
            <Button
              key={key}
              variant={statusFilter === key ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-8 sm:h-9 px-4 rounded-sm text-xs sm:text-[13px] font-bold shrink-0 transition-all",
                statusFilter === key && " ",
              )}
              onClick={() => {
                setStatusFilter(key);
                setPage(1);
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <Card className="border border-border/40   rounded-sm overflow-hidden">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <CardTitle className="text-lg font-black">Vendors Overview</CardTitle>
          <CardDescription className="text-xs">
            Manage vendor lifecycle and store visibility.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={vendors}
            isLoading={isLoading || isFetching}
            pagination={paginationState}
            emptyMessage="No vendors match your current filters."
          />
        </CardContent>
      </Card>

      {/* ── Detail Modal ── */}
      <AdminUserDetailModal
        userId={selectedUserId}
        open={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        mode="vendor"
      />
    </section>
  );
}
