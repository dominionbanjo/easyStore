import * as Dialog from "@radix-ui/react-dialog";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  X,
  MapPin,
  Navigation,
  Building2,
  Compass,
  ShieldCheck,
  Globe,
  Map,
  Hash,
  Loader2,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import {
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
  useAddUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
} from "@/services/userApi";
import { NigeriaData } from "@/utils/nigeria-data";
import {
  EditProfileSchema,
  type EditProfileFormValues,
} from "../../validators/updateProfileValidator";

type Option = { label: string; value: string };

export function AddressRequiredModal({
  open,
  onClose,
  mode = "create",
}: {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
}) {
  // Remove unused dispatch
  // const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { data: userProfile } = useGetUserProfileQuery(undefined, {
    skip: !open,
  });
  const user = userProfile?.data?.user;

  const [countryOptions, setCountryOptions] = useState<Option[]>([]);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [cityOptions, setCityOptions] = useState<Option[]>([]);

  const [addressFormMode, setAddressFormMode] = useState<"add" | "edit" | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [addUserAddress, { isLoading: isAddingAddress }] = useAddUserAddressMutation();
  const [updateUserAddress, { isLoading: isUpdatingAddress }] = useUpdateUserAddressMutation();
  const [deleteUserAddress, { isLoading: isDeletingAddress }] = useDeleteUserAddressMutation();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      address: {
        street: "",
        country: "NG",
        state: "",
        city: "",
        postal_code: "",
      },
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { dirtyFields },
  } = form;

  const countryCode = useWatch({ name: "address.country", control });
  const stateCode = useWatch({ name: "address.state", control });

  /* ───────── PREFILL ON EDIT ───────── */
  useEffect(() => {
    if (!open || !user?.address) return;

    reset({
      address: {
        street: user.address.street ?? "",
        country: user.address.country ?? "",
        state: user.address.state ?? "",
        city: user.address.city ?? "",
        postal_code: user.address.postal_code ?? "",
      },
    });
  }, [open, user, reset]);

  /* LOAD COUNTRIES */
  useEffect(() => {
    if (!open) return;
    setCountryOptions(
      NigeriaData.getCountries().map((c) => ({
        label: c.name,
        value: c.isoCode,
      })),
    );
  }, [open]);

  /* LOAD STATES */
  useEffect(() => {
    if (!countryCode) {
      setStateOptions([]);
      return;
    }

    setStateOptions(
      NigeriaData.getStates().map((s) => ({
        label: s.name,
        value: s.isoCode,
      })),
    );

    // Reset dependent fields ONLY if the user changed the country manually
    if (dirtyFields.address?.country) {
      setValue("address.state", "");
      setValue("address.city", "");
    }
  }, [countryCode, setValue, dirtyFields.address?.country]);

  /* LOAD CITIES */
  useEffect(() => {
    if (!countryCode || !stateCode) {
      setCityOptions([]);
      return;
    }

    setCityOptions(
      NigeriaData.getCities(stateCode).map((c) => ({
        label: c,
        value: c,
      })),
    );

    // Reset dependent fields ONLY if the user changed the state manually
    if (dirtyFields.address?.state) {
      setValue("address.city", "");
    }
  }, [countryCode, stateCode, setValue, dirtyFields.address?.state]);

  const handleSaveAddress = async () => {
    const values = form.getValues().address;
    try {
      if (addressFormMode === "add") {
        await addUserAddress(values).unwrap();
        toast.success("Address added");
      } else if (addressFormMode === "edit" && editingAddressId) {
        await updateUserAddress({ id: editingAddressId, body: values }).unwrap();
        toast.success("Address updated");
      }
      setAddressFormMode(null);
      setEditingAddressId(null);
      reset({ address: { street: "", country: "NG", state: "", city: "", postal_code: "" } });
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to save");
    }
  };

  const handleEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressFormMode("edit");
    reset({
      address: {
        street: addr.street || "",
        country: addr.country || "NG",
        state: addr.state || "",
        city: addr.city || "",
        postal_code: addr.postal_code || "",
      }
    });
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteUserAddress(id).unwrap();
      toast.success("Address deleted");
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  const onSubmit = async (values: EditProfileFormValues) => {
    // If they are in form mode, we save first?
    // Actually, in AddressRequiredModal, the main submit usually updates the DEFAULT address?
    // For now, let's just make the main submit close the modal if they have at least 1 address.
    if (user?.addresses && user.addresses.length > 0) {
      onClose();
      return;
    }

    try {
      // Legacy fallback
      const formData = new FormData();
      formData.append("address", JSON.stringify(values.address));
      await updateProfile({ data: formData }).unwrap();
      toast.success("Address saved");
      onClose();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to save");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        {/* Adjusted Z-Index to 40/50 to play nice with other portals like Select (z-50) */}
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-4xl max-h-[90vh] z-50 overflow-y-auto md:overflow-hidden rounded-sm sm:rounded-sm border-none  bg-background outline-none flex flex-col md:flex-row custom-scrollbar">
          {/* Left Panel - Visual & Context */}
          <div className="w-full md:w-1/3 bg-gradient-to-br from-emerald-500 to-teal-600 p-6 sm:p-8 text-white relative flex flex-col justify-between overflow-hidden shrink-0 min-h-[260px] md:min-h-0">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Compass className="w-48 h-48 rotate-12 translate-x-12 translate-y-12" />
            </div>

            <div className="relative z-10">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-sm sm:rounded-sm bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 sm:mb-8  ">
                <Navigation className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none mb-3 sm:mb-4 uppercase">
                Delivery <br /> Destiny
              </h2>
              <p className="text-emerald-50/80 font-medium text-xs sm:text-sm leading-relaxed max-w-[280px]">
                Provide your precise address to ensure a seamless and swift
                delivery experience direct to your door.
              </p>
            </div>

            <div className="relative z-10 pt-6 md:pt-0">
              <div className="p-4 rounded-sm sm:rounded-sm bg-white/10 backdrop-blur-sm border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-200" />
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                    Secure Handling
                  </p>
                </div>
                <p className="text-[9px] sm:text-[10px] text-emerald-50/60 font-medium italic">
                  "Your data is encrypted and used only for shipping logistics."
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="w-full md:w-2/3 p-6 sm:p-12 pb-24 md:pb-12 md:overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">
                  {mode === "edit" ? "Update Details" : "Shipping Destination"}
                </h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  Fill in the fields below to finalize your order.
                </p>
              </div>
              <Dialog.Close asChild>
                <button className="h-10 w-10 rounded-sm bg-muted/50 hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <FormProvider {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8 min-h-0"
              >
                  <div className="space-y-6">
                    {!addressFormMode ? (
                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              Saved Addresses ({user?.addresses?.length || 0}/3)
                            </p>
                            {(user?.addresses?.length || 0) < 3 && (
                               <Button 
                                 type="button" 
                                 variant="ghost" 
                                 size="sm"
                                 className="text-primary hover:text-primary/80 h-7 px-2 text-[10px] font-black uppercase"
                                 onClick={() => {
                                   setAddressFormMode("add");
                                   reset({ address: { street: "", country: "NG", state: "", city: "", postal_code: "" } });
                                 }}
                               >
                                 <Plus className="h-3 w-3 mr-1" /> Add New
                               </Button>
                            )}
                         </div>

                         {user?.addresses && user.addresses.length > 0 ? (
                            <div className="space-y-3">
                               {user.addresses.map((addr: any) => (
                                  <div key={addr.id} className="flex items-center justify-between p-4 rounded-sm border border-border/40 bg-muted/15 group/addr">
                                     <div className="flex gap-4">
                                        <div className="p-2 rounded-sm bg-primary/10 text-primary shrink-0 h-fit">
                                           <MapPin className="h-4 w-4" />
                                        </div>
                                        <div>
                                           <p className="text-sm font-bold text-foreground capitalize">{addr.street}</p>
                                           <p className="text-xs text-muted-foreground font-medium">{addr.city}, {addr.state}</p>
                                        </div>
                                     </div>
                                     <div className="flex gap-1.5 opacity-0 group-hover/addr:opacity-100 transition-opacity">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 rounded-sm"
                                          onClick={() => handleEditAddress(addr)}
                                        >
                                          <Edit2 className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 rounded-sm hover:text-destructive"
                                          onClick={() => handleDeleteAddress(addr.id)}
                                          disabled={isDeletingAddress}
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         ) : (
                            <div className="text-center py-10 rounded-sm border border-dashed border-border/60 bg-muted/5">
                               <MapPin className="h-8 w-8 mx-auto text-muted-foreground/30 mb-3" />
                               <p className="text-sm font-bold text-muted-foreground">No addresses found</p>
                               <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mt-1">Add your first shipping location</p>
                            </div>
                         )}

                         {/* Hidden legacy fields or just a prompt */}
                         {(!user?.addresses || user.addresses.length === 0) && (
                            <Button 
                               type="button" 
                               onClick={() => setAddressFormMode("add")}
                               className="w-full h-14 rounded-sm border-2 border-dashed hover:border-primary/50 text-muted-foreground hover:text-primary transition-all font-black uppercase text-[10px] tracking-widest"
                            >
                               <Plus className="h-4 w-4 mr-2" /> Initialize Address Setup
                            </Button>
                         )}
                      </div>
                    ) : (
                      <div className="space-y-6 p-6 rounded-sm border border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between mb-2">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">
                             {addressFormMode === "add" ? "Adding New Location" : "Refining Existing"}
                           </h4>
                           <Button 
                             type="button" 
                             variant="ghost" 
                             size="sm" 
                             className="h-7 text-[10px] font-black uppercase text-muted-foreground hover:text-foreground"
                             onClick={() => setAddressFormMode(null)}
                           >
                              Go Back
                           </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="col-span-1 md:col-span-2">
                            <FormInput
                              label="Street Address"
                              name="address.street"
                              placeholder="e.g. 123 Luxury Lane"
                              icon={<MapPin className="h-4 w-4" />}
                            />
                          </div>

                          <FormSelect
                            label="Country"
                            name="address.country"
                            options={countryOptions}
                            icon={<Globe className="h-4 w-4" />}
                            placeholder="Select Country"
                          />

                          <FormSelect
                            label="State / Region"
                            name="address.state"
                            options={stateOptions}
                            isSearchable
                            disabled={!countryCode}
                            icon={<Map className="h-4 w-4" />}
                            placeholder={!countryCode ? "Select Country First" : "Select State"}
                          />

                          <FormSelect
                            label="City"
                            name="address.city"
                            options={cityOptions}
                            isSearchable
                            disabled={!stateCode}
                            icon={<Building2 className="h-4 w-4" />}
                            placeholder={!stateCode ? "Select State First" : "Select City"}
                          />

                          <FormInput
                            label="Postal Code"
                            name="address.postal_code"
                            placeholder="100001"
                            icon={<Hash className="h-4 w-4" />}
                          />
                        </div>
                        
                        <Button 
                          type="button" 
                          onClick={handleSaveAddress}
                          className="w-full h-12 rounded-sm bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest"
                          disabled={isAddingAddress || isUpdatingAddress}
                        >
                          {(isAddingAddress || isUpdatingAddress) ? "Syncing..." : "Save Selection"}
                        </Button>
                      </div>
                    )}
                  </div>

                {!addressFormMode && (
                   <div className="flex flex-col gap-4 pt-4 shrink-0">
                    <Button
                      type="submit"
                      className="h-14 w-full rounded-sm bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs  -emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:grayscale disabled:opacity-50"
                      disabled={isLoading || (!user?.addresses || user.addresses.length === 0)}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                        >
                          <Loader2 className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <>
                          {mode === "edit"
                            ? "Confirm Selection"
                            : "Proceed to Checkout"}
                          <Navigation className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 hover:text-muted-foreground transition-colors py-2"
                      >
                        Cancel & Review Cart
                      </button>
                    </Dialog.Close>
                  </div>
                )}
              </form>
            </FormProvider>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
