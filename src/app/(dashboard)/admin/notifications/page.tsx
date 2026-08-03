import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import {
  useGetAdminBroadcastsQuery,
  useGetAdminAutomatedNotificationsQuery,
  useDeleteAdminBroadcastMutation,
  useDeleteAdminAutomatedNotificationMutation,
  useToggleAdminAutomatedNotificationStatusMutation,
  type IBroadcast,
  type IAutomatedNotification,
} from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BroadcastDialog } from "@/modules/admin/components/broadcast/BroadcastDialog";
import { NotificationDialog as AdminAutomatedNotificationDialog } from "@/modules/admin/components/broadcast/NotificationDialog";
import { ConfirmActionDialog } from "@/modules/admin/components/shared/ConfirmActionDialog";
import { toast } from "sonner";
import { useDebounce } from "@/hooks";
import { extractErrorMessage } from "@/utils/errorHandler";
import {
  AutomatedAlertCard,
  ManualBroadcastCard,
} from "@/modules/admin/components/notifications/NotificationCards";

export default function SuperAdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState("automated");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Dialog States
  const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false);
  const [isAutomatedDialogOpen, setIsAutomatedDialogOpen] = useState(false);
  const [editingBroadcast, setEditingBroadcast] = useState<
    IBroadcast | undefined
  >();
  const [editingAutomated, setEditingAutomated] = useState<
    IAutomatedNotification | undefined
  >();

  // Confirmation States
  const [pendingDeleteAction, setPendingDeleteAction] = useState<{
    id: string;
    type: "broadcast" | "automated";
  } | null>(null);
  const [pendingStatusToggle, setPendingStatusToggle] =
    useState<IAutomatedNotification | null>(null);

  // Queries
  const { data: broadcasts, isLoading: broadcastsLoading } =
    useGetAdminBroadcastsQuery();
  const { data: automated, isLoading: automatedLoading } =
    useGetAdminAutomatedNotificationsQuery({ search: debouncedSearch });

  // Mutations
  const [deleteBroadcast, { isLoading: isDeletingBroadcast }] =
    useDeleteAdminBroadcastMutation();
  const [deleteAutomated, { isLoading: isDeletingAutomated }] =
    useDeleteAdminAutomatedNotificationMutation();
  const [toggleStatus, { isLoading: isTogglingStatus }] =
    useToggleAdminAutomatedNotificationStatusMutation();

  const handleEditAutomated = (notification: IAutomatedNotification) => {
    setEditingAutomated(notification);
    setIsAutomatedDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteAction) return;

    try {
      if (pendingDeleteAction.type === "broadcast") {
        await deleteBroadcast(pendingDeleteAction.id).unwrap();
        toast.success("Broadcast cancelled and removed");
      } else {
        await deleteAutomated(pendingDeleteAction.id).unwrap();
        toast.success("Automated notification template deleted");
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to delete item"));
    } finally {
      setPendingDeleteAction(null);
    }
  };

  const handleConfirmToggle = async () => {
    if (!pendingStatusToggle) return;

    try {
      const newStatus = !pendingStatusToggle.is_active;
      await toggleStatus({
        id: pendingStatusToggle.id,
        is_active: newStatus,
      }).unwrap();
      toast.success(`Notification ${newStatus ? "activated" : "paused"}`);
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to update status"));
    } finally {
      setPendingStatusToggle(null);
    }
  };

  return (
    <section className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        <div className="flex items-center gap-2">
          {activeTab === "manual" ? (
            <Button
              onClick={() => {
                setEditingBroadcast(undefined);
                setIsBroadcastDialogOpen(true);
              }}
              className="gap-2 font-bold"
            >
              <Plus className="h-4 w-4" /> New Broadcast
            </Button>
          ) : (
            <Button
              onClick={() => {
                setEditingAutomated(undefined);
                setIsAutomatedDialogOpen(true);
              }}
              className="gap-2 font-bold"
            >
              <Plus className="h-4 w-4" /> Create Alert
            </Button>
          )}
        </div>
      </div>

      <Tabs
        defaultValue="automated"
        className="w-full space-y-6"
        onValueChange={setActiveTab}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="automated">Automated Alerts</TabsTrigger>
            <TabsTrigger value="manual">Manual Broadcasts</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full lg:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Automated Alerts */}
        <TabsContent value="automated" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {automatedLoading
              ? [...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))
              : automated?.data?.map((item: IAutomatedNotification) => (
                  <AutomatedAlertCard
                    key={item.id}
                    notification={item}
                    onEdit={handleEditAutomated}
                    onToggle={(n) => setPendingStatusToggle(n)}
                    onDelete={(id) =>
                      setPendingDeleteAction({ id, type: "automated" })
                    }
                    onMarkRead={() => {}}
                    isToggling={isTogglingStatus}
                  />
                ))}
          </div>
        </TabsContent>

        {/* Manual Broadcasts */}
        <TabsContent value="manual" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {broadcastsLoading
              ? [...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))
              : broadcasts?.data?.map((item: IBroadcast) => (
                  <ManualBroadcastCard
                    key={item.id}
                    broadcast={item}
                    onDelete={(id) =>
                      setPendingDeleteAction({ id, type: "broadcast" })
                    }
                    isLoading={isDeletingBroadcast}
                  />
                ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <BroadcastDialog
        open={isBroadcastDialogOpen}
        onOpenChange={() => setIsBroadcastDialogOpen(false)}
        broadcast={editingBroadcast}
      />

      <AdminAutomatedNotificationDialog
        open={isAutomatedDialogOpen}
        onOpenChange={() => setIsAutomatedDialogOpen(false)}
        notification={editingAutomated}
      />

      {/* Confirmations */}
      <ConfirmActionDialog
        open={!!pendingDeleteAction}
        onClose={() => setPendingDeleteAction(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingBroadcast || isDeletingAutomated}
        title="Delete Item"
        description="Are you sure you want to delete this notification?"
        confirmVariant="destructive"
        confirmLabel="Delete"
      />

      <ConfirmActionDialog
        open={!!pendingStatusToggle}
        onClose={() => setPendingStatusToggle(null)}
        onConfirm={handleConfirmToggle}
        isLoading={isTogglingStatus}
        title={
          pendingStatusToggle?.is_active
            ? "Pause Notification"
            : "Resume Notification"
        }
        description={
          pendingStatusToggle?.is_active
            ? "Are you sure you want to pause this automated notification?"
            : "Are you sure you want to resume this automated notification?"
        }
        confirmLabel={pendingStatusToggle?.is_active ? "Pause" : "Resume"}
        confirmVariant={
          pendingStatusToggle?.is_active ? "destructive" : "default"
        }
      />
    </section>
  );
}
