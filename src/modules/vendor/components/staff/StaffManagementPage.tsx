import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, RefreshCw } from "lucide-react";
import { staffColumns } from "@/modules/vendor/columns/staffColumns";
import { InviteStaffModal } from "./InviteStaffModal";
import { StaffDetailModal } from "./StaffDetailModal";
import { useGetStaffListQuery } from "@/services/staffApi";

export function StaffManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const { data, isLoading } = useGetStaffListQuery({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Invite and manage your store staff</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite Staff
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => setPage(1)}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <DataTable
        columns={staffColumns}
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
        onRowClick={(row) => setSelectedStaffId(row.id)}
      />

      <InviteStaffModal open={inviteOpen} onOpenChange={setInviteOpen} />
      <StaffDetailModal
        staffId={selectedStaffId}
        open={!!selectedStaffId}
        onOpenChange={(open) => { if (!open) setSelectedStaffId(null); }}
      />
    </div>
  );
}
