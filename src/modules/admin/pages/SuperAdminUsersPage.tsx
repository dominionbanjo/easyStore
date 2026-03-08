import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
import { Search, Users } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAdminUsersQuery } from "@/services/adminApi";
import { buildAdminUserColumns } from "../components/users/AdminUserColumns";
import { AdminUserDetailModal } from "../components/shared/AdminUserDetailModal";
import { useDebounce } from "@/hooks";

type StatusFilter = "all" | "active" | "pending" | "restricted" | "banned";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "restricted", label: "Restricted" },
  { key: "banned", label: "Banned" },
];

export default function SuperAdminUsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 350);

  const { data, isLoading, isFetching } = useGetAdminUsersQuery({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const users = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;

  const paginationState = pagination
    ? {
        page: Number(pagination.page),
        pages: Number(pagination.pages),
        hasNext: pagination.hasNext,
        hasPrev: pagination.hasPrev,
        onPageChange: (p: number) => setPage(p),
      }
    : undefined;

  const columns = useMemo(
    () => buildAdminUserColumns((id) => setSelectedUserId(id)),
    [],
  );

  return (
    <section className="space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Users Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor all registered users, review their activity, and manage
            account access.
          </p>
        </div>

        {pagination && (
          <Badge variant="secondary" className="text-sm px-3 py-1.5 gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {pagination.total.toLocaleString()} total
          </Badge>
        )}
      </motion.div>

      {/* ── Search + Status Filters ── */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-col sm:flex-row sm:items-center gap-3"
      >
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {STATUS_TABS.map(({ key, label }) => (
            <Button
              key={key}
              variant={statusFilter === key ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setStatusFilter(key);
                setPage(1);
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* ── Table ── */}
      <Card className="border border-border/40 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Users Overview</CardTitle>
          <CardDescription>
            Manage account lifecycle, verify identities, and control platform
            access.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:px-6 sm:pb-6">
          <DataTable
            columns={columns}
            data={users}
            isLoading={isLoading || isFetching}
            pagination={paginationState}
            emptyMessage="No users match your current filters."
          />
        </CardContent>
      </Card>

      {/* ── Detail Modal ── */}
      <AdminUserDetailModal
        userId={selectedUserId}
        open={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        mode="user"
      />
    </section>
  );
}
