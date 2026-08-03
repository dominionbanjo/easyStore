import { useState } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  Store,
  Plus,
  Check,
  X,
  ExternalLink,
  Loader2,
  Settings2,
  Search,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Pagination } from "@/components/shared/Pagination";
import { NigeriaData } from "@/utils/nigeria-data";
import { getAppPath } from "@/utils/subdomain";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  useGetMyMembershipsQuery,
  useGetMyRepZonesQuery,
  useGetZonesQuery,
  useLeaveZoneMutation,
} from "@/services/schoolZoneApi";
import type { IMyMembership } from "@/types/SchoolZone/schoolZoneTypes";
import ApplyToZoneModal from "@/modules/vendor/components/modals/ApplyToZoneModal";
import CreateZoneModal from "@/modules/vendor/components/modals/CreateZoneModal";

type Tab = "mine" | "browse";

const statusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
          <Check className="h-3 w-3" /> Active
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
          <Loader2 className="h-3 w-3 animate-spin" /> Pending
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
          <X className="h-3 w-3" /> Rejected
        </span>
      );
    default:
      return null;
  }
};

const VALID_TABS: Tab[] = ["mine", "browse"];

export default function VendorSchoolZonesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab: Tab = VALID_TABS.includes(tabParam as Tab)
    ? (tabParam as Tab)
    : "mine";

  const [applyZone, setApplyZone] = useState<import("@/types/SchoolZone/schoolZoneTypes").ISchoolZone | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [leaveTarget, setLeaveTarget] = useState<IMyMembership | null>(null);
  const [membershipsPage, setMembershipsPage] = useState(1);
  const [browsePage, setBrowsePage] = useState(1);
  const [browseSearch, setBrowseSearch] = useState("");
  const debouncedBrowseSearch = useDebounce(browseSearch, 350);

  const { data: membershipsData, isLoading: isLoadingMine } =
    useGetMyMembershipsQuery({ page: membershipsPage, limit: 12 });
  const { data: repZonesData } = useGetMyRepZonesQuery();
  const { data: zonesData, isLoading: isLoadingBrowse } = useGetZonesQuery({
    page: browsePage,
    limit: 12,
    q: debouncedBrowseSearch || undefined,
  });

  const [leaveZone, { isLoading: isLeaving }] = useLeaveZoneMutation();

  const memberships = membershipsData?.data.items ?? [];
  const membershipsPagination = membershipsData?.data.pagination;
  const managerZoneIds = new Set((repZonesData?.data ?? []).map((z) => z.id));
  const zones = zonesData?.data.items ?? [];
  const browsePagination = zonesData?.data.pagination;

  const setTab = (next: Tab) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", next);
    setSearchParams(nextParams);
  };

  const myZoneIds = new Set(memberships.map((m) => m.school_zone_id));

  const handleLeave = async () => {
    if (!leaveTarget) return;
    try {
      await leaveZone(leaveTarget.school_zone_id).unwrap();
      toast.success("Left school zone");
      setLeaveTarget(null);
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "data" in err
          ? String((err as { data: { message?: string } }).data?.message ?? "Failed to leave zone")
          : "Failed to leave zone";
      toast.error(message);
    }
  };

  return (
    <div className="w-full pb-8">
      {/* ─── HEADER: Tabs + Create Zone ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
        <div className="flex items-center gap-1 bg-secondary/30 rounded-sm p-1 w-fit max-w-full overflow-x-auto flex-1 min-w-0">
          {[
            { id: "mine" as Tab, label: "My Zones" },
            { id: "browse" as Tab, label: "Browse & Join" },
          ].map((t) => (
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

        <Button
          size="sm"
          className="gap-2 w-full sm:w-auto"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="h-4 w-4" />
          Create a Zone
        </Button>
      </div>

      {/* ─── TAB: MY ZONES (memberships) ─── */}
      {tab === "mine" && (
        <div className="space-y-4">
          {isLoadingMine ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-sm" />
              ))}
            </div>
          ) : (
            <>
              {/* Store memberships (zones I joined) */}
              {memberships.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-black text-foreground flex items-center gap-2">
                    My Memberships
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-sm">
                      {memberships.length}
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {memberships.map((m) => (
                      <div
                        key={m.id}
                        className="bg-card border border-border/40 rounded-sm overflow-hidden flex flex-col sm:flex-row"
                      >
                        {/* Cover / logo thumbnail */}
                        <div
                          className="relative sm:w-40 md:w-48 shrink-0 h-24 sm:h-auto bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${
                              m.zone?.cover_image ||
                              "/images/defaultbanner.png"
                            })`,
                          }}
                        >
                          <div className="absolute inset-0 bg-black/25" />
                          {m.zone?.logo ? (
                            <img
                              src={m.zone.logo}
                              alt={m.zone.name}
                              className="absolute bottom-2.5 left-2.5 h-12 w-12 rounded-sm object-cover border-2 border-white/80 shadow bg-white"
                            />
                          ) : (
                            <div className="absolute bottom-2.5 left-2.5 h-12 w-12 rounded-sm bg-primary/90 flex items-center justify-center border-2 border-white/80 shadow">
                              <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="font-bold text-foreground text-base truncate">
                                {m.zone?.name ?? "School Zone"}
                              </h4>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {m.zone?.subdomain}
                              </p>
                            </div>
                            {statusBadge(m.status)}
                          </div>

                          <div className="grid grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-1.5 text-xs">
                            <div>
                              <p className="text-muted-foreground font-medium uppercase text-[10px]">
                                Location
                              </p>
                              <p className="font-semibold text-foreground truncate">
                                {[
                                  m.zone?.location,
                                  m.zone?.state
                                    ? (NigeriaData.getStateByCode(m.zone.state)
                                        ?.name ?? m.zone.state)
                                    : null,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium uppercase text-[10px]">
                                Department
                              </p>
                              <p className="font-semibold text-foreground truncate">
                                {m.department || "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium uppercase text-[10px]">
                                Course
                              </p>
                              <p className="font-semibold text-foreground truncate">
                                {m.course || "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium uppercase text-[10px]">
                                Student ID
                              </p>
                              <p className="font-semibold text-foreground truncate">
                                {m.student_id_number || "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium uppercase text-[10px]">
                                Delivery Fee
                              </p>
                              <p className="font-semibold text-foreground">
                                ₦{m.delivery_fee ?? 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium uppercase text-[10px]">
                                Applied
                              </p>
                              <p className="font-semibold text-foreground">
                                {m.requested_at
                                  ? new Date(m.requested_at).toLocaleDateString()
                                  : "—"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 border-t border-border/40 gap-3">
                            <p className="text-xs text-muted-foreground min-w-0 truncate">
                              {m.status === "active"
                                ? "Your store is live in this zone."
                                : m.status === "rejected"
                                  ? `Rejected: ${m.rejection_reason || "No reason provided"}`
                                  : "Your application is under review by the school rep."}
                            </p>
                            <div className="flex items-center gap-3 shrink-0 flex-wrap">
                              {m.zone && managerZoneIds.has(m.zone.id) && (
                                <Link
                                  to={getAppPath(`/school-zones/${m.zone.id}`)}
                                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                >
                                  <Settings2 className="h-3.5 w-3.5" />
                                  Manage Zone
                                </Link>
                              )}
                              {m.zone && (
                                <Link
                                  to={`/zones/${m.zone.slug}`}
                                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  View
                                </Link>
                              )}
                              <button
                                onClick={() => setLeaveTarget(m)}
                                className="text-xs font-bold text-destructive hover:underline"
                              >
                                Leave
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {membershipsPagination && membershipsPagination.pages > 1 && (
                <Pagination
                  page={membershipsPagination.page}
                  pages={membershipsPagination.pages}
                  hasNext={membershipsPagination.hasNext}
                  hasPrev={membershipsPagination.hasPrev}
                  onPageChange={setMembershipsPage}
                />
              )}

              {/* Empty state */}
              {memberships.length === 0 && (
                <EmptyState
                  icon={Store}
                  title="Not in any zone yet"
                  description="Browse zones and apply to join campus marketplaces as a verified vendor."
                  className="bg-muted/30 rounded-sm"
                />
              )}
            </>
          )}
        </div>
      )}

      {/* ─── TAB: BROWSE & JOIN ─── */}
      {tab === "browse" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Browse & Join
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Join campus marketplaces as a verified vendor.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
              <input
                placeholder="Search school zones..."
                value={browseSearch}
                onChange={(e) => {
                  setBrowseSearch(e.target.value);
                  setBrowsePage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-border/60 bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {isLoadingBrowse ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-44 w-full rounded-sm" />
              ))}
            </div>
          ) : zones.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title={debouncedBrowseSearch ? "No zones match your search" : "No school zones yet"}
              description={
                debouncedBrowseSearch
                  ? "Try a different name or clear the search."
                  : "No active zones available to join right now."
              }
              className="bg-muted/30 rounded-sm"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {zones.map((zone) => {
                const joined = myZoneIds.has(zone.id);
                return (
                  <div
                    key={zone.id}
                    className="bg-card border border-border/40 rounded-sm p-5 space-y-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {zone.logo ? (
                        <img
                          src={zone.logo}
                          alt={zone.name}
                          className="h-11 w-11 rounded-sm object-cover bg-muted"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground truncate">
                          {zone.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {zone.member_count} stores ·{" "}
                          {[
                            zone.location,
                            NigeriaData.getStateByCode(zone.state)?.name ??
                              zone.state,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>

                    {zone.tagline && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {zone.tagline}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <Link
                        to={`/zones/${zone.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </Link>
                      <Button
                        size="sm"
                        variant={joined ? "outline" : "default"}
                        disabled={joined}
                        onClick={() => setApplyZone(zone)}
                      >
                        {joined ? "Applied" : "Join"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {browsePagination && browsePagination.pages > 1 && (
            <Pagination
              page={browsePagination.page}
              pages={browsePagination.pages}
              hasNext={browsePagination.hasNext}
              hasPrev={browsePagination.hasPrev}
              onPageChange={setBrowsePage}
            />
          )}
        </div>
      )}

      {/* ─── MODALS ─── */}
      <ApplyToZoneModal
        zone={applyZone}
        isOpen={Boolean(applyZone)}
        onClose={() => setApplyZone(null)}
      />
      <CreateZoneModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <ConfirmDialog
        open={Boolean(leaveTarget)}
        onOpenChange={(open) => {
          if (!open) setLeaveTarget(null);
        }}
        title="Leave school zone?"
        description={`Your store will stop appearing in ${leaveTarget?.zone?.name ?? "this zone"} and the zone delivery rate will be removed. You can re-apply anytime.`}
        confirmText={isLeaving ? "Leaving..." : "Leave Zone"}
        isLoading={isLeaving}
        onConfirm={handleLeave}
      />
    </div>
  );
}
