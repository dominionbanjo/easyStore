import { useMemo, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
  Calendar,
  ShieldCheck,
  Check,
  X,
  Store,
  Search,
  Eye,
  Ban,
  RefreshCcw,
  Trash2,
  ArrowLeft,
  Package,
  Link2,
  MessageSquareWarning,
  Globe,
  MoreVertical,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Pagination } from "@/components/shared/Pagination";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import ProductGridCard from "@/components/shared/ProductGridCard";
import { AdminUserDetailModal } from "@/modules/admin/components/shared/AdminUserDetailModal";
import {
  useGetAdminZoneDetailQuery,
  useGetZoneProductsQuery,
  useGetZoneMembersQuery,
  useDecideZoneMutation,
  useSuspendMemberMutation,
  useUnsuspendMemberMutation,
  useRemoveZoneMemberMutation,
} from "@/services/schoolZoneApi";
import { useDebounce } from "@/hooks";
import { NigeriaData } from "@/utils/nigeria-data";
import { areSubdomainsDisabled } from "@/utils/subdomain";
import { cn } from "@/lib/utils";
import type {
  SchoolZoneStatus,
  ZoneMemberStatus,
  IZoneMember,
} from "@/types/SchoolZone/schoolZoneTypes";

type Tab = "overview" | "products" | "vendors";

const VALID_TABS: Tab[] = ["overview", "products", "vendors"];

const zoneStatusBadge = (status: SchoolZoneStatus) => {
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

const MEMBER_STATUS_TABS: { key: "all" | ZoneMemberStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "suspended", label: "Suspended" },
  { key: "rejected", label: "Rejected" },
];

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

export default function SuperAdminSchoolZoneDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const adminPathPrefix = areSubdomainsDisabled() ? "/admin" : "";
  const zonesListPath = `${adminPathPrefix}/school-zones`;

  const tabParam = searchParams.get("tab");
  const tab: Tab = VALID_TABS.includes(tabParam as Tab)
    ? (tabParam as Tab)
    : "overview";

  /* ── Overview state ── */
  const [rejectReason, setRejectReason] = useState("");

  /* ── Products state ── */
  const [productSearch, setProductSearch] = useState("");
  const [productPage, setProductPage] = useState(1);

  /* ── Vendors state ── */
  const [memberSearch, setMemberSearch] = useState("");
  const [memberStatus, setMemberStatus] = useState<"all" | ZoneMemberStatus>("all");
  const [memberPage, setMemberPage] = useState(1);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<IZoneMember | null>(null);
  const [removeTarget, setRemoveTarget] = useState<IZoneMember | null>(null);

  const debouncedProductSearch = useDebounce(productSearch, 350);
  const debouncedMemberSearch = useDebounce(memberSearch, 350);

  /* ── Queries ── */
  const { data: detailData, isLoading: isLoadingDetail } =
    useGetAdminZoneDetailQuery(id, { skip: !id });

  const { data: productsData, isLoading: isLoadingProducts } =
    useGetZoneProductsQuery(
      {
        identifier: id,
        page: productPage,
        limit: 12,
        q: debouncedProductSearch || undefined,
      },
      { skip: !id || tab !== "products" }
    );

  const { data: membersData, isLoading: isLoadingMembers } =
    useGetZoneMembersQuery(
      {
        zoneId: id,
        page: memberPage,
        limit: 20,
        q: debouncedMemberSearch || undefined,
        status: memberStatus === "all" ? undefined : memberStatus,
      },
      { skip: !id || tab !== "vendors" }
    );

  /* ── Mutations ── */
  const [decideZone, { isLoading: isDeciding }] = useDecideZoneMutation();
  const [suspendMember, { isLoading: isSuspending }] = useSuspendMemberMutation();
  const [unsuspendMember, { isLoading: isUnsuspending }] =
    useUnsuspendMemberMutation();
  const [removeZoneMember, { isLoading: isRemoving }] =
    useRemoveZoneMemberMutation();

  const zone = detailData?.data.zone;
  const requester = detailData?.data.requester;
  const products = productsData?.data.items ?? [];
  const productsPagination = productsData?.data.pagination;
  const members = membersData?.data.items ?? [];
  const membersPagination = membersData?.data.pagination;

  const setTab = (next: Tab) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", next);
    setSearchParams(nextParams);
  };

  const handleDecision = async (decision: "approve" | "reject") => {
    if (!zone) return;
    try {
      await decideZone({
        zoneId: zone.id,
        decision,
        reason:
          decision === "reject" ? rejectReason.trim() || undefined : undefined,
      }).unwrap();
      toast.success(
        decision === "approve"
          ? `${zone.name} approved and is now live`
          : `${zone.name} rejected`
      );
      setRejectReason("");
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "data" in err
          ? String(
              (err as { data: { message?: string } }).data?.message ??
                "Failed to update zone"
            )
          : "Failed to update zone";
      toast.error(message);
    }
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
                  disabled={!row.original.user_id}
                  onClick={() => setSelectedVendorId(row.original.user_id)}
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

  const isLoadingOverview = isLoadingDetail;

  return (
    <section className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => navigate(zonesListPath)}
          aria-label="Back to school zones"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 min-w-0 flex-wrap">
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
          {zone && zoneStatusBadge(zone.status)}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-secondary/30 rounded-sm p-1 w-fit overflow-x-auto">
        {(
          [
            { id: "overview" as Tab, label: "Overview" },
            { id: "products" as Tab, label: "Products" },
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
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Zone info */}
          <Card className="border-border/40 rounded-sm overflow-hidden">
            <CardHeader className="pb-4 px-4 sm:px-6 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-base font-black flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Zone Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {isLoadingOverview ? (
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
                  {zone.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {zone.description}
                    </p>
                  )}
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <InfoRow
                      icon={MapPin}
                      label="Location"
                      value={[
                        zone.location,
                        NigeriaData.getStateByCode(zone.state)?.name ??
                          zone.state,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    />
                    <InfoRow
                      icon={Store}
                      label="Active Members"
                      value={String(zone.member_count)}
                    />
                    <InfoRow icon={Globe} label="Subdomain" value={zone.subdomain} />
                    <InfoRow icon={Link2} label="Slug" value={zone.slug} />
                    <InfoRow
                      icon={Mail}
                      label="Contact Email"
                      value={zone.contact_email}
                    />
                    <InfoRow
                      icon={Phone}
                      label="Contact Phone"
                      value={zone.contact_phone}
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
                    <InfoRow
                      icon={ShieldCheck}
                      label="Approved"
                      value={
                        zone.approved_at
                          ? format(new Date(zone.approved_at), "PPP")
                          : zone.status === "pending"
                            ? "Not yet approved"
                            : null
                      }
                    />
                  </div>

                  {zone.status === "rejected" && zone.rejection_reason && (
                    <div className="flex items-start gap-3 py-2.5">
                      <div className="mt-0.5 p-1.5 rounded-sm bg-red-500/10 flex-shrink-0">
                        <MessageSquareWarning className="h-3.5 w-3.5 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          Rejection Reason
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-0.5">
                          {zone.rejection_reason}
                        </p>
                      </div>
                    </div>
                  )}

                  {zone.status === "pending" && (
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">
                          Rejection Reason
                          <span className="text-xs text-muted-foreground font-medium ml-2">
                            (required to reject)
                          </span>
                        </label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="e.g. School ID could not be verified..."
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-sm border border-border/60 bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
                          disabled={isDeciding}
                          onClick={() => handleDecision("reject")}
                        >
                          <X className="h-4 w-4" />
                          Reject Request
                        </Button>
                        <Button
                          className="gap-1.5"
                          disabled={isDeciding}
                          isLoading={isDeciding}
                          onClick={() => handleDecision("approve")}
                        >
                          <Check className="h-4 w-4" />
                          Approve & Make Live
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic py-4 text-center">
                  Could not load zone details.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Requester */}
          <Card className="border-border/40 rounded-sm overflow-hidden">
            <CardHeader className="pb-4 px-4 sm:px-6 border-b border-border/40 bg-muted/10">
              <CardTitle className="text-base font-black flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Requester
              </CardTitle>
              <CardDescription className="text-xs">
                The person who applied to create this zone.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {isLoadingOverview ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-sm" />
                  ))}
                </div>
              ) : requester ? (
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-14 w-14 rounded-sm overflow-hidden bg-primary/10 ring-2 ring-primary/20 flex items-center justify-center">
                      {requester.avatar ? (
                        <img
                          src={requester.avatar}
                          alt="requester avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-primary/60" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">
                        {requester.first_name} {requester.last_name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium capitalize">
                        {requester.account_type} · {requester.account_status}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 mt-2"
                        onClick={() => setSelectedVendorId(requester.id)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Full Profile
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <InfoRow icon={Mail} label="Email" value={requester.email} />
                    <InfoRow
                      icon={Phone}
                      label="Phone"
                      value={requester.phone_number}
                    />
                    <InfoRow
                      icon={User}
                      label="Account Type"
                      value={requester.account_type}
                    />
                    <InfoRow
                      icon={ShieldCheck}
                      label="Account Status"
                      value={requester.account_status}
                    />
                    <InfoRow
                      icon={Calendar}
                      label="Member Since"
                      value={
                        requester.created_at
                          ? format(new Date(requester.created_at), "PPP")
                          : null
                      }
                    />
                  </div>

                  {/* School rep verification */}
                  {(zone?.department ||
                    zone?.course ||
                    zone?.student_id_number ||
                    zone?.school_id_image ||
                    zone?.delivery_fee !== null) && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                          School Rep Verification
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                          <InfoRow
                            icon={GraduationCap}
                            label="Department"
                            value={zone?.department}
                          />
                          <InfoRow
                            icon={GraduationCap}
                            label="Course"
                            value={zone?.course}
                          />
                          <InfoRow
                            icon={User}
                            label="Student ID No."
                            value={zone?.student_id_number}
                          />
                          <InfoRow
                            icon={ShieldCheck}
                            label="Delivery Fee"
                            value={
                              zone?.delivery_fee !== null &&
                              zone?.delivery_fee !== undefined
                                ? `₦${zone.delivery_fee}`
                                : null
                            }
                          />
                        </div>
                        {zone?.school_id_image && (
                          <a
                            href={zone.school_id_image}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline mt-2"
                          >
                            <Link2 className="h-3.5 w-3.5" />
                            View school ID image
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic py-4 text-center">
                  Requester information unavailable.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── PRODUCTS ── */}
      {tab === "products" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Zone Products
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Products from active member stores in this zone.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
              <Input
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setProductPage(1);
                }}
                className="pl-9 h-10"
              />
            </div>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-sm" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                {products.map((product) => (
                  <div key={product.id}>
                    <ProductGridCard data={product} />
                  </div>
                ))}
              </div>
              {productsPagination && productsPagination.pages > 1 && (
                <Pagination
                  page={productsPagination.page}
                  pages={productsPagination.pages}
                  hasNext={productsPagination.hasNext}
                  hasPrev={productsPagination.hasPrev}
                  onPageChange={setProductPage}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-sm border border-border/40">
              <Package className="h-10 w-10 text-muted-foreground/40 mb-4" />
              <p className="font-bold text-foreground">No products found</p>
              <p className="text-sm text-muted-foreground">
                {zone?.status !== "active"
                  ? "This zone is not active yet — no member products to show."
                  : "No products match your search."}
              </p>
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
                Manage vendor memberships in this zone.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="relative w-full lg:w-64">
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

              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide -mx-2 px-2 lg:mx-0 lg:px-0">
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
        </div>
      )}

      {/* ── Modals ── */}
      <AdminUserDetailModal
        userId={selectedVendorId}
        open={Boolean(selectedVendorId)}
        onClose={() => setSelectedVendorId(null)}
        mode="vendor"
      />
      <ConfirmDialog
        open={Boolean(suspendTarget)}
        onOpenChange={(open) => {
          if (!open) setSuspendTarget(null);
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
    </section>
  );
}
