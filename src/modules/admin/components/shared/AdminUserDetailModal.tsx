import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  User,
  Calendar,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useUpdateAdminUserStatusMutation,
  useGetAdminUserQuery,
} from "@/services/adminApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmActionDialog } from "./ConfirmActionDialog";

type StatusKey = "active" | "pending" | "restricted" | "banned";

const statusColors: Record<string, string> = {
  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  restricted:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  banned: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  pending: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
};

const userConfirmConfig: Record<
  StatusKey,
  {
    title: string;
    description: string;
    label: string;
    variant: "default" | "destructive" | "outline";
  }
> = {
  active: {
    title: "Activate Account",
    description: "This will restore full access for this user.",
    label: "Activate",
    variant: "default",
  },
  pending: {
    title: "Set to Pending",
    description: "This account will be set to pending review status.",
    label: "Set Pending",
    variant: "outline",
  },
  restricted: {
    title: "Restrict Account",
    description:
      "This user can still log in but cannot add products or perform vendor actions.",
    label: "Restrict",
    variant: "outline",
  },
  banned: {
    title: "Ban Account",
    description:
      "This user will be immediately logged out and blocked from signing in. Reversible by admin.",
    label: "Ban",
    variant: "destructive",
  },
};

const vendorConfirmConfig: Record<
  StatusKey,
  {
    title: string;
    description: string;
    label: string;
    variant: "default" | "destructive" | "outline";
  }
> = {
  active: {
    title: "Approve Vendor",
    description:
      "This vendor's store and products will become publicly visible.",
    label: "Approve",
    variant: "default",
  },
  pending: {
    title: "Set Vendor Pending",
    description:
      "This moves the vendor back to a pending state, hiding their store from public.",
    label: "Set Pending",
    variant: "outline",
  },
  restricted: {
    title: "Restrict Vendor",
    description:
      "This vendor can still log in but cannot add new products. Their store is hidden.",
    label: "Restrict",
    variant: "outline",
  },
  banned: {
    title: "Ban Vendor",
    description:
      "This vendor will be immediately logged out and their store hidden. Reversible by admin.",
    label: "Ban Vendor",
    variant: "destructive",
  },
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
    <div className="mt-0.5 p-1.5 rounded-md bg-muted/60 flex-shrink-0">
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

interface AdminUserDetailModalProps {
  userId: string | null;
  open: boolean;
  onClose: () => void;
  mode?: "user" | "vendor";
}

export function AdminUserDetailModal({
  userId,
  open,
  onClose,
  mode = "user",
}: AdminUserDetailModalProps) {
  const [pendingStatus, setPendingStatus] = useState<StatusKey | null>(null);

  const { data, isLoading, isFetching } = useGetAdminUserQuery(userId!, {
    skip: !userId || !open,
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateAdminUserStatusMutation();

  const user = data?.data;
  const loading = isLoading || isFetching;
  const configs = mode === "vendor" ? vendorConfirmConfig : userConfirmConfig;
  const cfg = pendingStatus ? configs[pendingStatus] : null;

  const handleConfirm = async () => {
    if (!user || !pendingStatus) return;
    try {
      await updateStatus({ userId: user.id, status: pendingStatus }).unwrap();
      toast.success(
        `${mode === "vendor" ? "Vendor" : "User"} updated to ${pendingStatus}`,
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    } finally {
      setPendingStatus(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {mode === "vendor" ? "Vendor Details" : "User Details"}
            </DialogTitle>
            <DialogDescription>
              Full profile info and account management.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="space-y-3 py-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : user ? (
            <div className="space-y-5 mt-1">
              {/* ── Profile header ── */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border/40">
                <div className="flex-shrink-0 h-14 w-14 rounded-full overflow-hidden bg-primary/10 ring-2 ring-primary/20 flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-primary/60" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold">
                      {user.first_name} {user.last_name}
                    </h3>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-semibold",
                        statusColors[user.account_status] ||
                          statusColors.pending,
                      )}
                    >
                      {user.account_status?.charAt(0).toUpperCase() +
                        user.account_status?.slice(1)}
                    </span>
                    {user.email_verified && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    @{user.username || "unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">
                    {user.account_type} · via {user.signup_medium || "email"}
                  </p>
                </div>
              </div>

              {/* ── Contact ── */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Contact
                </p>
                <div className="divide-y divide-border/30">
                  <InfoRow icon={Mail} label="Email" value={user.email} />
                  <InfoRow
                    icon={Phone}
                    label="Phone"
                    value={user.phone_number}
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={
                      user.address
                        ? [
                            user.address.city,
                            user.address.state,
                            user.address.country,
                          ]
                            .filter(Boolean)
                            .join(", ")
                        : null
                    }
                  />
                </div>
              </div>

              <Separator />

              {/* ── Account meta ── */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Account
                </p>
                <div className="divide-y divide-border/30">
                  <InfoRow
                    icon={Calendar}
                    label="Joined"
                    value={
                      user.created_at
                        ? format(new Date(user.created_at), "MMMM dd, yyyy")
                        : "—"
                    }
                  />
                  <InfoRow
                    icon={ShieldCheck}
                    label="Email Verified"
                    value={
                      user.email_verified ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> No
                        </span>
                      )
                    }
                  />
                  <InfoRow
                    icon={RefreshCcw}
                    label="Payout Verified"
                    value={
                      user.payout_verified ? (
                        <span className="text-emerald-600">Yes</span>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )
                    }
                  />
                </div>
              </div>

              {/* ── Store (vendors only) ── */}
              {mode === "vendor" && user.store && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      Store
                    </p>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-muted/20">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {user.store.logo ? (
                          <img
                            src={user.store.logo}
                            alt={user.store.store_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Store className="h-5 w-5 text-primary/60" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">
                          {user.store.store_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {[
                            user.store.address_city,
                            user.store.address_state,
                            user.store.address_country,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Location not set"}
                        </p>
                      </div>
                      {user.store.rating_average != null && (
                        <Badge variant="secondary" className="text-xs">
                          ⭐ {Number(user.store.rating_average).toFixed(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* ── Status actions ── */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Change Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.account_status !== "active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      onClick={() => setPendingStatus("active")}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {mode === "vendor" ? "Approve" : "Set Active"}
                    </Button>
                  )}

                  {mode === "vendor" && user.account_status !== "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-blue-400 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => setPendingStatus("pending")}
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Set Pending
                    </Button>
                  )}

                  {user.account_status !== "restricted" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                      onClick={() => setPendingStatus("restricted")}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Restrict
                    </Button>
                  )}

                  {user.account_status !== "banned" ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-2"
                      onClick={() => setPendingStatus("banned")}
                    >
                      <Ban className="h-4 w-4" />
                      Ban {mode === "vendor" ? "Vendor" : "User"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                      onClick={() => setPendingStatus("active")}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Unban
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Could not load details.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog sits outside the detail modal */}
      {cfg && (
        <ConfirmActionDialog
          open={!!pendingStatus}
          onClose={() => setPendingStatus(null)}
          onConfirm={handleConfirm}
          isLoading={isUpdating}
          title={cfg.title}
          description={cfg.description}
          confirmLabel={cfg.label}
          confirmLoadingText="Updating..."
          confirmVariant={cfg.variant}
        />
      )}
    </>
  );
}
