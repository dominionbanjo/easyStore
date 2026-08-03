import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function StaffSettingsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/staff/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${document.cookie.match(/token=([^;]+)/)?.[1]}` },
        body: JSON.stringify({ first_name: firstName || undefined, last_name: lastName || undefined, phone_number: phone || undefined }),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
    setSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Fill in both password fields");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/staff/me/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${document.cookie.match(/token=([^;]+)/)?.[1]}` },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      if (!res.ok) throw new Error((await res.json())?.message || "Failed");
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to change password");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and security</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234..." />
          </div>
          <Button type="submit" isLoading={saving}>Save Changes</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <Button type="submit" isLoading={saving}>Change Password</Button>
        </form>
      </Card>
    </div>
  );
}
