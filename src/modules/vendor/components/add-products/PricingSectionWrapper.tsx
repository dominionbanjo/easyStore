import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PricingSection } from "./PricingSection";
import { useFormContext, useWatch } from "react-hook-form";
import { VariantBuilderSection } from "./VariantBuilderSection";

export function Wrapper() {
  const [enableVariants, setEnableVariants] = useState(false);
  const { setValue, getValues } = useFormContext();

  const variants = useWatch({ name: "variants" });
  const options = useWatch({ name: "options" });

  // Check for existing variants or options to enable variant mode
  useEffect(() => {
    if ((variants && variants.length > 0) || (options && options.length > 0)) {
      setEnableVariants(true);
    }
  }, [variants, options]);

  const handleToggle = (checked: boolean) => {
    setEnableVariants(checked);
    if (!checked) {
      const currentVariants = getValues("variants") || [];
      if (currentVariants.length > 0) {
        if (
          window.confirm(
            "Switching to simple pricing will remove all variants and options. Continue?",
          )
        ) {
          setValue("variants", []);
          setValue("options", []);
        } else {
          setEnableVariants(true);
          return;
        }
      }
      setValue("variants", []);
      setValue("options", []);
    } else {
      setValue("price", 0);
      setValue("stock", 0);
      setValue("discount_price", 0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-muted/30 p-3 rounded-sm border border-border/40">
        <div className="space-y-0.5">
          <Label className="text-base font-bold">
            Variant Pricing (Options & Combinations)
          </Label>
          <p className="text-xs text-muted-foreground">
            Enable to set different prices and stock for product options like
            Size, Color, or Material.
          </p>
        </div>
        <Switch checked={enableVariants} onCheckedChange={handleToggle} />
      </div>

      {enableVariants ? <VariantBuilderSection /> : <PricingSection />}
    </div>
  );
}
