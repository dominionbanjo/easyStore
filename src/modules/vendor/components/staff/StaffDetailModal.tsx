import { useState, useEffect } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Key } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useGetStaffQuery, useUpdateStaffMutation, useSuspendStaffMutation, useUnsuspendStaffMutation, useResetStaffPasswordMutation, useRemoveStaffMutation, useUpdateStaffPermissionsMutation } from "@/services/staffApi";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { extractErrorMessage } from "@/utils/errorHandler";

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
  const [updatePermissions] = useUpdateStaffPermissionsMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editing, setEditing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [canCreateProduct, setCanCreateProduct] = useState(false);
  const [savingPermission, setSavingPermission] = useState(false);
  const [showResetPassModal, setShowResetPassModal] = useState(false);
  const [customPassword, setCustomPassword] = useState("");
  const [showCustomPass, setShowCustomPass] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    if (staff && !editing) {
      setFirstName(staff.user.first_name);
      setLastName(staff.user.last_name);
      setCanCreateProduct(staff.permissions?.includes("product:create") ?? false);
    }
  }, [staff, editing]);

  const handleUpdate = async () => {
    if (!staffId) return;
    try {
      await updateStaff({ id: staffId, data: { first_name: firstName, last_name: lastName } }).unwrap();
      toast.success("Staff updated");
      setEditing(false);
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Update failed"));
    }
  };

  const handleAction = async (action: string) => {
    if (!staffId) return;
    try {
      switch (action) {
        case "suspend": await suspend(staffId).unwrap(); toast.success("Staff suspended"); break;
        case "unsuspend": await unsuspend(staffId).unwrap(); toast.success("Staff unsuspended"); break;
        case "reset-password": await resetPassword({ id: staffId }).unwrap(); toast.success("Password reset email sent"); break;
        case "reset-account": await resetPassword({ id: staffId }).unwrap(); toast.success("Account reset email sent"); break;
        case "remove": await remove(staffId).unwrap(); toast.success("Staff removed"); onOpenChange(false); break;
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Action failed"));
    }
    setConfirmAction(null);
  };

  if (staff && !editing && canCreateProduct === false && staff.permissions?.includes("product:create")) {
    setCanCreateProduct(true);
  }

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
                <div><span className="text-muted-foreground">Status:</span> <Badge variant={isActive ? "outline" : "destructive"}>{staff.status}</Badge></div>
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
                <Button variant="outline" className="w-full" onClick={() => setShowResetPassModal(true)}>Reset Password</Button>
                <Button variant="outline" className="w-full text-amber-600" onClick={() => setConfirmAction("reset-account")}>Reset Account & Send New Password</Button>
                <Button variant="destructive" className="w-full" onClick={() => setConfirmAction("remove")}>Remove Staff</Button>
              </div>

              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-semibold">Permissions</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Can create products</p>
                    <p className="text-xs text-muted-foreground">Staff can add new products to the store</p>
                  </div>
                  <Switch
                    checked={canCreateProduct}
                    disabled={savingPermission}
                    onCheckedChange={async (checked) => {
                      if (!staffId) return;
                      setSavingPermission(true);
                      setCanCreateProduct(checked);
                      try {
                        await updatePermissions({ id: staffId, permissions: checked ? ["product:create"] : [] }).unwrap();
                        toast.success(checked ? "Create product permission granted" : "Create product permission revoked");
                      } catch {
                        setCanCreateProduct(!checked);
                        toast.error("Failed to update permissions");
                      }
                      setSavingPermission(false);
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal open={showResetPassModal} onOpenChange={(open) => { if (!open) { setShowResetPassModal(false); setCustomPassword(""); } }} title="Reset Password" description={`Set a new password for ${staff?.user?.first_name ?? "staff"}.`}>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customPass">New Password</Label>
            <div className="relative">
              <Input
                id="customPass"
                type={showCustomPass ? "text" : "password"}
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                placeholder="Enter a new password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowCustomPass(!showCustomPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCustomPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-3 justify-end border-t pt-4">
            <Button variant="outline" onClick={() => {
              setShowResetPassModal(false);
              setConfirmAction("reset-password");
            }}>
              <Key className="mr-2 h-4 w-4" />
              Send Temp Password
            </Button>
            <Button
              onClick={async () => {
                if (!customPassword || !staffId) return;
                setSavingPass(true);
                try {
                  await resetPassword({ id: staffId, password: customPassword }).unwrap();
                  toast.success("Password updated successfully");
                  setShowResetPassModal(false);
                  setCustomPassword("");
                } catch (err: unknown) {
                  toast.error(extractErrorMessage(err, "Failed to set password"));
                }
                setSavingPass(false);
              }}
              isLoading={savingPass}
              disabled={!customPassword || customPassword.length < 6}
            >
              Set Password
            </Button>
          </div>
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
          confirmAction === "reset-account" ? "Reset Account?" :
          "Remove Staff?"
        }
        description={
          confirmAction === "suspend" ? "They will not be able to access the dashboard until unsuspended." :
          confirmAction === "unsuspend" ? "They will regain access to the dashboard." :
          confirmAction === "reset-password" ? "A new temporary password will be sent to their email." :
          confirmAction === "reset-account" ? "Their account will be reset. They will need to change their password on next login. A new temporary password will be sent to their email." :
          "This action cannot be undone. The staff member will be removed from your store."
        }
        variant={confirmAction === "remove" ? "destructive" : confirmAction === "reset-account" ? "warning" : "warning"}
      />
    </>
  );
}
