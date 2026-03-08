import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  MoreVertical,
  ShieldCheck,
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
import { cn } from "@/lib/utils";
import type { IAdminUser } from "@/services/adminApi";
import { useUpdateAdminUserStatusMutation } from "@/services/adminApi";
import { toast } from "sonner";
import { ConfirmActionDialog } from "../shared/ConfirmActionDialog";

type StatusKey = "active" | "restricted" | "banned";

const statusColors: Record<string, string> = {
  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  restricted:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  banned: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  pending: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
};

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

const UserRowActions = ({
  user,
  onViewDetails,
}: {
  user: IAdminUser;
  onViewDetails: (id: string) => void;
}) => {
  const [pendingStatus, setPendingStatus] = useState<StatusKey | null>(null);
  const [updateStatus, { isLoading }] = useUpdateAdminUserStatusMutation();

  const handleConfirm = async () => {
    if (!pendingStatus) return;
    try {
      await updateStatus({ userId: user.id, status: pendingStatus }).unwrap();
      toast.success(`User marked as ${pendingStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
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
};

export const buildAdminUserColumns = (
  onViewDetails: (id: string) => void,
): ColumnDef<IAdminUser>[] => [
  {
    accessorKey: "name",
    header: () => (
      <div className="text-left font-bold text-foreground">User details</div>
    ),
    cell: ({ row }) => {
      const first = row.original.first_name || "";
      const last = row.original.last_name || "";
      const name = `${first} ${last}`.trim();
      return (
        <div className="text-left">
          <p className="font-semibold text-sm">{name || "Anonymous User"}</p>
          <p className="text-xs text-muted-foreground">
            @{row.original.username || "—"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => (
      <div className="text-left font-bold text-foreground">Email</div>
    ),
    cell: ({ row }) => (
      <div className="text-left">
        <span className="text-sm text-muted-foreground">
          {row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "account_type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize text-sm">{row.original.account_type}</span>
    ),
  },
  {
    accessorKey: "account_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.account_status || "pending";
      return (
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-semibold",
            statusColors[status],
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: "email_verified",
    header: "Verified",
    cell: ({ row }) =>
      row.original.email_verified ? (
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <ShieldCheck className="h-3.5 w-3.5" /> Yes
        </span>
      ) : (
        <span className="flex items-center gap-1 text-muted-foreground text-xs">
          <AlertTriangle className="h-3.5 w-3.5" /> No
        </span>
      ),
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => format(new Date(row.original.created_at), "MMM d, yyyy"),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <UserRowActions user={row.original} onViewDetails={onViewDetails} />
      </div>
    ),
  },
];
