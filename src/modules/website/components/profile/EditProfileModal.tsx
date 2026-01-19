import * as Dialog from "@radix-ui/react-dialog";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";

import { useUpdateUserProfileMutation } from "@/services/userApi";
import {
  EditProfileSchema,
  type EditProfileFormValues,
} from "../../validators/updateProfileValidator";

/* ───────────────── TYPES ───────────────── */

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

type Option = { label: string; value: string };

/* ───────────────── UTIL ───────────────── */

const importCSC = () => import("country-state-city");

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

  const { handleSubmit, setValue, control } = form;

  /* ───────────────── WATCH DEPENDENCIES ───────────────── */

  const countryCode = useWatch({ name: "address.country", control });
  const stateCode = useWatch({ name: "address.state", control });

  /* ───────────────── LOAD COUNTRIES (ON OPEN) ───────────────── */

  useEffect(() => {
    if (!open) return;

    (async () => {
      const { Country } = await importCSC();
      setCountryOptions(
        Country.getAllCountries().map((c) => ({
          label: c.name,
          value: c.isoCode,
        })),
      );
    })();
  }, [open]);

  /* ───────────────── LOAD STATES ───────────────── */

  useEffect(() => {
    if (!countryCode) {
      setStateOptions([]);
      setCityOptions([]);
      return;
    }

    (async () => {
      const { State } = await importCSC();
      setStateOptions(
        State.getStatesOfCountry(countryCode).map((s) => ({
          label: s.name,
          value: s.isoCode,
        })),
      );
    })();

    setValue("address.state", "");
    setValue("address.city", "");
  }, [countryCode, setValue]);

  /* ───────────────── LOAD CITIES ───────────────── */

  useEffect(() => {
    if (!countryCode || !stateCode) {
      setCityOptions([]);
      return;
    }

    (async () => {
      const { City } = await importCSC();
      setCityOptions(
        City.getCitiesOfState(countryCode, stateCode).map((c) => ({
          label: c.name,
          value: c.name,
        })),
      );
    })();

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
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edit Profile</CardTitle>
              <Dialog.Close asChild>
                <button className="text-sm text-muted-foreground">✕</button>
              </Dialog.Close>
            </CardHeader>

            <CardContent>
              <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="First Name" name="first_name" />
                    <FormInput label="Last Name" name="last_name" />
                  </div>

                  <FormInput label="Phone Number" name="phone_number" />

                  {/* AVATAR */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-full overflow-hidden border bg-muted flex items-center justify-center">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="avatar-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setAvatarFile(file);
                          setAvatarPreview(URL.createObjectURL(file));
                        }}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("avatar-upload")?.click()
                        }
                      >
                        Choose Photo
                      </Button>
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Address</p>

                    <FormInput label="Street" name="address.street" />

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

                    <FormSelect
                      label="City"
                      name="address.city"
                      options={cityOptions}
                      disabled={!stateCode}
                    />

                    <FormInput label="Postal Code" name="address.postal_code" />
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
