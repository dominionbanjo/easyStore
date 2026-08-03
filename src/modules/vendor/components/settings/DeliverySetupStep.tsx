import { useState } from "react";
import { Loader2 } from "lucide-react";
import { TruckFast, ArrowRight } from "iconsax-react";
import { DeliveryLocationsSettings } from "./DeliveryLocationsSettings";
import { Button } from "@/components/ui/button";
import { useGetStoreDeliveryRatesQuery, useUpdateStoreMutation } from "@/services/storeApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { extractErrorMessage } from "@/utils/errorHandler";

export function DeliverySetupStep({ storeId }: { storeId: string }) {
  const { data: rates, isLoading } = useGetStoreDeliveryRatesQuery(storeId, {
    skip: !storeId,
  });
  const [updateStore, { isLoading: isUpdating }] = useUpdateStoreMutation();
  const navigate = useNavigate();

  const [completing, setCompleting] = useState(false);

  const handleCompleteSetup = async () => {
    if (!rates || rates.length === 0) {
      toast.error("You must add at least one delivery location to complete setup.");
      return;
    }

    try {
      setCompleting(true);
      const formData = new FormData();
      formData.append("setup_stage", "5");

      await updateStore({ id: storeId, data: formData }).unwrap();
      
      toast.success("Store setup complete! Welcome to your dashboard.");
      navigate("/products?setup=success");
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to finalize store setup"));
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-black uppercase tracking-widest text-[var(--theme-primary)] flex items-center gap-2">
          <TruckFast className="w-6 h-6" variant="Bold" color="currentColor" />
          Delivery Coverage
        </h2>
        <p className="text-sm font-medium text-muted-foreground/80 mt-1">
          Add regions where you can deliver products. You must specify at least one location to start selling.
        </p>
      </div>

      <DeliveryLocationsSettings storeId={storeId} />

      <div className="pt-6 border-t border-border/40 flex justify-end">
        <Button
          onClick={handleCompleteSetup}
          disabled={isLoading || isUpdating || completing}
          className="h-12 px-8 font-black uppercase tracking-widest text-[10px] rounded-sm bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20"
        >
          {isUpdating || completing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <ArrowRight className="w-4 h-4 mr-2" variant="Bold" color="currentColor" />
          )}
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
