import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  MoreVertical,
  BadgeCheck,
  Ban,
  AlertTriangle,
  UserSearch,
  CheckCircle2,
  RefreshCcw,
  Store,
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

type StatusKey = "active" | "pending" | "restricted" | "banned";

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
    title: "Approve Vendor",
    description:
      "This vendor's store and products will become publicly visible. Their account will be set to active.",
    label: "Approve",
    variant: "default",
  },
  pending: {
    title: "Set Vendor Pending",
    description:
      "This will move the vendor back to a pending state, hiding their store from public.",
    label: "Set Pending",
    variant: "outline",
  },
  restricted: {
    title: "Restrict Vendor",
    description:
      "This vendor can still log in but cannot add new products. Existing products remain hidden.",
    label: "Restrict",
    variant: "outline",
  },
  banned: {
    title: "Ban Vendor",
    description:
      "This vendor will be immediately logged out and blocked from signing in. Their store will be hidden.",
    label: "Ban Vendor",
    variant: "destructive",
  },
};

const VendorRowActions = ({
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
      toast.success(`Vendor marked as ${pendingStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update vendor status");
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

          {user.account_status !== "active" && (
            <DropdownMenuItem
              className="gap-2"
              onClick={() => setPendingStatus("active")}
            >
              <BadgeCheck className="h-4 w-4 text-emerald-500" />
              Approve Vendor
            </DropdownMenuItem>
          )}

          {user.account_status !== "pending" && (
            <DropdownMenuItem
              className="gap-2 text-blue-600"
              onClick={() => setPendingStatus("pending")}
            >
              <RefreshCcw className="h-4 w-4" />
              Set Pending
            </DropdownMenuItem>
          )}

          {user.account_status !== "restricted" && (
            <DropdownMenuItem
              className="gap-2 text-yellow-600"
              onClick={() => setPendingStatus("restricted")}
            >
              <AlertTriangle className="h-4 w-4" />
              Restrict Store
            </DropdownMenuItem>
          )}

          {user.account_status !== "banned" ? (
            <DropdownMenuItem
              className="gap-2 text-red-600"
              onClick={() => setPendingStatus("banned")}
            >
              <Ban className="h-4 w-4" />
              Ban Vendor
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="gap-2 text-emerald-600"
              onClick={() => setPendingStatus("active")}
            >
              <CheckCircle2 className="h-4 w-4" />
              Unban Vendor
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

export const buildAdminVendorColumns = (
  onViewDetails: (id: string) => void,
): ColumnDef<IAdminUser>[] => [
  {
    accessorKey: "store_name",
    header: () => (
      <div className="text-left font-bold text-foreground">Store</div>
    ),
    cell: ({ row }) => {
      const store = row.original.store;
      return (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
            {store?.logo ? (
              <img
                src={store.logo}
                alt={store.store_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Store className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">
              {store?.store_name || "No Store"}
            </p>
            <p className="text-xs text-muted-foreground">
              {store?.category || "—"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "owner",
    header: () => (
      <div className="text-left font-bold text-foreground">Owner</div>
    ),
    cell: ({ row }) => {
      const first = row.original.first_name || "";
      const last = row.original.last_name || "";
      return (
        <div>
          <p className="text-sm font-medium">
            {`${first} ${last}`.trim() || "Unknown"}
          </p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      );
    },
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
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const store = row.original.store;
      return (
        <span className="text-sm text-muted-foreground">
          {[store?.address_city, store?.address_state, store?.address_country]
            .filter(Boolean)
            .join(", ") || "—"}
        </span>
      );
    },
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
        <VendorRowActions user={row.original} onViewDetails={onViewDetails} />
      </div>
    ),
  },
];
