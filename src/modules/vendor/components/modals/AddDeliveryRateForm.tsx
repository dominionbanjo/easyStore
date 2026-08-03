"use client";

import { useForm, FormProvider, useWatch } from "react-hook-form";
import { NigeriaData } from "@/utils/nigeria-data";
import { toast } from "sonner";
import { extractErrorMessage } from "@/utils/errorHandler";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";

import {
  useCreateProductDeliveryRateMutation,
  useUpdateProductDeliveryRateMutation,
} from "@/services/productApi";

/* ───────────────── TYPES ───────────────── */

export type DeliveryRateFormValues = {
  country: string;
  state?: string;
  city?: string;
  price: number;
  estimated_days?: number;
};

type Props =
  | {
      mode: "create";
      productId?: string;
      onAdd?: (rate: DeliveryRateFormValues) => void;
      onSuccess?: () => void;
    }
  | {
      mode: "edit";
      productId: string;
      rateId: string;
      defaultValues: DeliveryRateFormValues;
      onSuccess?: () => void;
    };

/* ───────────────── COMPONENT ───────────────── */

export function AddDeliveryRateForm(props: Props) {
  const methods = useForm<DeliveryRateFormValues>({
    defaultValues:
      props.mode === "edit"
        ? props.defaultValues
        : {
            country: "NG",
            state: "",
            city: "",
            price: 0,
            estimated_days: undefined,
          },
  });
  const { control, getValues, reset } = methods;

  const countryCode = useWatch({ name: "country", control });
  const stateCode = useWatch({ name: "state", control });

  const [createRate, { isLoading: creating }] =
    useCreateProductDeliveryRateMutation();

  const [updateRate, { isLoading: updating }] =
    useUpdateProductDeliveryRateMutation();

  const isLoading = creating || updating;

  /* ───────────────── OPTIONS ───────────────── */

  const countryOptions = NigeriaData.getCountries().map((c) => ({
    label: c.name,
    value: c.isoCode,
  }));

  const stateOptions = countryCode
    ? NigeriaData.getStates().map((s) => ({
        label: s.name,
        value: s.isoCode,
      }))
    : [];

  const cityOptions =
    countryCode === "NG" && stateCode
      ? NigeriaData.getCities(stateCode).map((c) => ({
          label: c,
          value: c,
        }))
      : [];

  /* ───────────────── SAVE HANDLER ───────────────── */

  const save = async () => {
    const values = getValues();

    if (!values.country) {
      toast.error("Country is required");
      return;
    }

    const payload = {
      country: values.country,
      state: values.state || null,
      city: values.city || null,
      price: Number(values.price),
      estimated_days: values.estimated_days ?? null,
    };

    try {
      // 🟢 CREATE
      if (props.mode === "create") {
        // API create (edit product page)
        if (props.productId) {
          await createRate({
            productId: props.productId,
            data: payload,
          }).unwrap();

          toast.success("Delivery rate created");
          props.onSuccess?.();
        }
        // Draft create (new product page)
        else {
          props.onAdd?.(values);
          toast.success("Delivery rate added");
        }
      }

      // 🔵 UPDATE
      else {
        await updateRate({
          rateId: props.rateId,
          data: payload,
        }).unwrap();

        toast.success("Delivery rate updated");
        props.onSuccess?.();
      }

      reset();
    } catch (e: unknown) {
      toast.error(extractErrorMessage(e, "Failed to save delivery rate"));
    }
  };
  // console.log(productid)
  /* ───────────────── UI ───────────────── */

  return (
    <Card className="rounded-sm border p-4 space-y-4">
      <FormProvider {...methods}>
        <div className="space-y-4">
          <FormSelect label="Country" name="country" options={countryOptions} />

          <FormSelect
            label="State (optional)"
            name="state"
            options={stateOptions}
            disabled={!countryCode}
          />

          <FormSelect
            label="City (optional)"
            name="city"
            options={cityOptions}
            disabled={!stateCode}
          />

          <FormInput label="Delivery Price" name="price" type="number" />
          <FormInput
            label="Estimated Days"
            name="estimated_days"
            type="number"
          />

          <Button type="button" disabled={isLoading} onClick={save}>
            {isLoading
              ? "Saving..."
              : props.mode === "create"
                ? "Add Delivery Rate"
                : "Save Changes"}
          </Button>
        </div>
      </FormProvider>
    </Card>
  );
}
