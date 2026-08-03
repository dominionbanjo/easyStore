import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Search, Eye, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
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
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAdminZonesQuery, useGetAdminZoneStatsQuery } from "@/services/schoolZoneApi";
import { useDebounce } from "@/hooks";
import { NigeriaData } from "@/utils/nigeria-data";
import { areSubdomainsDisabled } from "@/utils/subdomain";
import { cn } from "@/lib/utils";
import type {
  ISchoolZoneAdminItem,
  SchoolZoneStatus,
} from "@/types/SchoolZone/schoolZoneTypes";

type StatusFilter = "all" | SchoolZoneStatus;

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "active", label: "Active" },
  { key: "rejected", label: "Rejected" },
];

const statusBadge = (status: SchoolZoneStatus) => {
  switch (status) {
    case "active":
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Active</Badge>;
    case "pending":
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Pending</Badge>;
    case "rejected":
      return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">Rejected</Badge>;
    case "restricted":
      return <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">Restricted</Badge>;
    case "banned":
      return <Badge className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20">Banned</Badge>;
    default:
      return null;
  }
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  isLoading,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  isLoading?: boolean;
}) {
  return (
    <Card className="border-border/30 hover:transition-all duration-300 bg-gradient-to-br from-background to-muted/20 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-4 pt-4 sm:px-6 sm:pt-6">
        <CardTitle className="text-[11px] sm:text-[13px] font-bold text-muted-foreground uppercase tracking-wider truncate mr-2">
          {title}
        </CardTitle>
        <div className={cn("p-1.5 sm:p-2 rounded-sm flex-shrink-0", iconColor)}>
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl sm:text-3xl font-black tracking-tight truncate">
              {value}
            </div>
            <p className="text-[10px] sm:text-xs mt-1 sm:mt-1.5 font-bold text-muted-foreground truncate">
              {subtitle}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function SuperAdminSchoolZonesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 350);

  const adminPathPrefix = areSubdomainsDisabled() ? "/admin" : "";
  const zoneDetailPath = useCallback(
    (zoneId: string) => `${adminPathPrefix}/school-zones/${zoneId}`,
    [adminPathPrefix]
  );

  const { data, isLoading, isFetching } = useGetAdminZonesQuery({
    page,
    limit: 20,
    q: debouncedSearch || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const { data: statsData, isLoading: isLoadingStats } =
    useGetAdminZoneStatsQuery();

  const zones = data?.data.items ?? [];
  const pagination = data?.data.pagination;
  const stats = statsData?.data;

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

  const metrics = [
    {
      title: "Total Zones",
      value: stats ? stats.total.toLocaleString() : "—",
      subtitle: `${stats?.active_members ?? 0} active members`,
      icon: GraduationCap,
      iconColor:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
    },
    {
      title: "Pending",
      value: stats ? stats.pending.toLocaleString() : "—",
      subtitle: "Awaiting review",
      icon: AlertTriangle,
      iconColor:
        "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    },
    {
      title: "Active",
      value: stats ? stats.active.toLocaleString() : "—",
      subtitle: "Live zones",
      icon: CheckCircle2,
      iconColor:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    },
    {
      title: "Rejected",
      value: stats ? stats.rejected.toLocaleString() : "—",
      subtitle: "Declined requests",
      icon: XCircle,
      iconColor:
        "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    },
  ];

  const columns = useMemo<ColumnDef<ISchoolZoneAdminItem>[]>(
    () => [
      {
        header: "Zone",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">{row.original.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {row.original.subdomain} · {row.original.slug}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: "Location",
        accessorKey: "location",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {[
              row.original.location,
              NigeriaData.getStateByCode(row.original.state)?.name ??
                row.original.state,
            ]
              .filter(Boolean)
              .join(", ") || "—"}
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) =>
          statusBadge(row.original.status),
      },
      {
        header: "Requested",
        accessorKey: "created_at",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.created_at
              ? new Date(row.original.created_at).toLocaleDateString()
              : "—"}
          </span>
        ),
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => navigate(zoneDetailPath(row.original.id))}
          >
            <Eye className="h-4 w-4" />
            Details
          </Button>
        ),
      },
    ],
    [navigate, zoneDetailPath]
  );

  return (
    <section className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        {pagination && (
          <Badge variant="secondary" className="text-sm px-3 py-1.5 gap-1.5 w-fit">
            <GraduationCap className="h-3.5 w-3.5" />
            {pagination.total.toLocaleString()} total
          </Badge>
        )}
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((stat, i) => (
          <StatCard key={i} {...stat} isLoading={isLoadingStats} />
        ))}
      </div>

      {/* ── Search + Status Filters ── */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
          <Input
            placeholder="Search zones..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-10"
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
      <Card className="border border-border/40 rounded-sm overflow-hidden">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <CardTitle className="text-lg font-black">School Zone Requests</CardTitle>
          <CardDescription className="text-xs">
            Review and approve school zone creation requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={zones}
            isLoading={isLoading || isFetching}
            onRowClick={(row) => navigate(zoneDetailPath(row.id))}
            pagination={paginationState}
            emptyMessage={
              statusFilter === "pending"
                ? "No pending requests to review."
                : "No school zones match your filters."
            }
          />
        </CardContent>
      </Card>
    </section>
  );
}
