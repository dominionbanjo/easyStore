import { useMemo, useState } from "react";
import { toast } from "sonner";
import { GraduationCap, Check, X, Search } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminZonesQuery, useDecideZoneMutation } from "@/services/schoolZoneApi";
import { useDebounce } from "@/hooks";
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
    default:
      return null;
  }
};

export default function SuperAdminSchoolZonesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [actionTarget, setActionTarget] = useState<{
    zone: ISchoolZoneAdminItem;
    decision: "approve" | "reject";
  } | null>(null);

  const debouncedSearch = useDebounce(search, 350);

  const { data, isLoading, isFetching } = useGetAdminZonesQuery({
    page,
    limit: 20,
    q: debouncedSearch || undefined,
  });
  const [decideZone, { isLoading: isDeciding }] = useDecideZoneMutation();

  const filtered = useMemo(() => {
    const list =
      statusFilter === "all"
        ? (data?.data.items ?? [])
        : (data?.data.items ?? []).filter((z) => z.status === statusFilter);
    return list;
  }, [data, statusFilter]);

  const pagination = data?.data.pagination;

  const handleDecision = async () => {
    if (!actionTarget) return;
    try {
      await decideZone({
        zoneId: actionTarget.zone.id,
        decision: actionTarget.decision,
        reason:
          actionTarget.decision === "reject"
            ? "Zone request rejected by platform admin"
            : undefined,
      }).unwrap();
      toast.success(
        actionTarget.decision === "approve"
          ? `${actionTarget.zone.name} approved and is now live`
          : `${actionTarget.zone.name} rejected`
      );
      setActionTarget(null);
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "data" in err
          ? String((err as { data: { message?: string } }).data?.message ?? "Failed to update zone")
          : "Failed to update zone";
      toast.error(message);
    }
  };

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
            {[row.original.location, row.original.state].filter(Boolean).join(", ") || "—"}
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
          <div className="flex items-center gap-2">
            {row.original.status === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
                  onClick={() =>
                    setActionTarget({ zone: row.original, decision: "reject" })
                  }
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() =>
                    setActionTarget({ zone: row.original, decision: "approve" })
                  }
                >
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
            {row.original.status !== "pending" && (
              <span className="text-xs text-muted-foreground">
                {row.original.rejection_reason ? "Rejected" : "No action"}
              </span>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-primary" />
          School Zones
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          Review and approve school zone creation requests.
        </p>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-secondary/30 rounded-sm p-1 w-fit">
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setStatusFilter(t.key)}
              className={cn(
                "px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all",
                statusFilter === t.key
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search zones..."
            className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-border/60 bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-base">Zone Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || isFetching ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-sm" />
              ))}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filtered}
              pagination={
                pagination
                  ? {
                      page: Number(pagination.page),
                      pages: Number(pagination.pages),
                      limit: 20,
                      hasNext: pagination.hasNext,
                      hasPrev: pagination.hasPrev,
                      onPageChange: (p: number) => setPage(p),
                    }
                  : undefined
              }
              emptyMessage={
                statusFilter === "pending"
                  ? "No pending requests to review."
                  : "No school zones found."
              }
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(actionTarget)}
        onOpenChange={(open) => {
          if (!open) setActionTarget(null);
        }}
        title={
          actionTarget?.decision === "approve"
            ? "Approve this school zone?"
            : "Reject this school zone?"
        }
        description={
          actionTarget?.decision === "approve"
            ? `${actionTarget?.zone.name} will go live immediately and the requester becomes the school rep.`
            : `${actionTarget?.zone.name} will be rejected and the requester notified.`
        }
        confirmText={
          actionTarget?.decision === "approve" ? "Approve Zone" : "Reject Zone"
        }
        variant={actionTarget?.decision === "reject" ? "destructive" : "default"}
        isLoading={isDeciding}
        onConfirm={handleDecision}
      />
    </div>
  );
}
