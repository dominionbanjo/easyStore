import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";

export function ShippingSection({ countries, states }: any) {
  return (
    <>
      <FormSelect
        name="country"
        label="Country"
        options={countries}
        placeholder="Select the country this product ships from"
      />

      <FormSelect
        name="state"
        label="State"
        options={states}
        disabled={!states.length}
        placeholder={
          states.length
            ? "Select the state or region"
            : "Select a country first"
        }
      />

      <FormInput
        name="city"
        label="City"
        placeholder="e.g. Ikeja, Lekki, Wuse"
      />

      <FormInput
        name="shipping_cost"
        label="Shipping Cost"
        type="number"
        placeholder="e.g. 1500 within State and 4000 around Nigeria"
      />

      <FormInput
        name="shipping_note"
        label="Shipping Note"
        placeholder="e.g. Delivery within 2–3 business days"
      />

      <FormInput
        name="returns_note"
        label="Returns Policy"
        placeholder="e.g. 7-day return policy applies"
      />
    </>
  );
}
