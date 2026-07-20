import { useState, useMemo } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { getDerivedOptions } from "@/components/shared/productCardUtils";
import type { VariantType } from "@/components/shared/productCardUtils";

interface VariantProduct {
  id: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  variants: {
    id: string;
    price: number;
    stock: number;
    combinations: Record<string, string>;
    image_url: string | null;
  }[];
}

interface Props {
  product: VariantProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (product: { id: string; name: string; price: number; image: string | null }, variant?: { id: string; price: number; image_url: string | null; combinations: Record<string, string> }) => void;
}

export function VariantSelectionModal({ product, open, onOpenChange, onConfirm }: Props) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const variants: VariantType[] = useMemo(() =>
    (product?.variants ?? []).map((v) => ({
      id: v.id,
      combinations: v.combinations,
      price: v.price,
      stock: v.stock,
      image_url: v.image_url,
    })),
    [product],
  );

  const derivedOptions = useMemo(() => getDerivedOptions(null, variants), [variants]);

  const matchedVariant = useMemo(() => {
    if (derivedOptions.length === 0) return null;
    const hasAll = derivedOptions.every((o) => selectedOptions[o.name]);
    if (!hasAll) return null;
    return variants.find((v) =>
      Object.entries(selectedOptions).every(([k, val]) => v.combinations?.[k] === val),
    ) ?? null;
  }, [derivedOptions, selectedOptions, variants]);

  const handleConfirm = () => {
    if (!product) return;

    const missing = derivedOptions.filter((o) => !selectedOptions[o.name]);
    if (missing.length > 0) {
      toast.error(`Please select a ${missing[0].name}`);
      return;
    }

    if (matchedVariant && matchedVariant.stock <= 0) {
      toast.error("Selected combination is out of stock");
      return;
    }

    onConfirm(
      { id: product.id, name: product.name, price: product.price, image: product.image },
      matchedVariant
        ? { id: matchedVariant.id, price: matchedVariant.price, image_url: matchedVariant.image_url ?? null, combinations: matchedVariant.combinations ?? {} }
        : undefined,
    );
    setSelectedOptions({});
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedOptions({});
    onOpenChange(open);
  };

  if (!product) return null;

  return (
    <Modal open={open} onOpenChange={handleOpenChange} disableOutsideClick title={product.name}>
      <div className="p-4 space-y-4">
        {product.image && (
          <div className="aspect-square bg-muted rounded-lg overflow-hidden max-w-[200px] mx-auto">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        )}

        <p className="text-primary font-bold text-lg text-center">
          ₦{(matchedVariant?.price ?? product.price / 100).toLocaleString()}
        </p>

        {derivedOptions.length === 0 && variants.length === 0 && (
          <p className="text-center text-muted-foreground">No variants for this product.</p>
        )}

        {derivedOptions.map((opt) => (
          <div key={opt.name}>
            <p className="text-sm font-semibold mb-1.5">{opt.name}</p>
            <div className="flex gap-2 flex-wrap">
              {opt.values.map((val) => {
                const hasStock = variants.some(
                  (v) => v.combinations?.[opt.name] === val && v.stock > 0,
                );
                const isSelected = selectedOptions[opt.name] === val;
                return (
                  <button
                    key={val}
                    onClick={() =>
                      setSelectedOptions((prev) => ({ ...prev, [opt.name]: val }))
                    }
                    disabled={!hasStock}
                    className={`px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : hasStock
                          ? "bg-muted text-foreground hover:bg-muted/80"
                          : "bg-muted/50 text-muted-foreground/50 line-through cursor-not-allowed"
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {matchedVariant && (
          <p className="text-sm text-muted-foreground text-center">
            Stock: {matchedVariant.stock} available
          </p>
        )}

        <div className="flex gap-3 justify-end border-t pt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!matchedVariant}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Modal>
  );
}
