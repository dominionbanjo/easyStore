import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { User, Camera, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useUpdateUserProfileMutation } from "@/services/userApi";
import {
  EditProfileSchema,
  type EditProfileFormValues,
} from "../../validators/updateProfileValidator";
import { NigeriaData } from "@/utils/nigeria-data";

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
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar ?? null,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [countryOptions, setCountryOptions] = useState<Option[]>([]);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [cityOptions, setCityOptions] = useState<Option[]>([]);

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
    },
  });

  const { handleSubmit, control, reset, setValue } = form;

  /* ───────────────── WATCH DEPENDENCIES ───────────────── */

  const countryCode = useWatch({ name: "address.country", control });
  const stateCode = useWatch({ name: "address.state", control });

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
      });
      setAvatarPreview(user.avatar ?? null);
    }
  }, [open, user, reset]);

  /* ───────────────── LOAD COUNTRIES (ON OPEN) ───────────────── */

  useEffect(() => {
    if (!open) return;
    setCountryOptions(
      NigeriaData.getCountries().map((c) => ({
        label: c.name,
        value: c.isoCode,
      })),
    );
  }, [open]);

  /* ───────────────── LOAD STATES & RESET CITY ───────────────── */

  useEffect(() => {
    if (!countryCode) {
      setStateOptions([]);
      setCityOptions([]);
      return;
    }

    setStateOptions(
      NigeriaData.getStates().map((s) => ({
        label: s.name,
        value: s.isoCode,
      })),
    );

    // Only reset if the current value is not in the options or if it's a fresh change
    // For simplicity, we reset when country changes
    setValue("address.state", "");
    setValue("address.city", "");
  }, [countryCode, setValue]);

  /* ───────────────── LOAD CITIES & RESET CITY ───────────────── */

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

    setValue("address.city", "");
  }, [countryCode, stateCode, setValue]);

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
    try {
      const formData = new FormData();

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      Object.entries(values).forEach(([key, value]) => {
        if (!value) return;
        if (key === "address") {
          formData.append("address", JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });

      await updateProfile({ data: formData }).unwrap();
      toast.success("Profile updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

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
            size="icon"
            onClick={onClose}
            className="rounded-sm h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-6">
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
                  Shipping Address
                  <span className="h-px bg-primary/20 flex-1" />
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
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect
                    label="City"
                    name="address.city"
                    options={cityOptions}
                    disabled={!stateCode}
                  />
                  <FormInput
                    label="Postal Code"
                    name="address.postal_code"
                    placeholder="10001"
                  />
                </div>
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
                  isLoading={isLoading}
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
