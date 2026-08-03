import { useState } from "react";
import { toast } from "sonner";
import { Store, GraduationCap, ExternalLink, X, Check } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDecideMemberMutation } from "@/services/schoolZoneApi";
import type { IZoneMember } from "@/types/SchoolZone/schoolZoneTypes";

interface ZoneMemberDetailModalProps {
  zoneId: string | null;
  zoneName: string;
  member: IZoneMember | null;
  isOpen: boolean;
  onClose: () => void;
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="space-y-0.5 min-w-0">
    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
      {label}
    </p>
    <p className="text-sm font-semibold text-foreground truncate">
      {value ?? (
        <span className="text-muted-foreground text-xs font-medium">
          Not provided
        </span>
      )}
    </p>
  </div>
);

export default function ZoneMemberDetailModal({
  zoneId,
  zoneName,
  member,
  isOpen,
  onClose,
}: ZoneMemberDetailModalProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [decideMember, { isLoading: isDeciding }] = useDecideMemberMutation();

  const handleDecision = async (decision: "approve" | "reject") => {
    if (!zoneId || !member) return;
    try {
      await decideMember({
        zoneId,
        memberId: member.id,
        decision,
        reason:
          decision === "reject" ? rejectReason.trim() || undefined : undefined,
      }).unwrap();
      toast.success(
        decision === "approve"
          ? `${member.store_name} approved for ${zoneName}`
          : `${member.store_name}'s application rejected`
      );
      setRejectReason("");
      onClose();
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "data" in err
          ? String(
              (err as { data: { message?: string } }).data?.message ??
                "Failed to update application"
            )
          : "Failed to update application";
      toast.error(message);
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) {
          setRejectReason("");
          onClose();
        }
      }}
      onClose={() => {
        setRejectReason("");
        onClose();
      }}
      title={`Application Review — ${zoneName}`}
      description="Review the vendor's details before deciding."
      className="sm:max-w-lg"
      footer={
        member?.status === "pending" ? (
          <div className="flex justify-end gap-3 px-6 py-3">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
              disabled={isDeciding}
              onClick={() => handleDecision("reject")}
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
            <Button
              size="sm"
              className="h-9 gap-1.5"
              disabled={isDeciding}
              isLoading={isDeciding}
              onClick={() => handleDecision("approve")}
            >
              <Check className="h-4 w-4" />
              Approve & Activate
            </Button>
          </div>
        ) : (
          <div className="flex justify-end px-6 py-3">
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => {
                setRejectReason("");
                onClose();
              }}
            >
              Close
            </Button>
          </div>
        )
      }
    >
      {!member ? (
        <p className="text-sm text-muted-foreground italic py-8 text-center">
          No application selected.
        </p>
      ) : (
        <div className="space-y-5 px-6 py-5">
          {/* ── Store header ── */}
          <div className="flex items-start gap-4 p-4 rounded-sm bg-muted/40 border border-border/40">
            <div className="flex-shrink-0 h-14 w-14 rounded-sm overflow-hidden bg-primary/10 ring-2 ring-primary/20 flex items-center justify-center">
              {member.store_logo ? (
                <img
                  src={member.store_logo}
                  alt={member.store_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Store className="h-6 w-6 text-primary/60" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-foreground truncate">
                  {member.store_name}
                </h3>
                <span
                  className={
                    member.status === "active"
                      ? "inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider"
                      : member.status === "rejected"
                        ? "inline-flex items-center gap-1 bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider"
                        : "inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider"
                  }
                >
                  {member.status === "pending" && (
                    <GraduationCap className="h-3 w-3" />
                  )}
                  {member.status === "active" && <Check className="h-3 w-3" />}
                  {member.status === "rejected" && <X className="h-3 w-3" />}
                  {member.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-1 truncate">
                @{member.store_slug}
              </p>
            </div>
          </div>

          {/* ── School verification ── */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              School Verification
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <InfoRow label="Department" value={member.department} />
              <InfoRow label="Course of Study" value={member.course} />
              <InfoRow label="Student ID No." value={member.student_id_number} />
              <InfoRow
                label="Delivery Fee"
                value={
                  member.delivery_fee !== null &&
                  member.delivery_fee !== undefined
                    ? `₦${member.delivery_fee}`
                    : null
                }
              />
              <InfoRow
                label="Applied"
                value={
                  member.requested_at
                    ? new Date(member.requested_at).toLocaleDateString()
                    : null
                }
              />
              {member.approved_at && (
                <InfoRow
                  label="Approved"
                  value={new Date(member.approved_at).toLocaleDateString()}
                />
              )}
            </div>
          </div>

          {/* ── School ID image ── */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              School ID Image
            </label>
            {member.school_id_image ? (
              <div className="rounded-sm overflow-hidden border border-border/60">
                <img
                  src={member.school_id_image}
                  alt="School ID"
                  className="h-40 w-full object-cover"
                />
                <a
                  href={member.school_id_image}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:underline py-2 bg-muted/30 border-t border-border/40"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open full image
                </a>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No school ID uploaded.
              </p>
            )}
          </div>

          {member.status === "rejected" && member.rejection_reason && (
            <>
              <Separator />
              <div>
                <InfoRow label="Rejection Reason" value={member.rejection_reason} />
              </div>
            </>
          )}

          {/* ── Reject reason (pending only) ── */}
          {member.status === "pending" && (
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
          )}
        </div>
      )}
    </Modal>
  );
}
