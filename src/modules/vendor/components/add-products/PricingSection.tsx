import { FormInput } from "@/components/shared/form/FormInput";

export function PricingSection() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          name="price"
          label="Price"
          type="number"
          placeholder="e.g. 40000 (regular price)"
        />

        <FormInput
          name="discount_price"
          label="Discount Price"
          type="number"
          placeholder="e.g. 30000 (optional sale price)"
        />
      </div>

      <FormInput
        name="stock"
        label="Stock Quantity"
        type="number"
        placeholder="e.g. 50 units available"
      />
    </>
  );
}
