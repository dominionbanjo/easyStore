import { FormTextarea } from "@/components/shared/form/FormTextarea";
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

      <div className="flex flex-col gap-6">
        <FormTextarea
          name="shipping_note"
          label="Shipping Note"
          placeholder="e.g. Delivery within 2–3 business days"
          icon={<Info className="h-4 w-4" />}
          rows={3}
        />

        <FormTextarea
          name="returns_note"
          label="Returns Policy"
          placeholder="e.g. 7-day return policy applies"
          icon={<ShieldCheck className="h-4 w-4" />}
          rows={3}
        />
      </div>
    </div>
  );
}
