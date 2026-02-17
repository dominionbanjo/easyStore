import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PricingSection } from "./PricingSection";
import { VariantsSection } from "./VariantsSection";
import { useFormContext } from "react-hook-form";

export function Wrapper(props: any) {
  const { setSizes } = props;
  const [enableVariants, setEnableVariants] = useState(false);
  const { setValue, getValues } = useFormContext();

  // Check on mount only if there are existing variants
  useEffect(() => {
    const currentVariants = getValues("variants") || [];
    if (currentVariants.length > 0) {
      setEnableVariants(true);
    }
  }, []); // Only run on mount

  const handleToggle = (checked: boolean) => {
    setEnableVariants(checked);
    if (!checked) {
      const currentVariants = getValues("variants") || [];
      if (currentVariants.length > 0) {
        if (
          window.confirm(
            "Switching to simple pricing will remove all variants. Continue?",
          )
        ) {
          setValue("variants", []);
          setSizes([]);
        } else {
          setEnableVariants(true);
          return;
        }
      }
      setValue("variants", []);
      setSizes([]);
    } else {
      setValue("price", 0);
      setValue("stock", 0);
      setValue("discount_price", 0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-border/40">
        <div className="space-y-0.5">
          <Label className="text-base font-bold">Multi-Size Pricing</Label>
          <p className="text-xs text-muted-foreground">
            Enable to set different prices and stock for product sizes.
          </p>
        </div>
        <Switch checked={enableVariants} onCheckedChange={handleToggle} />
      </div>

      {enableVariants ? (
        <VariantsSection sizes={props.sizes} />
      ) : (
        <PricingSection />
      )}
    </div>
  );
}
