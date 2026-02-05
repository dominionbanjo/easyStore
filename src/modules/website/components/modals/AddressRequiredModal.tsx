import * as Dialog from "@radix-ui/react-dialog";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { useUpdateUserProfileMutation } from "@/services/userApi";
import {
  EditProfileSchema,
  type EditProfileFormValues,
} from "../../validators/updateProfileValidator";

type Option = { label: string; value: string };

export function AddressRequiredModal({
  open,
  onClose,
  user,
  mode = "create",
}: {
  open: boolean;
  onClose: () => void;
  user: any;
  mode?: "create" | "edit";
}) {
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

  const [countryOptions, setCountryOptions] = useState<Option[]>([]);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [cityOptions, setCityOptions] = useState<Option[]>([]);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      address: {
        street: "",
        country: "",
        state: "",
        city: "",
        postal_code: "",
      },
    },
  });

  const { handleSubmit, control, setValue, reset } = form;
  const countryCode = useWatch({ name: "address.country", control });
  const stateCode = useWatch({ name: "address.state", control });

  /* ───────── PREFILL ON EDIT ───────── */
  useEffect(() => {
    if (!open || mode !== "edit" || !user?.address) return;

    reset({
      address: {
        street: user.address.street ?? "",
        country: user.address.country ?? "",
        state: user.address.state ?? "",
        city: user.address.city ?? "",
        postal_code: user.address.postal_code ?? "",
      },
    });
  }, [open, mode, user, reset]);

  /* LOAD COUNTRIES */
  useEffect(() => {
    if (!open) return;
    import("country-state-city").then(({ Country }) => {
      setCountryOptions(
        Country.getAllCountries().map((c) => ({
          label: c.name,
          value: c.isoCode,
        })),
      );
    });
  }, [open]);

  /* LOAD STATES */
  useEffect(() => {
    if (!countryCode) return;
    import("country-state-city").then(({ State }) => {
      setStateOptions(
        State.getStatesOfCountry(countryCode).map((s) => ({
          label: s.name,
          value: s.isoCode,
        })),
      );
    });
    setValue("address.state", "");
    setValue("address.city", "");
  }, [countryCode, setValue]);

  /* LOAD CITIES */
  useEffect(() => {
    if (!countryCode || !stateCode) return;
    import("country-state-city").then(({ City }) => {
      setCityOptions(
        City.getCitiesOfState(countryCode, stateCode).map((c) => ({
          label: c.name,
          value: c.name,
        })),
      );
    });
    setValue("address.city", "");
  }, [countryCode, stateCode, setValue]);

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      const formData = new FormData();
      formData.append("address", JSON.stringify(values.address));
      await updateProfile({ data: formData }).unwrap();
      toast.success("Address saved successfully");
      onClose();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to save address");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <Card className="w-full max-w-lg rounded-xl">
            <CardHeader className="relative">
              <CardTitle>
                {mode === "edit"
                  ? "Edit Delivery Address"
                  : "Add Delivery Address"}
              </CardTitle>
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 rounded-full"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Dialog.Close>
            </CardHeader>

            <CardContent>
              <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading
                      ? "Saving..."
                      : mode === "edit"
                        ? "Update Address"
                        : "Save Address"}
                  </Button>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
