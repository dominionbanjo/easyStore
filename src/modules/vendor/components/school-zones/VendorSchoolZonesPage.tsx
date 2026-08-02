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
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { cn } from "@/lib/utils";
import {
  useGetMyMembershipsQuery,
  useGetMyRepZonesQuery,
  useGetZonesQuery,
  useLeaveZoneMutation,
  useDecideMemberMutation,
  useGetZoneMembersQuery,
} from "@/services/schoolZoneApi";
import type { IMyMembership } from "@/types/SchoolZone/schoolZoneTypes";
import ApplyToZoneModal from "@/modules/vendor/components/modals/ApplyToZoneModal";
import CreateZoneModal from "@/modules/vendor/components/modals/CreateZoneModal";

type Tab = "mine" | "manage" | "browse";

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

export default function VendorSchoolZonesPage() {
  const [tab, setTab] = useState<Tab>("mine");
  const [applyZone, setApplyZone] = useState<import("@/types/SchoolZone/schoolZoneTypes").ISchoolZone | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [leaveTarget, setLeaveTarget] = useState<IMyMembership | null>(null);
  const [rejectTarget, setRejectTarget] = useState<{
    memberId: string;
    zoneId: string;
  } | null>(null);

  const { data: membershipsData, isLoading: isLoadingMine } =
    useGetMyMembershipsQuery();
  const { data: repZonesData, isLoading: isLoadingRep } = useGetMyRepZonesQuery();
  const { data: zonesData, isLoading: isLoadingBrowse } = useGetZonesQuery({
    page: 1,
    limit: 50,
  });

  const [leaveZone, { isLoading: isLeaving }] = useLeaveZoneMutation();
  const [decideMember, { isLoading: isDeciding }] = useDecideMemberMutation();

  const memberships = membershipsData?.data ?? [];
  const repZones = repZonesData?.data ?? [];
  const zones = zonesData?.data.items ?? [];

  const myZoneIds = new Set(memberships.map((m) => m.school_zone_id));

  const [selectedRepZone, setSelectedRepZone] = useState<string | null>(null);
  const repZoneId =
    selectedRepZone ??
    (repZones.length > 0 && tab === "manage" ? repZones[0].id : null);

  const { data: membersData, isLoading: isLoadingMembers } =
    useGetZoneMembersQuery(
      { zoneId: repZoneId ?? "", status: "pending", page: 1, limit: 50 },
      { skip: !repZoneId }
    );
  const pendingMembers = membersData?.data.items ?? [];

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

  const handleMemberDecision = async (
    zoneId: string,
    memberId: string,
    decision: "approve" | "reject"
  ) => {
    try {
      await decideMember({
        zoneId,
        memberId,
        decision,
        reason: decision === "reject" ? "Application rejected by school rep" : undefined,
      }).unwrap();
      toast.success(
        decision === "approve" ? "Vendor approved" : "Application rejected"
      );
      setRejectTarget(null);
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "data" in err
          ? String((err as { data: { message?: string } }).data?.message ?? "Failed to update application")
          : "Failed to update application";
      toast.error(message);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            School Zones
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Join campus marketplaces and reach students near you.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="h-4 w-4" />
          Create a Zone
        </Button>
      </div>

      {/* ─── TABS ─── */}
      <div className="flex items-center gap-1 bg-secondary/30 rounded-sm p-1 w-fit mb-8">
        {[
          { id: "mine" as Tab, label: "My Zones" },
          { id: "manage" as Tab, label: "Manage" },
          { id: "browse" as Tab, label: "Browse & Join" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all",
              tab === t.id
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── TAB: MY ZONES (memberships) ─── */}
      {tab === "mine" && (
        <div className="space-y-4">
          {isLoadingMine ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-44 w-full rounded-sm" />
              ))}
            </div>
          ) : memberships.length === 0 ? (
            <EmptyState
              icon={Store}
              title="Not in any zone yet"
              description="Browse zones and apply to join campus marketplaces as a verified vendor."
              className="bg-muted/30 rounded-sm"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {memberships.map((m) => (
                <div
                  key={m.id}
                  className="bg-card border border-border/40 rounded-sm p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {m.zone?.logo ? (
                        <img
                          src={m.zone.logo}
                          alt={m.zone.name}
                          className="h-11 w-11 rounded-sm object-cover bg-muted"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground truncate">
                          {m.zone?.name ?? "School Zone"}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {[m.zone?.location, m.zone?.state]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                    {statusBadge(m.status)}
                  </div>

                  {m.status === "active" && m.zone ? (
                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p>
                          Delivery fee:{" "}
                          <span className="font-bold text-foreground">
                            ₦{m.delivery_fee ?? 0}
                          </span>
                        </p>
                        <p className="truncate max-w-[180px]">
                          {m.department}
                          {m.course ? ` · ${m.course}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/zones/${m.zone.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View
                        </Link>
                        <button
                          onClick={() => setLeaveTarget(m)}
                          className="text-xs font-bold text-destructive hover:underline"
                        >
                          Leave
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground pt-2 border-t border-border/40">
                      {m.status === "rejected" && m.rejection_reason
                        ? `Rejected: ${m.rejection_reason}`
                        : "Your application is under review by the school rep."}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: MANAGE (school rep) ─── */}
      {tab === "manage" && (
        <div className="space-y-6">
          {isLoadingRep ? (
            <Skeleton className="h-24 w-full rounded-sm" />
          ) : repZones.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="You're not a school rep"
              description="Create a school zone and get approved by an admin to manage vendor applications here."
              className="bg-muted/30 rounded-sm"
            />
          ) : (
            <>
              {/* Zone selector */}
              <div className="flex flex-wrap gap-2">
                {repZones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedRepZone(zone.id)}
                    className={cn(
                      "px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider border transition-all",
                      repZoneId === zone.id
                        ? "bg-primary text-white border-primary"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {zone.name} ({zone.member_count})
                  </button>
                ))}
              </div>

              {repZoneId && (
                <>
                  {/* Pending applications */}
                  <div>
                    <h3 className="font-black text-foreground mb-4 flex items-center gap-2">
                      Pending Applications
                      {pendingMembers.length > 0 && (
                        <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-sm">
                          {pendingMembers.length}
                        </span>
                      )}
                    </h3>

                    {isLoadingMembers ? (
                      <div className="space-y-3">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <Skeleton key={i} className="h-24 w-full rounded-sm" />
                        ))}
                      </div>
                    ) : pendingMembers.length === 0 ? (
                      <p className="text-sm text-muted-foreground bg-muted/30 border border-border/40 rounded-sm px-4 py-6 text-center font-medium">
                        No pending applications. Vendors who apply will show up
                        here for your review.
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

                            {member.school_id_image && (
                              <a
                                href={member.school_id_image}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline shrink-0"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                View ID
                              </a>
                            )}

                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
                                disabled={isDeciding}
                                onClick={() =>
                                  setRejectTarget({
                                    memberId: member.id,
                                    zoneId: repZoneId,
                                  })
                                }
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                className="gap-1.5"
                                disabled={isDeciding}
                                isLoading={isDeciding}
                                onClick={() =>
                                  handleMemberDecision(
                                    repZoneId,
                                    member.id,
                                    "approve"
                                  )
                                }
                              >
                                <Check className="h-4 w-4" />
                                Approve
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Zone actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      to={`/zones/${repZones.find((z) => z.id === repZoneId)?.slug ?? ""}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View zone page
                    </Link>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ─── TAB: BROWSE & JOIN ─── */}
      {tab === "browse" && (
        <div className="space-y-4">
          {isLoadingBrowse ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-44 w-full rounded-sm" />
              ))}
            </div>
          ) : zones.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No school zones yet"
              description="No active zones available to join right now."
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
                          {[zone.location, zone.state].filter(Boolean).join(", ")}
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
      <ConfirmDialog
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => {
          if (!open) setRejectTarget(null);
        }}
        title="Reject application?"
        description="The vendor's application will be rejected and they will be notified."
        confirmText="Reject Application"
        variant="destructive"
        isLoading={isDeciding}
        onConfirm={() =>
          rejectTarget &&
          handleMemberDecision(rejectTarget.zoneId, rejectTarget.memberId, "reject")
        }
      />
    </div>
  );
}
