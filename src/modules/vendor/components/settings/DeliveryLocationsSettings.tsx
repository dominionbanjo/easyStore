import { useMemo } from "react";
import { State } from "country-state-city";
import { Trash, TruckFast, Add } from "iconsax-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import {
  useGetStoreDeliveryRatesQuery,
  useAddStoreDeliveryRateMutation,
  useDeleteStoreDeliveryRateMutation,
} from "@/services/storeApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface DeliveryLocationsSettingsProps {
  storeId: string;
}

interface DeliveryRateFormValues {
  stateIsoCode: string;
  location: string;
  fee: number;
  duration: string;
}

export function DeliveryLocationsSettings({
  storeId,
}: DeliveryLocationsSettingsProps) {
  const { data: rates, isLoading } = useGetStoreDeliveryRatesQuery(storeId, {
    skip: !storeId,
  });
  const [addRate, { isLoading: isAdding }] = useAddStoreDeliveryRateMutation();
  const [deleteRate, { isLoading: isDeleting }] =
    useDeleteStoreDeliveryRateMutation();

  const nigerianStates = useMemo(() => {
    return State.getStatesOfCountry("NG").map((s) => ({
      label: s.name,
      value: s.isoCode,
    }));
  }, []);

  const methods = useForm<DeliveryRateFormValues>({
    defaultValues: {
      stateIsoCode: "",
      location: "",
      fee: 0,
      duration: "",
    },
  });

  const { handleSubmit, reset } = methods;

  const onAddLocation = async (values: DeliveryRateFormValues) => {
    const stateName =
      nigerianStates.find((s) => s.value === values.stateIsoCode)?.label || "";

    try {
      await addRate({
        storeId,
        data: {
          state: stateName,
          location: values.location,
          fee: values.fee,
          duration: values.duration || null,
        },
      }).unwrap();

      toast.success("Delivery location added");
      reset();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add delivery location");
    }
  };

  const handleDelete = async (rateId: string) => {
    try {
      await deleteRate(rateId).unwrap();
      toast.success("Delivery location removed");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove location");
    }
  };

  return (
    <Card className="border-border/40 overflow-hidden bg-card/50 backdrop-blur-sm rounded-sm">
      <CardHeader className="bg-muted/30 p-4 sm:p-6 border-b border-border/40">
        <CardTitle className="text-lg font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <TruckFast className="w-5 h-5" variant="Bold" color="currentColor" />{" "}
          Delivery Locations
        </CardTitle>
        <CardDescription className="text-xs font-medium text-muted-foreground/80 mt-1">
          Set up specific delivery rates per region. You must have at least one
          delivery location active.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Existing Rates Table */}
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground pb-2 border-b border-border/40">
            <div className="col-span-3">State</div>
            <div className="col-span-4">Location/City</div>
            <div className="col-span-2">Fee (₦)</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-1 text-right">Ac</div>
          </div>

          {isLoading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : rates?.length === 0 ? (
            <div className="py-8 text-center text-sm font-medium text-muted-foreground/60">
              No delivery locations configured. Add your first region below.
            </div>
          ) : (
            <div className="space-y-3">
              {rates?.map((rate) => (
                <div
                  key={rate.id}
                  className="grid grid-cols-12 gap-2 items-center bg-muted/20 p-3 rounded-sm border border-border/30 text-sm font-medium"
                >
                  <div className="col-span-3 text-emerald-600 dark:text-emerald-400 font-bold font-outfit uppercase tracking-tight text-xs">
                    {rate.state}
                  </div>
                  <div className="col-span-4 truncate text-xs font-bold">
                    {rate.location}
                  </div>
                  <div className="col-span-2 font-black text-xs">
                    ₦{Number(rate.fee).toLocaleString()}
                  </div>
                  <div className="col-span-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    {rate.duration || "-"}
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => handleDelete(rate.id)}
                      disabled={isDeleting}
                      className="text-destructive/60 hover:text-destructive transition-colors p-1"
                    >
                      <Trash
                        className="w-4 h-4"
                        variant="Bold"
                        color="currentColor"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Rate Form */}
        <div className="bg-muted/10 p-4 rounded-sm border border-dashed border-border/60">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-4 ml-1">
            Add New Location
          </h4>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onAddLocation)}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
            >
              <div className="md:col-span-1">
                <FormSelect
                  name="stateIsoCode"
                  label="State"
                  placeholder="Select State"
                  options={nigerianStates}
                  isSearchable
                  className="[&>label]:text-[10px] [&>label]:font-black [&>label]:uppercase [&>label]:tracking-widest [&>label]:text-muted-foreground"
                />
              </div>

              <div className="md:col-span-1">
                <FormInput
                  name="location"
                  label="City / Location"
                  placeholder="e.g. Ikeja"
                  className="[&>label]:text-[10px] [&>label]:font-black [&>label]:uppercase [&>label]:tracking-widest [&>label]:text-muted-foreground"
                />
              </div>

              <div className="md:col-span-1">
                <FormInput
                  name="fee"
                  label="Fee (₦)"
                  type="number"
                  placeholder="2000"
                  className="[&>label]:text-[10px] [&>label]:font-black [&>label]:uppercase [&>label]:tracking-widest [&>label]:text-muted-foreground"
                />
              </div>

              <div className="md:col-span-1">
                <FormInput
                  name="duration"
                  label="Duration (Optional)"
                  placeholder="e.g. 2-3 Days"
                  className="[&>label]:text-[10px] [&>label]:font-black [&>label]:uppercase [&>label]:tracking-widest [&>label]:text-muted-foreground"
                />
              </div>

              <div className="md:col-span-1">
                <Button
                  type="submit"
                  disabled={isAdding}
                  className="w-full h-12 rounded-sm font-black uppercase tracking-widest text-[10px] bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/10"
                >
                  {isAdding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Add
                        className="w-4 h-4 mr-1"
                        variant="Bold"
                        color="currentColor"
                      />{" "}
                      Add Region
                    </>
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </CardContent>
    </Card>
  );
}
