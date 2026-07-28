import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Eye, EyeOff } from "lucide-react";
import { useInviteStaffMutation } from "@/services/staffApi";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteStaffModal({ open, onOpenChange }: Props) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [setPasswordManually, setSetPasswordManually] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [invite, { isLoading }] = useInviteStaffMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const payload: any = { email, first_name: firstName, last_name: lastName };
      if (setPasswordManually && password) {
        payload.password = password;
      }
      await invite(payload).unwrap();
      toast.success(setPasswordManually ? "Staff account created" : "Invite sent successfully");
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setSetPasswordManually(false);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send invite");
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Invite Staff Member" description={setPasswordManually ? "Set a password for the new staff member." : "They will receive an email with login instructions and a temporary password."} contentClassName="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff@example.com" required />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSetPasswordManually(!setPasswordManually)}
            className={`flex items-center gap-2 text-xs font-medium transition-colors ${setPasswordManually ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Key className="h-3.5 w-3.5" />
            {setPasswordManually ? "Use auto-generated password instead" : "Set password manually"}
          </button>
        </div>

        {setPasswordManually && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password"
                required={setPasswordManually}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{setPasswordManually ? "Create Staff" : "Send Invite"}</Button>
        </div>
      </form>
    </Modal>
  );
}
