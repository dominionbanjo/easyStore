import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { FormTextarea } from "@/components/shared/form/FormTextarea";
import { FormDateTimePicker } from "@/components/shared/form/FormDateTimePicker";
import { FormTimePicker } from "@/components/shared/form/FormTimePicker";
import { FormMultiSelect } from "@/components/shared/form/FormMultiSelect";
import { 
  useCreateAdminAutomatedNotificationMutation, 
  useUpdateAdminAutomatedNotificationMutation,
  useGetAdminUsersQuery,
} from "@/services/adminApi";
import type { IAutomatedNotification } from "@/services/adminApi";
import { toast } from "sonner";
import { Search, X, User as UserIcon, Calendar, Bell, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { extractErrorMessage } from "@/utils/errorHandler";

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification?: IAutomatedNotification | null;
}

interface NotificationFormValues {
  title: string;
  message: string;
  type: "system" | "vendor" | "user" | "alert" | "announcement";
  target: "all" | "vendors" | "users" | "specific";
  scheduled_at: string;
  is_recurring: boolean;
  recurrence_type: "daily" | "weekly" | "monthly";
  recurrence_days: string[];
  recurrence_time: string;
  recurrence_day_of_month: string[];
}

export function NotificationDialog({ open, onOpenChange, notification }: NotificationDialogProps) {
  const methods = useForm<NotificationFormValues>({
    defaultValues: {
      title: "",
      message: "",
      type: "system",
      target: "all",
      scheduled_at: "",
      is_recurring: false,
      recurrence_type: "daily",
      recurrence_days: [],
      recurrence_time: "12:00",
      recurrence_day_of_month: [],
    }
  });

  const { watch, reset, handleSubmit: hookHandleSubmit } = methods;
  const target = watch("target");
  const isRecurring = watch("is_recurring");
  const recurrenceType = watch("recurrence_type");
  const scheduledAt = watch("scheduled_at");

  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");

  const [createNotification, { isLoading: isCreating }] = useCreateAdminAutomatedNotificationMutation();
  const [updateNotification, { isLoading: isUpdating }] = useUpdateAdminAutomatedNotificationMutation();

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (notification) {
      reset({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        target: notification.target,
        scheduled_at: notification.scheduled_at ? new Date(notification.scheduled_at).toISOString() : "",
        is_recurring: notification.is_recurring || false,
        recurrence_type: notification.recurrence_type || "daily",
        recurrence_days: notification.recurrence_days || [],
        recurrence_time: notification.recurrence_time || "12:00",
        recurrence_day_of_month: notification.recurrence_day_of_month || [],
      });
      setSelectedEmails(notification.recipients || []);
    } else {
      reset({
        title: "",
        message: "",
        type: "system",
        target: "all",
        scheduled_at: "",
        is_recurring: false,
        recurrence_type: "daily",
        recurrence_days: [],
        recurrence_time: "12:00",
        recurrence_day_of_month: [],
      });
      setSelectedEmails([]);
    }
  }, [notification, reset, open]);
  
  const { data: usersData } = useGetAdminUsersQuery(
    { search: userSearch, limit: 10 },
    { skip: target !== "specific" || userSearch.length < 2 }
  );

  const onSubmit = async (data: NotificationFormValues) => {
    if (data.target === "specific" && selectedEmails.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    const payload = {
      title: data.title,
      message: data.message,
      type: data.type,
      target: data.target,
      recipients: data.target === "specific" ? selectedEmails : null,
      scheduled_at: data.is_recurring ? null : (data.scheduled_at || null),
      is_recurring: data.is_recurring,
      recurrence_type: data.is_recurring ? data.recurrence_type : null,
      recurrence_days: (data.is_recurring && data.recurrence_type === "weekly") ? data.recurrence_days : null,
      recurrence_time: data.is_recurring ? data.recurrence_time : null,
      recurrence_day_of_month: (data.is_recurring && data.recurrence_type === "monthly") ? data.recurrence_day_of_month : null,
    };

    try {
      if (notification) {
        await updateNotification({ id: notification.id, data: payload }).unwrap();
        toast.success("Notification updated successfully");
      } else {
        await createNotification(payload).unwrap();
        toast.success("Notification created successfully");
      }
      
      onOpenChange(false);
      reset();
      setSelectedEmails([]);
      setUserSearch("");
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to save notification"));
    }
  };

  const toggleUserEmail = (email: string) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter(e => e !== email));
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={notification ? "Edit Alert" : "Create New Alert"}
      description={notification ? "Update your automated notification." : "Create a system alert or platform announcement."}
      className="sm:max-w-[650px]"
      footer={
        <div className="flex items-center justify-end gap-3 p-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={hookHandleSubmit(onSubmit)} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Bell className="h-4 w-4" />
                {scheduledAt || isRecurring ? (notification ? "Save Changes" : "Schedule") : (notification ? "Save Changes" : "Post Now")}
              </>
            )}
          </Button>
        </div>
      }
    >
      <FormProvider {...methods}>
        <form className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-6">
            <FormSelect
              label="Category"
              name="type"
              options={[
                { label: "System", value: "system" },
                { label: "Alert", value: "alert" },
                { label: "Promo", value: "announcement" },
              ]}
            />
            <FormSelect
              label="Target Group"
              name="target"
              options={[
                { label: "All Users", value: "all" },
                { label: "Vendors Only", value: "vendors" },
                { label: "Customers Only", value: "users" },
                { label: "Specific Users", value: "specific" },
              ]}
            />
          </div>

          {target === "specific" && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
              <label className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                <UserIcon className="h-4 w-4" /> Recipients
              </label>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  placeholder="Search..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="flex h-10 w-full rounded-sm border border-muted-foreground/10 bg-muted/20 pl-9 pr-3 text-sm focus:bg-background transition-colors outline-none"
                />
              </div>

              {userSearch.length >= 2 && usersData?.data?.items && (
                <div className="max-h-40 overflow-y-auto border rounded-md bg-background divide-y ez-slim-scrollbar">
                  {usersData.data.items.map((user) => (
                    <div 
                      key={user.id}
                      className={cn(
                        "p-2 hover:bg-muted cursor-pointer flex items-center justify-between text-sm",
                        selectedEmails.includes(user.email) && "bg-primary/5"
                      )}
                      onClick={() => toggleUserEmail(user.email)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-xs truncate max-w-[120px] uppercase">{user.first_name}</span>
                        <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{user.email}</span>
                      </div>
                      <Check className={cn("h-4 w-4 text-primary", !selectedEmails.includes(user.email) && "opacity-0")} />
                    </div>
                  ))}
                </div>
              )}

              {selectedEmails.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedEmails.map(email => (
                    <Badge key={email} variant="outline" className="gap-1 pr-1 font-normal text-[10px] py-0 border-primary text-primary">
                      {email.split('@')[0]}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleUserEmail(email)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 p-5 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Scheduling & Recurrence
              </label>
              <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Is Recurring</span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    {...methods.register("is_recurring")}
                  />
              </div>
            </div>

            {!isRecurring ? (
              <div className="grid grid-cols-1 md:grid-cols-2">
                <FormDateTimePicker
                  label="Execution Time"
                  name="scheduled_at"
                  minDate={new Date()}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormTimePicker
                    label="Daily Time"
                    name="recurrence_time"
                  />
                  <FormSelect
                    label="Repeat Interval"
                    name="recurrence_type"
                    options={[
                      { label: "Daily", value: "daily" },
                      { label: "Weekly", value: "weekly" },
                      { label: "Monthly", value: "monthly" },
                    ]}
                  />
                  
                  {recurrenceType === "weekly" && (
                    <FormMultiSelect
                      label="Repeat Days"
                      name="recurrence_days"
                      placeholder="Select days..."
                      options={[
                        { label: "Sun", value: "0" },
                        { label: "Mon", value: "1" },
                        { label: "Tue", value: "2" },
                        { label: "Wed", value: "3" },
                        { label: "Thu", value: "4" },
                        { label: "Fri", value: "5" },
                        { label: "Sat", value: "6" },
                      ]}
                    />
                  )}

                  {recurrenceType === "monthly" && (
                    <FormMultiSelect
                      label="Days of Month"
                      name="recurrence_day_of_month"
                      placeholder="Select days..."
                      options={Array.from({ length: 31 }, (_, i) => i + 1).map((d) => ({
                        label: d === 1 ? '1st' : d === 2 ? '2nd' : d === 3 ? '3rd' : `${d}th`,
                        value: d.toString()
                      }))}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <FormInput
            name="title"
            label="Alert Title"
            placeholder="What's this alert about?"
            rules={{ required: "Title is required" }}
          />

          <FormTextarea
            name="message"
            label="Notification message"
            placeholder="Enter the alert content..."
            rows={4}
            rules={{ required: "Message is required" }}
          />
        </form>
      </FormProvider>
    </Modal>
  );
}
