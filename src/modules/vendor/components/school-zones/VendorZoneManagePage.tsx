import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  GraduationCap,
  Store,
  Eye,
  Ban,
  RefreshCcw,
  Trash2,
  ArrowLeft,
  Check,
  MapPin,
  Calendar,
  ShieldCheck,
  ExternalLink,
  Package,
  MoreVertical,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Pagination } from "@/components/shared/Pagination";
import { NigeriaData } from "@/utils/nigeria-data";
import { getAppPath } from "@/utils/subdomain";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  useGetMyRepZonesQuery,
  useGetZoneMembersQuery,
  useSuspendMemberMutation,
  useUnsuspendMemberMutation,
  useRemoveZoneMemberMutation,
} from "@/services/schoolZoneApi";
import type {
  ZoneMemberStatus,
  IZoneMember,
} from "@/types/SchoolZone/schoolZoneTypes";
import ZoneMemberDetailModal from "@/modules/vendor/components/modals/ZoneMemberDetailModal";

type Tab = "overview" | "applications" | "vendors";

const VALID_TABS: Tab[] = ["overview", "applications", "vendors"];

const MEMBER_STATUS_TABS: { key: "all" | ZoneMemberStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "suspended", label: "Suspended" },
  { key: "rejected", label: "Rejected" },
];

const memberStatusBadge = (status: ZoneMemberStatus) => {
  switch (status) {
    case "active":
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Active</Badge>;
    case "pending":
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Pending</Badge>;
    case "rejected":
      return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">Rejected</Badge>;
    case "suspended":
      return <Badge className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20">Suspended</Badge>;
    default:
      return null;
  }
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-2.5">
    <div className="mt-0.5 p-1.5 rounded-sm bg-muted/60 flex-shrink-0">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm text-foreground font-medium mt-0.5 truncate">
        {value ?? (
          <span className="text-muted-foreground text-xs">Not provided</span>
        )}
      </p>
    </div>
  </div>
);

export default function VendorZoneManagePage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const tab: Tab = VALID_TABS.includes(tabParam as Tab)
    ? (tabParam as Tab)
    : "overview";

  const [memberStatus, setMemberStatus] = useState<"all" | ZoneMemberStatus>("all");
  const [memberPage, setMemberPage] = useState(1);
  const [memberSearch, setMemberSearch] = useState("");
  const debouncedMemberSearch = useDebounce(memberSearch, 350);
  const [reviewTarget, setReviewTarget] = useState<IZoneMember | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<IZoneMember | null>(null);
  const [removeTarget, setRemoveTarget] = useState<IZoneMember | null>(null);

  const { data: repZonesData, isLoading: isLoadingRep } = useGetMyRepZonesQuery();

  const zone = repZonesData?.data.find((z) => z.id === id) ?? null;
  const isManager = Boolean(zone);

  const { data: membersData, isLoading: isLoadingMembers } =
    useGetZoneMembersQuery(
      {
        zoneId: id,
        page: memberPage,
        limit: 20,
        q: debouncedMemberSearch || undefined,
        status: memberStatus === "all" ? undefined : memberStatus,
      },
      { skip: !isManager || !id || tab !== "vendors" }
    );

  const { data: pendingData, isLoading: isLoadingPending } =
    useGetZoneMembersQuery(
      { zoneId: id, status: "pending", page: 1, limit: 50 },
      { skip: !isManager || !id || tab !== "applications" }
    );

  const [suspendMember, { isLoading: isSuspending }] = useSuspendMemberMutation();
  const [unsuspendMember, { isLoading: isUnsuspending }] =
    useUnsuspendMemberMutation();
  const [removeZoneMember, { isLoading: isRemoving }] =
    useRemoveZoneMemberMutation();

  const members = membersData?.data.items ?? [];
  const membersPagination = membersData?.data.pagination;
  const pendingMembers = pendingData?.data.items ?? [];

  const setTab = (next: Tab) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", next);
    setSearchParams(nextParams);
  };

  const handleSuspend = async () => {
    if (!suspendTarget) return;
    try {
      await suspendMember({ zoneId: id, memberId: suspendTarget.id }).unwrap();
      toast.success(`${suspendTarget.store_name} suspended from the zone`);
      setSuspendTarget(null);
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "data" in err
          ? String(
              (err as { data: { message?: string } }).data?.message ??
                "Failed to suspend vendor"
            )
          : "Failed to suspend vendor";
      toast.error(message);
    }
  };

  const handleUnsuspend = useCallback(
    async (member: IZoneMember) => {
      try {
        await unsuspendMember({ zoneId: id, memberId: member.id }).unwrap();
        toast.success(`${member.store_name} restored to the zone`);
      } catch (err) {
        const message =
          typeof err === "object" && err !== null && "data" in err
            ? String(
                (err as { data: { message?: string } }).data?.message ??
                  "Failed to restore vendor"
              )
            : "Failed to restore vendor";
        toast.error(message);
      }
    },
    [id, unsuspendMember]
  );

  const handleRemove = async () => {
    if (!removeTarget) return;
    try {
      await removeZoneMember({ zoneId: id, memberId: removeTarget.id }).unwrap();
      toast.success(`${removeTarget.store_name} removed from the zone`);
      setRemoveTarget(null);
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "data" in err
          ? String(
              (err as { data: { message?: string } }).data?.message ??
                "Failed to remove vendor"
            )
          : "Failed to remove vendor";
      toast.error(message);
    }
  };

  const memberColumns = useMemo<ColumnDef<IZoneMember>[]>(
    () => [
      {
        header: "Vendor",
        accessorKey: "store_name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-sm bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
              {row.original.store_logo ? (
                <img
                  src={row.original.store_logo}
                  alt={row.original.store_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Store className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">
                {row.original.store_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                @{row.original.store_slug}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: "School Info",
        accessorKey: "department",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {[row.original.department, row.original.course]
              .filter(Boolean)
              .join(" · ") || "—"}
          </span>
        ),
      },
      {
        header: "Student ID",
        accessorKey: "student_id_number",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.student_id_number || "—"}
          </span>
        ),
      },
      {
        header: "Delivery Fee",
        accessorKey: "delivery_fee",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-foreground">
            ₦{row.original.delivery_fee ?? 0}
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => memberStatusBadge(row.original.status),
      },
      {
        header: () => <div className="text-right">Actions</div>,
        accessorKey: "actions",
        cell: ({ row }) => (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Vendor actions">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Vendor Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => setReviewTarget(row.original)}
                >
                  <Eye className="h-4 w-4 text-blue-500" />
                  View Details
                </DropdownMenuItem>
                {row.original.status === "active" && (
                  <DropdownMenuItem
                    className="gap-2 text-amber-600"
                    disabled={isSuspending}
                    onClick={() => setSuspendTarget(row.original)}
                  >
                    <Ban className="h-4 w-4" />
                    Suspend
                  </DropdownMenuItem>
                )}
                {row.original.status === "suspended" && (
                  <DropdownMenuItem
                    className="gap-2"
                    disabled={isUnsuspending}
                    onClick={() => handleUnsuspend(row.original)}
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Restore
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="gap-2 text-red-600"
                  disabled={isRemoving}
                  onClick={() => setRemoveTarget(row.original)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [isSuspending, isUnsuspending, isRemoving, handleUnsuspend]
  );

  /* ── SECURITY: only the zone manager can view this page ── */
  if (!isLoadingRep && !isManager) {
    return (
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-sm border border-border/40 px-8">
          <div className="w-16 h-16 bg-destructive/10 rounded-sm flex items-center justify-center mb-6">
            <ShieldCheck className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-2">
            Not authorized
          </h2>
          <p className="text-muted-foreground font-medium max-w-md">
            This page is only available to the school zone manager. If you
            created this zone, make sure it has been approved.
          </p>
          <Button
            className="mt-6 gap-2"
            onClick={() => navigate(getAppPath("/school-zones"))}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to School Zones
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => navigate(getAppPath("/school-zones"))}
          aria-label="Back to school zones"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-sm bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
            {zone?.logo ? (
              <img
                src={zone.logo}
                alt={zone.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <GraduationCap className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight truncate">
              {zone?.name ?? "School Zone"}
            </h1>
            <p className="text-xs text-muted-foreground font-medium truncate">
              {zone?.subdomain}
              {zone?.slug ? ` · ${zone.slug}` : ""}
            </p>
          </div>
          {zone?.status === "active" && (
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              Active
            </Badge>
          )}
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div className="flex items-center gap-1 bg-secondary/30 rounded-sm p-1 w-fit mb-8 overflow-x-auto">
        {(
          [
            { id: "overview" as Tab, label: "Overview" },
            { id: "applications" as Tab, label: "Applications" },
            { id: "vendors" as Tab, label: "Vendors" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
              tab === t.id
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <Card className="border-border/40 rounded-sm overflow-hidden">
          <CardHeader className="pb-4 px-4 sm:px-6 border-b border-border/40 bg-muted/10">
            <CardTitle className="text-base font-black flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Zone Details
            </CardTitle>
            <CardDescription className="text-xs">
              Manage your school zone and its vendors.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {isLoadingRep ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-sm" />
                ))}
              </div>
            ) : zone ? (
              <div className="space-y-4">
                {zone.cover_image && (
                  <img
                    src={zone.cover_image}
                    alt={`${zone.name} cover`}
                    className="w-full h-36 object-cover rounded-sm"
                  />
                )}
                {zone.tagline && (
                  <p className="text-sm text-muted-foreground font-medium">
                    {zone.tagline}
                  </p>
                )}
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={[
                      zone.location,
                      NigeriaData.getStateByCode(zone.state)?.name ?? zone.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  />
                  <InfoRow
                    icon={Store}
                    label="Member Stores"
                    value={String(zone.member_count)}
                  />
                  <InfoRow
                    icon={ExternalLink}
                    label="Subdomain"
                    value={zone.subdomain}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Requested"
                    value={
                      zone.created_at
                        ? format(new Date(zone.created_at), "PPP")
                        : null
                    }
                  />
                </div>
                <Separator />
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setTab("applications")}
                  >
                    <Check className="h-4 w-4" />
                    Review Applications
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => setTab("vendors")}
                  >
                    <Store className="h-4 w-4" />
                    Manage Vendors
                  </Button>
                  {zone.slug && (
                    <a
                      href={`/zones/${zone.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View zone page
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic py-4 text-center">
                Zone not found.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── APPLICATIONS ── */}
      {tab === "applications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Pending Applications
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Review vendor applications for this zone.
              </p>
            </div>
            {pendingMembers.length > 0 && (
              <Badge variant="secondary" className="text-sm px-3 py-1.5 gap-1.5 w-fit">
                {pendingMembers.length} pending
              </Badge>
            )}
          </div>

          {isLoadingPending ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-sm" />
              ))}
            </div>
          ) : pendingMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground bg-muted/30 border border-border/40 rounded-sm px-4 py-8 text-center font-medium">
              No pending applications. Vendors who apply will show up here for
              your review.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-card border border-border/40 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {member.store_logo ? (
                      <img
                        src={member.store_logo}
                        alt={member.store_name}
                        className="h-11 w-11 rounded-sm object-cover bg-muted"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0 space-y-0.5">
                      <h4 className="font-bold text-foreground truncate">
                        {member.store_name}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.department}
                        {member.course ? ` · ${member.course}` : ""} ·{" "}
                        {member.student_id_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Delivery fee:{" "}
                        <span className="font-bold text-foreground">
                          ₦{member.delivery_fee ?? 0}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setReviewTarget(member)}
                    >
                      <Eye className="h-4 w-4" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── VENDORS ── */}
      {tab === "vendors" && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                Zone Vendors
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Manage vendor memberships — suspend, restore, or remove.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                <Input
                  placeholder="Search vendors..."
                  value={memberSearch}
                  onChange={(e) => {
                    setMemberSearch(e.target.value);
                    setMemberPage(1);
                  }}
                  className="pl-9 h-10"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 -mx-2 px-2 lg:mx-0 lg:px-0">
                {MEMBER_STATUS_TABS.map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={memberStatus === key ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-8 sm:h-9 px-4 rounded-sm text-xs sm:text-[13px] font-bold shrink-0 transition-all"
                    )}
                    onClick={() => {
                      setMemberStatus(key);
                      setMemberPage(1);
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Card className="border border-border/40 rounded-sm overflow-hidden">
            <CardHeader className="pb-4 px-4 sm:px-6">
              <CardTitle className="text-base font-black">Members</CardTitle>
              <CardDescription className="text-xs">
                Vendor applications and memberships for this zone.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={memberColumns}
                data={members}
                isLoading={isLoadingMembers}
                pagination={
                  membersPagination
                    ? {
                        page: Number(membersPagination.page),
                        pages: Number(membersPagination.pages),
                        limit: 20,
                        hasNext: membersPagination.hasNext,
                        hasPrev: membersPagination.hasPrev,
                        onPageChange: (p: number) => setMemberPage(p),
                      }
                    : undefined
                }
                emptyMessage={
                  debouncedMemberSearch
                    ? "No vendors match your search."
                    : "No vendors match your filters."
                }
              />
            </CardContent>
          </Card>

          {membersPagination && membersPagination.pages > 1 && (
            <Pagination
              page={membersPagination.page}
              pages={membersPagination.pages}
              hasNext={membersPagination.hasNext}
              hasPrev={membersPagination.hasPrev}
              onPageChange={setMemberPage}
            />
          )}
        </div>
      )}

      {/* ─── MODALS ─── */}
      <ZoneMemberDetailModal
        zoneId={isManager ? id : null}
        zoneName={zone?.name ?? ""}
        member={reviewTarget}
        isOpen={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
      />
      <ConfirmDialog
        open={Boolean(suspendTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setSuspendTarget(null);
          }
        }}
        title="Suspend vendor from zone?"
        description={`${suspendTarget?.store_name} will be hidden from this zone's stores and products until restored. Their membership and delivery rate are kept.`}
        confirmText="Suspend Vendor"
        variant="warning"
        isLoading={isSuspending}
        onConfirm={handleSuspend}
      />
      <ConfirmDialog
        open={Boolean(removeTarget)}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        title="Remove vendor from zone?"
        description={`${removeTarget?.store_name} will be removed entirely from this zone and their zone delivery rate deleted. They can re-apply later.`}
        confirmText="Remove Vendor"
        variant="destructive"
        isLoading={isRemoving}
        onConfirm={handleRemove}
      />
    </div>
  );
}
