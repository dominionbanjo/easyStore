import { FormInput } from "@/components/shared/form/FormInput";

export function ShippingSection() {
  return (
    <>
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
