import { FormInput } from "@/components/shared/form/FormInput";
import { FormPriceInput } from "@/components/shared/form/FormPriceInput";
import { Truck, Info, ShieldCheck } from "lucide-react";

export function ShippingSection() {
  return (
    <div className="space-y-6">
      <FormPriceInput
        name="shipping_cost"
        label="Shipping Cost"
        placeholder="1,500"
        icon={<Truck className="h-4 w-4" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          name="shipping_note"
          label="Shipping Note"
          placeholder="e.g. Delivery within 2–3 business days"
          icon={<Info className="h-4 w-4" />}
        />

        <FormInput
          name="returns_note"
          label="Returns Policy"
          placeholder="e.g. 7-day return policy applies"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
