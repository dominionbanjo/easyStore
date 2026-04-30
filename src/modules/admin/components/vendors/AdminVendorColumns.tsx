import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  MoreVertical,
  BadgeCheck,
  Ban,
  AlertTriangle,
  UserSearch,
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
import { useUpdateAdminVendorStatusMutation } from "@/services/adminApi";
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

const VendorRowActions = ({
  user,
  onViewDetails,
}: {
  user: IAdminUser;
  onViewDetails: (id: string) => void;
}) => {
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
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update store status");
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
        <div className="flex items-center gap-3 text-left">
          <div className="h-9 w-9 rounded-sm bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden border border-border/20">
            {store?.logo ? (
              <img
                src={store.logo}
                alt={store.store_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Store className="h-5 w-5 text-muted-foreground/50" />
            )}
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-sm text-foreground tracking-tight">
              {store?.store_name || "No Store"}
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
        <div className="text-left">
          <p className="text-sm font-bold text-foreground">
            {`${first} ${last}`.trim() || "Unknown"}
          </p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "store.status",
    header: "Store Status",
    cell: ({ row }) => {
      const status = row.original.store?.status || "pending";
      return (
        <span
          className={cn(
            "px-2 py-1 rounded-sm text-xs font-semibold",
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
