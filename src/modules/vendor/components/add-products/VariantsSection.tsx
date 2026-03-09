import { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Tag, Box, Percent } from "lucide-react";
import { FormPriceInput } from "@/components/shared/form/FormPriceInput";
import { FormInput } from "@/components/shared/form/FormInput";
import { Badge } from "@/components/ui/badge";

interface Variant {
  size: string;
  price: number;
  stock: number;
  discount_price?: number;
}

interface VariantsSectionProps {
  sizes: string[];
}

export function VariantsSection({ sizes }: VariantsSectionProps) {
  const { control, getValues } = useFormContext();
  const { fields, replace } = useFieldArray({
    control,
    name: "variants",
  });

  // Sync variants with sizes: ensure every size has a variant entry
  useEffect(() => {
    if (!Array.isArray(sizes)) return;
    const currentVariants = getValues("variants") || [];

    // Create a new list of variants based on selected sizes
    const nextVariants = sizes.map((size) => {
      // Keep existing data if it exists for this size
      const existing = currentVariants.find((v: Variant) => v.size === size);
      return existing
        ? { ...existing }
        : { size, price: 0, stock: 0, discount_price: null };
    });

    // Only update if the structure has changed (to avoid unnecessary re-renders)
    const hasChanged =
      nextVariants.length !== currentVariants.length ||
      !nextVariants.every((v, i) => v.size === currentVariants[i]?.size);

    if (hasChanged) {
      replace(nextVariants);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizes]); // Only depend on sizes changes

  if (!sizes || sizes.length === 0) {
    return (
      <div className="p-10 text-center border-2 border-dashed rounded-[2rem] bg-muted/20 border-border/60">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Box className="h-6 w-6 text-muted-foreground/60" />
          </div>
          <p className="text-muted-foreground font-semibold text-sm max-w-[240px]">
            Add sizes in the <strong>Specifications</strong> section above to
            set their prices and stock.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {/* Header - Only visible on md and up for clarity, or just implied by placeholder */}
        <div className="hidden md:grid grid-cols-[80px_1fr_1fr_120px] gap-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          <div>Size</div>
          <div>Price</div>
          <div>Discount</div>
          <div>Stock</div>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => {
            const variantField = field as unknown as Variant & { id: string };
            return (
              <div
                key={field.id}
                className="flex flex-col md:grid md:grid-cols-[80px_1fr_1fr_120px] gap-4 p-4 rounded-2xl border border-border/40 bg-background/50 hover:bg-muted/10 transition-all duration-300"
              >
                {/* Size Badge */}
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="font-black text-xs h-9 w-full md:w-auto px-4 justify-center bg-background border-primary/20 text-primary shadow-sm"
                  >
                    {variantField.size}
                  </Badge>
                </div>

                {/* Price Field */}
                <div className="space-y-1">
                  <span className="md:hidden text-[10px] font-bold text-muted-foreground uppercase ml-1">
                    Price
                  </span>
                  <FormPriceInput
                    name={`variants.${index}.price`}
                    placeholder="0.00"
                    className="space-y-0"
                    inputClassName="h-11"
                    icon={<Tag className="h-3.5 w-3.5" />}
                  />
                </div>

                {/* Discount Field */}
                <div className="space-y-1">
                  <span className="md:hidden text-[10px] font-bold text-muted-foreground uppercase ml-1">
                    Discount
                  </span>
                  <FormPriceInput
                    name={`variants.${index}.discount_price`}
                    placeholder="Optional"
                    className="space-y-0"
                    inputClassName="h-11"
                    icon={<Percent className="h-3.5 w-3.5" />}
                  />
                </div>

                {/* Stock Field */}
                <div className="space-y-1">
                  <span className="md:hidden text-[10px] font-bold text-muted-foreground uppercase ml-1">
                    Stock
                  </span>
                  <FormInput
                    name={`variants.${index}.stock`}
                    type="number"
                    placeholder="Qty"
                    className="space-y-0"
                    inputClassName="h-11"
                    icon={<Box className="h-3.5 w-3.5" />}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 py-2 border-t border-border/20">
        <div className="h-1 w-1 rounded-full bg-primary/40 animate-pulse" />
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-60">
          Individual Variant Details
        </p>
        <div className="h-1 w-1 rounded-full bg-primary/40 animate-pulse" />
      </div>
    </div>
  );
}
