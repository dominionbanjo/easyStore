import { FormInput } from "@/components/shared/form/FormInput";
import { FormPriceInput } from "@/components/shared/form/FormPriceInput";
import { Tag, Box } from "lucide-react";

export function PricingSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormPriceInput
          name="price"
          label="Regular Price"
          placeholder="40,000"
          icon={<Tag className="h-4 w-4" />}
        />

        <FormPriceInput
          name="discount_price"
          label="Sale Price (Optional)"
          icon={<Tag className="h-4 w-4" />}
        />
      </div>

      <FormInput
        name="stock"
        label="Stock Quantity"
        type="number"
        placeholder="e.g. 50"
        icon={<Box className="h-4 w-4" />}
      />
    </div>
  );
}
