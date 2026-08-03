import { useState } from "react";
import {
  MoreVertical,
  BadgeCheck,
  Ban,
  AlertTriangle,
  UserSearch,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { IAdminUser } from "@/services/adminApi";
import { useUpdateAdminVendorStatusMutation } from "@/services/adminApi";
import { toast } from "sonner";
import { ConfirmActionDialog } from "../shared/ConfirmActionDialog";
import { extractErrorMessage } from "@/utils/errorHandler";

type StatusKey = "active" | "pending" | "restricted" | "banned";

const confirmConfig: Record<
  StatusKey,
  {
    title: string;
    description: string;
    label: string;
    variant: "default" | "destructive" | "outline";
  }
> = {
  active: {
    title: "Approve Store",
    description:
      "This store and its products will become publicly visible. The vendor will be notified.",
    label: "Approve",
    variant: "default",
  },
  pending: {
    title: "Set Store Pending",
    description:
      "This will move the store back to a pending state, hiding it from public search and site categories.",
    label: "Set Pending",
    variant: "outline",
  },
  restricted: {
    title: "Restrict Store",
    description:
      "This vendor can still log in and view their dashboard, but their store and products will be hidden from the public.",
    label: "Restrict",
    variant: "outline",
  },
  banned: {
    title: "Ban Store",
    description:
      "This store will be completely disabled. This is a high-level restriction.",
    label: "Ban Store",
    variant: "destructive",
  },
};

export function VendorRowActions({
  user,
  onViewDetails,
}: {
  user: IAdminUser;
  onViewDetails: (id: string) => void;
}) {
  const [pendingStatus, setPendingStatus] = useState<StatusKey | null>(null);
  const [updateStatus, { isLoading }] = useUpdateAdminVendorStatusMutation();

  const handleConfirm = async () => {
    if (!pendingStatus || !user.store?.id) return;
    try {
      await updateStatus({
        storeId: user.store.id,
        status: pendingStatus,
      }).unwrap();
      toast.success(`Store marked as ${pendingStatus}`);
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to update store status"));
    } finally {
      setPendingStatus(null);
    }
  };

  const cfg = pendingStatus ? confirmConfig[pendingStatus] : null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Vendor Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="gap-2"
            onClick={() => onViewDetails(user.id)}
          >
            <UserSearch className="h-4 w-4 text-blue-500" />
            View Details
          </DropdownMenuItem>

          {user.store?.status !== "active" && (
            <DropdownMenuItem
              className="gap-2"
              onClick={() => setPendingStatus("active")}
            >
              <BadgeCheck className="h-4 w-4 text-emerald-500" />
              Approve Store
            </DropdownMenuItem>
          )}

          {user.store?.status !== "pending" && (
            <DropdownMenuItem
              className="gap-2 text-blue-600"
              onClick={() => setPendingStatus("pending")}
            >
              <RefreshCcw className="h-4 w-4" />
              Set Pending
            </DropdownMenuItem>
          )}

          {user.store?.status !== "restricted" && (
            <DropdownMenuItem
              className="gap-2 text-yellow-600"
              onClick={() => setPendingStatus("restricted")}
            >
              <AlertTriangle className="h-4 w-4" />
              Restrict Store
            </DropdownMenuItem>
          )}

          {user.store?.status !== "banned" && (
            <DropdownMenuItem
              className="gap-2 text-red-600"
              onClick={() => setPendingStatus("banned")}
            >
              <Ban className="h-4 w-4" />
              Ban Store
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {cfg && (
        <ConfirmActionDialog
          open={!!pendingStatus}
          onClose={() => setPendingStatus(null)}
          onConfirm={handleConfirm}
          isLoading={isLoading}
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
