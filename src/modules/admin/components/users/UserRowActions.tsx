import { useState } from "react";
import {
  MoreVertical,
  AlertTriangle,
  Ban,
  UserSearch,
  CheckCircle2,
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
import { useUpdateAdminUserStatusMutation } from "@/services/adminApi";
import { toast } from "sonner";
import { ConfirmActionDialog } from "../shared/ConfirmActionDialog";
import { extractErrorMessage } from "@/utils/errorHandler";

type StatusKey = "active" | "restricted" | "banned";

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
    title: "Activate User",
    description: "This will restore full access for this user.",
    label: "Activate",
    variant: "default",
  },
  restricted: {
    title: "Restrict Account",
    description:
      "This user will still be able to log in but cannot add products or perform vendor actions.",
    label: "Restrict",
    variant: "outline",
  },
  banned: {
    title: "Ban User",
    description:
      "This user will be immediately logged out and blocked from signing in. This action can be reversed.",
    label: "Ban User",
    variant: "destructive",
  },
};

export function UserRowActions({
  user,
  onViewDetails,
}: {
  user: IAdminUser;
  onViewDetails: (id: string) => void;
}) {
  const [pendingStatus, setPendingStatus] = useState<StatusKey | null>(null);
  const [updateStatus, { isLoading }] = useUpdateAdminUserStatusMutation();

  const handleConfirm = async () => {
    if (!pendingStatus) return;
    try {
      await updateStatus({ userId: user.id, status: pendingStatus }).unwrap();
      toast.success(`User marked as ${pendingStatus}`);
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to update status"));
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
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="gap-2"
            onClick={() => onViewDetails(user.id)}
          >
            <UserSearch className="h-4 w-4 text-blue-500" />
            View Details
          </DropdownMenuItem>

          {user.account_status !== "active" && (
            <DropdownMenuItem
              className="gap-2"
              onClick={() => setPendingStatus("active")}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Set Active
            </DropdownMenuItem>
          )}

          {user.account_status !== "restricted" && (
            <DropdownMenuItem
              className="gap-2 text-yellow-600"
              onClick={() => setPendingStatus("restricted")}
            >
              <AlertTriangle className="h-4 w-4" />
              Restrict Account
            </DropdownMenuItem>
          )}

          {user.account_status !== "banned" ? (
            <DropdownMenuItem
              className="gap-2 text-red-600"
              onClick={() => setPendingStatus("banned")}
            >
              <Ban className="h-4 w-4" />
              Ban User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="gap-2 text-emerald-600"
              onClick={() => setPendingStatus("active")}
            >
              <RefreshCcw className="h-4 w-4" />
              Unban User
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
