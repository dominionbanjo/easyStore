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
  useCreateAdminBroadcastMutation, 
  useUpdateAdminBroadcastMutation,
  useGetAdminUsersQuery,
} from "@/services/adminApi";
import type { IBroadcast } from "@/services/adminApi";
import { toast } from "sonner";
import { Search, X, User as UserIcon, Calendar, Send, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BroadcastDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  broadcast?: IBroadcast | null;
}

export function BroadcastDialog({ open, onOpenChange, broadcast }: BroadcastDialogProps) {
  const methods = useForm({
    defaultValues: {
      subject: "",
      body: "",
      target: "all" as "all" | "vendors" | "users" | "specific",
      scheduledAt: "",
      is_recurring: false,
      recurrence_type: "daily" as any,
      recurrence_days: [] as string[],
      recurrence_time: "12:00",
      recurrence_day_of_month: [] as string[],
    }
  });

  const { watch, reset, handleSubmit: hookHandleSubmit } = methods;
  const target = watch("target");
  const isRecurring = watch("is_recurring");
  const recurrenceType = watch("recurrence_type");
  const scheduledAt = watch("scheduledAt");

  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");

  const [createBroadcast, { isLoading: isCreating }] = useCreateAdminBroadcastMutation();
  const [updateBroadcast, { isLoading: isUpdating }] = useUpdateAdminBroadcastMutation();

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (broadcast) {
      reset({
        subject: broadcast.subject,
        body: broadcast.body,
        target: broadcast.target,
        scheduledAt: broadcast.scheduled_at ? new Date(broadcast.scheduled_at).toISOString() : "",
        is_recurring: broadcast.is_recurring || false,
        recurrence_type: broadcast.recurrence_type || "daily",
        recurrence_days: broadcast.recurrence_days || [],
        recurrence_time: broadcast.recurrence_time || "12:00",
        recurrence_day_of_month: broadcast.recurrence_day_of_month || [],
      });
      setSelectedEmails(broadcast.recipients || []);
    } else {
      reset({
        subject: "",
        body: "",
        target: "all",
        scheduledAt: "",
        is_recurring: false,
        recurrence_type: "daily",
        recurrence_days: [],
        recurrence_time: "12:00",
        recurrence_day_of_month: [],
      });
      setSelectedEmails([]);
    }
  }, [broadcast, reset, open]);
  
  const { data: usersData } = useGetAdminUsersQuery(
    { search: userSearch, limit: 10 },
    { skip: target !== "specific" || userSearch.length < 2 }
  );

  const onSubmit = async (data: any) => {
    if (data.target === "specific" && selectedEmails.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    const payload = {
      subject: data.subject,
      body: data.body,
      target: data.target,
      recipients: data.target === "specific" ? selectedEmails : null,
      scheduled_at: data.is_recurring ? null : (data.scheduledAt || null),
      is_recurring: data.is_recurring,
      recurrence_type: data.is_recurring ? data.recurrence_type : null,
      recurrence_days: (data.is_recurring && data.recurrence_type === "weekly") ? data.recurrence_days : null,
      recurrence_time: data.is_recurring ? data.recurrence_time : null,
      recurrence_day_of_month: (data.is_recurring && data.recurrence_type === "monthly") ? data.recurrence_day_of_month : null,
    };

    try {
      if (broadcast) {
        await updateBroadcast({ id: broadcast.id, data: payload }).unwrap();
        toast.success("Broadcast updated successfully");
      } else {
        await createBroadcast(payload).unwrap();
        toast.success("Broadcast created successfully");
      }
      
      onOpenChange(false);
      reset();
      setSelectedEmails([]);
      setUserSearch("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save broadcast");
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
      title={broadcast ? "Edit Broadcast" : "Create New Broadcast"}
      description={broadcast ? "Update your scheduled broadcast." : "Send a platform-wide email or schedule one for later."}
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
                <Send className="h-4 w-4" />
                {scheduledAt || isRecurring ? (broadcast ? "Save Changes" : "Schedule") : (broadcast ? "Save Changes" : "Send Now")}
              </>
            )}
          </Button>
        </div>
      }
    >
      <FormProvider {...methods}>
        <form className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Recipient Group"
              name="target"
              options={[
                { label: "All Users & Vendors", value: "all" },
                { label: "Vendors Only", value: "vendors" },
                { label: "Users Only", value: "users" },
                { label: "Specific Recipients", value: "specific" },
              ]}
            />
          </div>

          {target === "specific" && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
              <label className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                <UserIcon className="h-4 w-4" /> Select Recipients
              </label>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="flex h-10 w-full rounded-sm border border-muted-foreground/10 bg-muted/20 pl-9 pr-3 text-sm focus:bg-background transition-colors outline-none"
                />
              </div>

              {userSearch.length >= 2 && usersData?.data?.items && (
                <div className="max-h-40 overflow-y-auto border rounded-md bg-background divide-y slim-scrollbar">
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
                        <span className="font-medium text-xs truncate max-w-[150px] uppercase">{user.first_name} {user.last_name}</span>
                        <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{user.email}</span>
                      </div>
                      <Check className={cn("h-4 w-4 text-primary", !selectedEmails.includes(user.email) && "opacity-0")} />
                    </div>
                  ))}
                </div>
              )}

              {selectedEmails.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedEmails.map(email => (
                    <Badge key={email} variant="secondary" className="gap-1 pr-1 font-normal text-[10px] py-0">
                      {email.split('@')[0]}
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => toggleUserEmail(email)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 p-5 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Recurrence & Schedule
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Enabled</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  {...methods.register("is_recurring")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!isRecurring ? (
                <FormDateTimePicker
                  label="Schedule Time"
                  name="scheduledAt"
                  minDate={new Date()}
                />
              ) : (
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormTimePicker
                      label="Time"
                      name="recurrence_time"
                    />
                    <FormSelect
                      label="Interval"
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
                      <div className="col-span-1">
                        <FormMultiSelect
                          label="Days of Month"
                          name="recurrence_day_of_month"
                          placeholder="Select days..."
                          options={Array.from({ length: 31 }, (_, i) => i + 1).map((d) => ({
                            label: d === 1 ? '1st' : d === 2 ? '2nd' : d === 3 ? '3rd' : `${d}th`,
                            value: d.toString()
                          }))}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <FormInput
            name="subject"
            label="Email Subject"
            placeholder="Enter the subject line..."
            rules={{ required: "Subject is required" }}
          />

          <FormTextarea
            name="body"
            label="Message Body"
            placeholder="Enter your message here..."
            rows={5}
            rules={{ required: "Message is required" }}
          />
        </form>
      </FormProvider>
    </Modal>
  );
}
