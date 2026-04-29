import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { User, Camera, X, CheckCircle2, AlertCircle, Building, Loader2, Trash2, Plus, Edit2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { 
  useUpdateUserProfileMutation,
  useGetNigerianBanksQuery,
  useVerifyBankAccountMutation,
  useRegisterBankAccountMutation,
  useAddUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation
} from "@/services/userApi";
import {
  EditProfileSchema,
  type EditProfileFormValues,
} from "../../validators/updateProfileValidator";
import { Country, State, City } from "country-state-city";
import { useDebounce } from "@/hooks";

/* ───────────────── TYPES ───────────────── */

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

type Option = { label: string; value: string };

/* ───────────────── COMPONENT ───────────────── */

export function EditProfileModal({
  open,
  onClose,
  user,
}: EditProfileModalProps) {
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const [registerBank, { isLoading: isRegisteringBank }] = useRegisterBankAccountMutation();

  const { data: banksResponse, isLoading: isLoadingBanks } = useGetNigerianBanksQuery(undefined, { skip: !open });
  const [verifyBank, { isLoading: isVerifyingBank }] = useVerifyBankAccountMutation();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar ?? null,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [countryOptions, setCountryOptions] = useState<Option[]>([]);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [cityOptions, setCityOptions] = useState<Option[]>([]);
  const [bankOptions, setBankOptions] = useState<Option[]>([]);

  const [verifiedAccountName, setVerifiedAccountName] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const [addressFormMode, setAddressFormMode] = useState<"add" | "edit" | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [addUserAddress, { isLoading: isAddingAddress }] = useAddUserAddressMutation();
  const [updateUserAddress, { isLoading: isUpdatingAddress }] = useUpdateUserAddressMutation();
  const [deleteUserAddress, { isLoading: isDeletingAddress }] = useDeleteUserAddressMutation();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      phone_number: user?.phone_number ?? "",
      username: user?.username ?? "",
      address: {
        street: user?.address?.street ?? "",
        country: user?.address?.country ?? "",
        state: user?.address?.state ?? "",
        city: user?.address?.city ?? "",
        postal_code: user?.address?.postal_code ?? "",
      },
      bank_code: user?.bank_code ?? "",
      account_number: user?.account_number ?? "",
    },
  });

  const { handleSubmit, control, reset, setValue } = form;

  /* ───────────────── WATCH DEPENDENCIES ───────────────── */

  const countryCode = useWatch({ name: "address.country", control });
  const stateCode = useWatch({ name: "address.state", control });
  
  const bankCode = useWatch({ name: "bank_code", control });
  const accountNumber = useWatch({ name: "account_number", control });

  const debouncedAccountNumber = useDebounce(accountNumber, 800);

  /* ───────────────── RESET ON OPEN ───────────────── */

  useEffect(() => {
    if (open && user) {
      reset({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        phone_number: user.phone_number ?? "",
        username: user.username ?? "",
        address: {
          street: user.address?.street ?? "",
          country: user.address?.country ?? "",
          state: user.address?.state ?? "",
          city: user.address?.city ?? "",
          postal_code: user.address?.postal_code ?? "",
        },
        bank_code: user.bank_code ?? "",
        account_number: user.account_number ?? "",
      });
      setAvatarPreview(user.avatar ?? null);
      if (user.payout_verified && user.account_number) {
        setVerifiedAccountName("Verified Existing Account"); 
        setVerificationError(null);
      } else {
        setVerifiedAccountName(null);
        setVerificationError(null);
      }
    }
  }, [open, user, reset]);

  /* ───────────────── LOAD BANKS ───────────────── */

  useEffect(() => {
    if (banksResponse?.data) {
      const options = banksResponse.data.map(b => ({ label: b.name, value: b.code }));
      options.sort((a, b) => a.label.localeCompare(b.label));
      setBankOptions(options);
    }
  }, [banksResponse]);

  /* ───────────────── VERIFY BANK ACCOUNT ───────────────── */

  useEffect(() => {
    // Only verify if we have both fields and account is exactly 10 digits
    if (bankCode && debouncedAccountNumber && String(debouncedAccountNumber).length === 10) {
      // If it matches exactly what they already have successfully verified, skip pinging API unless they changed it.
      if (user?.payout_verified && user?.bank_code === bankCode && user?.account_number === debouncedAccountNumber) {
        setVerifiedAccountName("Verified Existing Account");
        setVerificationError(null);
        return;
      }

      const performVerification = async () => {
        try {
          setVerificationError(null);
          setVerifiedAccountName(null);
          
          const result = await verifyBank({ bank_code: bankCode, account_number: debouncedAccountNumber }).unwrap();
          
          if (result && result.account_name) {
            setVerifiedAccountName(result.account_name);
            toast.success("Bank account verified");
          }
        } catch (error: any) {
          setVerifiedAccountName(null);
          const msg = error?.data?.message || "Invalid bank details";
          setVerificationError(msg);
        }
      };

      performVerification();
    } else {
      setVerifiedAccountName(null);
      setVerificationError(null);
    }
  }, [bankCode, debouncedAccountNumber, verifyBank, user]);

  /* ───────────────── LOAD COUNTRIES (ON OPEN) ───────────────── */

  useEffect(() => {
    if (!open) return;
    const ng = Country.getCountryByCode("NG");
    if (ng) {
      setCountryOptions([
        { label: ng.name, value: ng.isoCode },
      ]);
    } else {
      setCountryOptions([
        { label: "Nigeria", value: "NG" }
      ]);
    }
  }, [open]);

  /* ───────────────── LOAD STATES & RESET CITY ───────────────── */

  useEffect(() => {
    if (!countryCode) {
      setStateOptions([]);
      setCityOptions([]);
      return;
    }

    const mappedStates = State.getStatesOfCountry(countryCode).map((s) => ({
      label: s.name,
      value: s.isoCode,
    }));
    setStateOptions(mappedStates);

    // Only reset if it's a fresh change
    setValue("address.state", "");
    setValue("address.city", "");
  }, [countryCode, setValue]);

  /* ───────────────── LOAD CITIES & RESET CITY ───────────────── */

  useEffect(() => {
    if (!countryCode || !stateCode) {
      setCityOptions([]);
      return;
    }

    const mappedCities = City.getCitiesOfState(countryCode, stateCode).map((c) => ({
      label: c.name,
      value: c.name,
    }));
    setCityOptions(mappedCities);

    setValue("address.city", "");
  }, [countryCode, stateCode, setValue]);

  const handleSaveAddress = async () => {
    const values = form.getValues().address;
    try {
      if (addressFormMode === "add") {
        await addUserAddress(values).unwrap();
        toast.success("Address added successfully");
      } else if (addressFormMode === "edit" && editingAddressId) {
        await updateUserAddress({ id: editingAddressId, body: values }).unwrap();
        toast.success("Address updated successfully");
      }
      setAddressFormMode(null);
      setEditingAddressId(null);
      // Don't reset the whole form, just the address part
      setValue("address", { street: "", country: "NG", state: "", city: "", postal_code: "" });
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to save address");
    }
  };

  const handleEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressFormMode("edit");
    setValue("address", {
      street: addr.street || "",
      country: addr.country || "NG",
      state: addr.state || "",
      city: addr.city || "",
      postal_code: addr.postal_code || "",
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

  /* ───────────────── CLEANUP AVATAR PREVIEW ───────────────── */

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  /* ───────────────── SUBMIT ───────────────── */

  const onSubmit = async (values: EditProfileFormValues) => {
    // Smart Disable / Validation Guard for Bank Fields
    const isEditingBank = values.bank_code || values.account_number;
    if (isEditingBank) {
      if (!values.bank_code || !values.account_number || values.account_number.length !== 10) {
        toast.error("Please complete bank details (Select Bank & enter 10 digits)");
        return;
      }
      if (verificationError || !verifiedAccountName) {
        toast.error("Please ensure the bank account successfully resolves before saving.");
        return;
      }
    }

    try {
      const formData = new FormData();

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      Object.entries(values).forEach(([key, value]) => {
        if (!value) return; 
        if (key === "bank_code" || key === "account_number") {
           // handled via registerBankAccount endpoint
           return;
        }
        if (key === "address") {
          // Relational addresses are handled separately, 
          // but we sync the default one to core profile for legacy support
          formData.append("address", JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });

      // 1. Update basic profile
      await updateProfile({ data: formData }).unwrap();

      // 2. Setup Bank Registration if fields are filled and different from user defaults OR user wasn't verified
      if (isEditingBank) {
        if (!user?.payout_verified || values.bank_code !== user?.bank_code || values.account_number !== user?.account_number) {
            await registerBank({
              bank_code: values.bank_code as string,
              account_number: values.account_number as string,
            }).unwrap();
        }
      }

      toast.success("Profile updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  const isLoading = isUpdatingProfile || isRegisteringBank;

  /* ───────────────── UI ───────────────── */

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent 
        showCloseButton={false}
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-0 gap-0"
      >
        <DialogHeader className="p-6 pb-0 border-b flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-semibold">
            Edit Profile
          </DialogTitle>
          <Button
            variant="ghost"
            type="button"
            size="icon"
            onClick={onClose}
            className="rounded-sm h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-6 pb-24 sm:pb-6">
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="relative group">
                  <div className="h-32 w-32 rounded-sm overflow-hidden border-4 border-background ring-2 ring-primary/20 bg-muted flex items-center justify-center transition-all group-hover:ring-primary/40 ">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-14 w-14 text-muted-foreground" />
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 h-10 w-10 bg-primary text-primary-foreground rounded-sm border-4 border-background flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors "
                  >
                    <Camera className="h-5 w-5" />
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setAvatarFile(file);
                        setAvatarPreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                </div>
                <div className="text-center">
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, GIF or PNG. Max size 2MB.
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider">
                  <span className="h-px bg-primary/20 flex-1" />
                  Personal Information
                  <span className="h-px bg-primary/20 flex-1" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="First Name"
                    name="first_name"
                    placeholder="John"
                  />
                  <FormInput
                    label="Last Name"
                    name="last_name"
                    placeholder="Doe"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Username"
                    name="username"
                    placeholder="johndoe"
                  />
                  <FormInput
                    label="Phone Number"
                    name="phone_number"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider">
                  <span className="h-px bg-primary/20 flex-1" />
                  Shipping Address ({user?.addresses?.length || 0}/3)
                  <span className="h-px bg-primary/20 flex-1" />
                </div>

                {!addressFormMode ? (
                  <div className="space-y-3">
                    {user?.addresses && user.addresses.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {user.addresses.map((addr: any) => (
                          <div key={addr.id} className="flex items-center justify-between p-3 rounded-sm border border-border/40 bg-muted/10">
                            <div className="flex gap-3">
                              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <div className="text-sm">
                                <p className="font-semibold">{addr.street}</p>
                                <p className="text-muted-foreground text-xs">{addr.city}, {addr.state}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={() => handleEditAddress(addr)}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
                      <p className="text-xs text-muted-foreground italic text-center py-2">No addresses added yet.</p>
                    )}

                    {(user?.addresses?.length || 0) < 3 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-10 border-dashed border-2 hover:border-primary/50 text-sm"
                        onClick={() => {
                          setAddressFormMode("add");
                          setValue("address", { street: "", country: "NG", state: "", city: "", postal_code: "" });
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 mr-2" />
                        Add New Address
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-sm border border-primary/20 bg-primary/5 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                       <h4 className="text-xs font-black uppercase tracking-widest text-primary">
                         {addressFormMode === "add" ? "New Address" : "Edit Address"}
                       </h4>
                       <Button 
                         type="button" 
                         variant="ghost" 
                         size="sm" 
                         className="h-7 px-2 text-xs"
                         onClick={() => {
                           setAddressFormMode(null);
                           setEditingAddressId(null);
                         }}
                       >
                         Cancel
                       </Button>
                    </div>
                    
                    <FormInput
                      label="Street Address"
                      name="address.street"
                      placeholder="123 Main St"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormSelect
                        label="Country"
                        name="address.country"
                        options={countryOptions}
                      />
                      <FormSelect
                        label="State"
                        name="address.state"
                        options={stateOptions}
                        disabled={!countryCode}
                        isSearchable
                        placeholder="Search State"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormSelect
                        label="City"
                        name="address.city"
                        options={cityOptions}
                        disabled={!stateCode}
                        isSearchable
                        placeholder="Search City"
                      />
                      <FormInput
                        label="Postal Code"
                        name="address.postal_code"
                        placeholder="10001"
                      />
                    </div>
                    <Button 
                      type="button" 
                      className="w-full h-10 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
                      onClick={handleSaveAddress}
                      disabled={isAddingAddress || isUpdatingAddress}
                    >
                      {(isAddingAddress || isUpdatingAddress) ? "Saving..." : "Save This Address"}
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Bank Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider">
                  <span className="h-px bg-primary/20 flex-1" />
                  Bank Details & Payouts
                  <span className="h-px bg-primary/20 flex-1" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect
                    label="Bank Name"
                    name="bank_code"
                    options={bankOptions}
                    isSearchable
                    icon={<Building className="h-4 w-4" />}
                    isLoading={isLoadingBanks}
                    placeholder="Select your bank"
                  />
                  <FormInput
                    label="Account Number"
                    name="account_number"
                    placeholder="E.g 0123456789"
                    maxLength={10}
                    type="text"
                  />
                </div>
                
                {/* Visual Feedback for verification */}
                {(bankCode && String(accountNumber || "").length === 10) && (
                  <div className="mt-2 text-sm rounded-sm p-3 border">
                     {isVerifyingBank ? (
                       <div className="flex items-center gap-2 text-muted-foreground">
                         <Loader2 className="h-4 w-4 animate-spin" /> Verifying account details...
                       </div>
                     ) : verifiedAccountName ? (
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between text-emerald-600 bg-emerald-500/10 p-2 sm:p-0 sm:bg-transparent rounded-sm gap-2">
                         <div className="flex items-center gap-2 font-semibold">
                            <CheckCircle2 className="h-4 w-4" />
                            {verifiedAccountName}
                         </div>
                         <span className="text-xs uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-sm shrink-0">Valid</span>
                       </div>
                     ) : verificationError ? (
                       <div className="flex items-center gap-2 text-destructive font-medium">
                         <AlertCircle className="h-4 w-4" />
                         {verificationError}
                       </div>
                     ) : null}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-sm px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading || isVerifyingBank}
                  disabled={
                     (bankCode && accountNumber?.length === 10 && (Boolean(verificationError) || !verifiedAccountName)) || 
                     isVerifyingBank
                  }
                  loadingText="Saving Changes..."
                  className="rounded-sm px-8 bg-primary hover:bg-primary/90"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
