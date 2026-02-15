import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressData: {
    address_street: string;
    address_city: string;
    address_state: string;
    address_country: string;
    address_postal_code: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AddressModal({
  open,
  onOpenChange,
  addressData,
  onChange,
}: AddressModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px] rounded-[1.5rem] sm:rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 sm:p-8 bg-muted/30">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Building className="text-primary w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-black">
            Store Location
          </DialogTitle>
          <DialogDescription>
            Where is your business located? This helps buyers find you.
          </DialogDescription>
        </DialogHeader>
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <Label>Street Address</Label>
            <Input
              name="address_street"
              value={addressData.address_street}
              onChange={onChange}
              className="h-11 rounded-xl"
              placeholder="e.g. 12 Main St, Ikeja"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                name="address_city"
                value={addressData.address_city}
                onChange={onChange}
                className="h-11 rounded-xl"
                placeholder="Lagos"
              />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input
                name="address_state"
                value={addressData.address_state}
                onChange={onChange}
                className="h-11 rounded-xl"
                placeholder="Lagos State"
              />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input
                name="address_country"
                value={addressData.address_country}
                onChange={onChange}
                className="h-11 rounded-xl"
                placeholder="Nigeria"
              />
            </div>
            <div className="space-y-2">
              <Label>Postal Code</Label>
              <Input
                name="address_postal_code"
                value={addressData.address_postal_code}
                onChange={onChange}
                className="h-11 rounded-xl"
                placeholder="100001"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="p-8 pt-0 flex gap-2">
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-full px-8 bg-primary shadow-lg shadow-primary/20"
            onClick={() => onOpenChange(false)}
          >
            Keep Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
