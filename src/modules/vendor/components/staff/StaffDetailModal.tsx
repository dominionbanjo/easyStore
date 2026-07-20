import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useGetStaffQuery, useUpdateStaffMutation, useSuspendStaffMutation, useUnsuspendStaffMutation, useResetStaffPasswordMutation, useRemoveStaffMutation } from "@/services/staffApi";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Props {
  staffId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaffDetailModal({ staffId, open, onOpenChange }: Props) {
  const { data: staff, isLoading } = useGetStaffQuery(staffId!, { skip: !staffId });
  const [updateStaff] = useUpdateStaffMutation();
  const [suspend] = useSuspendStaffMutation();
  const [unsuspend] = useUnsuspendStaffMutation();
  const [resetPassword] = useResetStaffPasswordMutation();
  const [remove] = useRemoveStaffMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editing, setEditing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  if (staff && !editing && (firstName !== staff.user.first_name || lastName !== staff.user.last_name)) {
    setFirstName(staff.user.first_name);
    setLastName(staff.user.last_name);
  }

  const handleUpdate = async () => {
    if (!staffId) return;
    try {
      await updateStaff({ id: staffId, data: { first_name: firstName, last_name: lastName } }).unwrap();
      toast.success("Staff updated");
      setEditing(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handleAction = async (action: string) => {
    if (!staffId) return;
    try {
      switch (action) {
        case "suspend": await suspend(staffId).unwrap(); toast.success("Staff suspended"); break;
        case "unsuspend": await unsuspend(staffId).unwrap(); toast.success("Staff unsuspended"); break;
        case "reset-password": await resetPassword(staffId).unwrap(); toast.success("Password reset email sent"); break;
        case "remove": await remove(staffId).unwrap(); toast.success("Staff removed"); onOpenChange(false); break;
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Action failed");
    }
    setConfirmAction(null);
  };

  if (isLoading || !staff) {
    return <Modal open={open} onOpenChange={onOpenChange} title="Staff Details"><div className="py-8 text-center text-muted-foreground">Loading...</div></Modal>;
  }

  const isActive = staff.status === "active";

  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange} title="Staff Details" description={`${staff.user.first_name} ${staff.user.last_name}`} contentClassName="p-6">
        <div className="space-y-4">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                <Button onClick={handleUpdate}>Save</Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{staff.user.email}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant={isActive ? "success" : "destructive" as any}>{staff.status}</Badge></div>
                <div><span className="text-muted-foreground">Added:</span> <span>{new Date(staff.created_at).toLocaleDateString()}</span></div>
                <div><span className="text-muted-foreground">Last Login:</span> <span>{staff.last_login_at ? new Date(staff.last_login_at).toLocaleDateString() : "Never"}</span></div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <Button variant="outline" className="w-full" onClick={() => setEditing(true)}>Edit Profile</Button>
                {isActive ? (
                  <Button variant="outline" className="w-full text-amber-600" onClick={() => setConfirmAction("suspend")}>Suspend</Button>
                ) : (
                  <Button variant="outline" className="w-full text-green-600" onClick={() => setConfirmAction("unsuspend")}>Unsuspend</Button>
                )}
                <Button variant="outline" className="w-full" onClick={() => setConfirmAction("reset-password")}>Reset Password</Button>
                <Button variant="destructive" className="w-full" onClick={() => setConfirmAction("remove")}>Remove Staff</Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
        onConfirm={() => handleAction(confirmAction!)}
        title={
          confirmAction === "suspend" ? "Suspend Staff?" :
          confirmAction === "unsuspend" ? "Unsuspend Staff?" :
          confirmAction === "reset-password" ? "Reset Password?" :
          "Remove Staff?"
        }
        description={
          confirmAction === "suspend" ? "They will not be able to access the dashboard until unsuspended." :
          confirmAction === "unsuspend" ? "They will regain access to the dashboard." :
          confirmAction === "reset-password" ? "A new temporary password will be sent to their email." :
          "This action cannot be undone. The staff member will be removed from your store."
        }
        variant={confirmAction === "remove" ? "destructive" : "warning"}
      />
    </>
  );
}
