import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building, Map, MapPin, Navigation } from "lucide-react";
import { FormInput } from "@/components/shared/form/FormInput";

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddressModal({
  open,
  onOpenChange,
}: AddressModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px] rounded-sm sm:rounded-sm p-0 overflow-hidden">
        <DialogHeader className="p-6 sm:p-8 bg-muted/30 border-b">
          <div className="h-12 w-12 rounded-sm bg-primary/10 flex items-center justify-center mb-4">
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
          <FormInput
            name="address_street"
            label="Street Address"
            placeholder="e.g. 12 Main St, Ikeja"
            icon={<MapPin className="w-4 h-4" />}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="address_city"
              label="City"
              placeholder="Lagos"
              icon={<Map className="w-4 h-4" />}
            />
            <FormInput
              name="address_state"
              label="State"
              placeholder="Lagos State"
              icon={<Navigation className="w-4 h-4" />}
            />
            <FormInput
              name="address_country"
              label="Country"
              placeholder="Nigeria"
            />
            <FormInput
              name="address_postal_code"
              label="Postal Code"
              placeholder="100001"
            />
          </div>
        </div>
        <DialogFooter className="p-8 pt-0 flex gap-2">
          <Button
            variant="ghost"
            className="rounded-sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-sm px-8 bg-primary  "
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
