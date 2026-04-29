import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Plus, CheckCircle2, Loader2 } from "lucide-react";
import { useGetUserProfileQuery } from "@/services/userApi";
import { Button } from "@/components/ui/button";

interface SelectAddressModalProps {
  open: boolean;
  onClose: () => void;
  selectedAddressId?: string | null;
  onSelect: (address: any) => void;
  onGoToCreate: () => void; // Triggered when they click 'Add New Address'
}

export function SelectAddressModal({
  open,
  onClose,
  selectedAddressId,
  onSelect,
  onGoToCreate,
}: SelectAddressModalProps) {
  const { data: userProfile, isLoading } = useGetUserProfileQuery(undefined, {
    skip: !open,
  });

  const addresses = userProfile?.data?.user?.addresses || [];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background">
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle className="text-xl font-black uppercase tracking-tight">
            Select Delivery Location
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-medium">
            Choose where you'd like your order delivered.
          </p>
        </DialogHeader>

        <div className="p-6 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-60">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Loading Addresses...
              </p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-70">
              <MapPin className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm font-semibold text-foreground">No addresses found</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                You haven't added any shipping locations yet.
              </p>
            </div>
          ) : (
            addresses.map((addr: any) => {
              const isSelected = selectedAddressId
                ? addr.id === selectedAddressId
                : addr.is_default; // fallback to default if none strictly selected

              return (
                <div
                  key={addr.id}
                  onClick={() => {
                    onSelect(addr);
                    onClose();
                  }}
                  className={`relative p-4 rounded-sm border cursor-pointer transition-all hover:border-primary/50 ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border/40 bg-card hover:bg-muted/30"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}

                  <div className="flex gap-4 items-start">
                    <div
                      className={`p-2 rounded-full mt-0.5 ${
                        isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="pr-8">
                      <p className="text-sm font-bold text-foreground capitalize mb-0.5">
                        {addr.street}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {addr.city}, {addr.state}
                      </p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 mt-2">
                        {addr.country} {addr.postal_code ? `• ${addr.postal_code}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t bg-muted/10">
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-dashed border-2 hover:border-primary/50 text-foreground"
            onClick={() => {
              onClose();
              onGoToCreate();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
