import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [invite, { isLoading }] = useInviteStaffMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await invite({ email, first_name: firstName, last_name: lastName }).unwrap();
      toast.success("Invite sent successfully");
      setEmail("");
      setFirstName("");
      setLastName("");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send invite");
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Invite Staff Member" description="They will receive an email with login instructions and a temporary password." contentClassName="p-6">
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
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Send Invite</Button>
        </div>
      </form>
    </Modal>
  );
}
