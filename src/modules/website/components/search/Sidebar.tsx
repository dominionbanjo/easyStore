import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import {
  Filter as FilterIcon,
  RotateCcw,
  ChevronDown,
  Minus,
  Check,
} from "lucide-react";

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import type { IProduct } from "@/types/product/productTypes";

/* ───────────────── CONSTANTS ───────────────── */

const RATINGS = [4, 3, 2, 1];
const DEFAULT_COUNTRY = "NG";
const MAX_PRICE_RANGE = 500000;

/* ───────────────── TYPES ───────────────── */

type FilterForm = {
  minPrice: number;
  maxPrice: number;
  state: string;
  colors: string[];
  sizes: string[];
  rating?: string;
};

type Option = { label: string; value: string };

interface SearchFiltersProps {
  className?: string;
  products?: IProduct[];
}

/* ───────────────── UTIL ───────────────── */

const importCSC = () => import("country-state-city");

/* ───────────────── COMPONENTS ───────────────── */

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// ... existing imports ...

export function SearchFiltersSidebar({
  className,
  products = [],
}: SearchFiltersProps) {
  return (
    <div className={cn("hidden lg:block w-full space-y-6", className)}>
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden sticky top-24">
        <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <FilterIcon className="h-4 w-4" /> Filters
          </h3>
          <ResetButton />
        </div>
        <div className="p-3 space-y-0 max-h-[calc(100vh-140px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
          <FilterContent products={products} />
        </div>
      </div>
    </div>
  );
}

export function MobileSearchFilters({
  products = [],
}: {
  products?: IProduct[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [params] = useSearchParams();

  // Count active filters
  const activeCount = useMemo(() => {
    let count = 0;
    if (params.get("minPrice") || params.get("maxPrice")) count++;
    if (params.get("state")) count++;
    if (params.get("colors")) count++;
    if (params.get("sizes")) count++;
    if (params.get("rating")) count++;
    return count;
  }, [params]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 lg:hidden border-dashed"
        >
          <FilterIcon className="h-4 w-4" />
          Filter
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full text-[10px] ml-1"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Filter Products</DrawerTitle>
          <DrawerDescription>Refine your search results.</DrawerDescription>
        </DrawerHeader>

        <div className="py-2 overflow-y-auto custom-scrollbar flex-1">
          <FilterContent
            mobile
            products={products}
            onClose={() => setIsOpen(false)}
          />
        </div>

        <DrawerFooter className="pt-2 pb-8 sm:pb-4 border-t bg-background">
          <div className="flex gap-3">
            <ResetButton onReset={() => setIsOpen(false)} className="flex-1" />
            <DrawerClose asChild>
              <Button className="flex-1 shadow-lg shadow-primary/20">
                Show Results
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ResetButton({
  onReset,
  className,
}: {
  onReset?: () => void;
  className?: string;
}) {
  const [params, setParams] = useSearchParams();

  const handleReset = () => {
    const next = new URLSearchParams();
    if (params.get("q")) next.set("q", params.get("q")!);
    setParams(next);
    onReset?.();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleReset}
      className={cn(
        "h-8 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted",
        className,
      )}
    >
      <RotateCcw className="h-3 w-3 mr-1.5" />
      Reset
    </Button>
  );
}

function FilterContent({
  mobile,
  products,
}: {
  mobile?: boolean;
  products: IProduct[];
  onClose?: () => void;
}) {
  const [params, setParams] = useSearchParams();
  const [stateOptions, setStateOptions] = useState<Option[]>([]);

  // Calculate dynamic options from products
  const { availableColors, availableSizes } = useMemo(() => {
    const colorsMap = new Map<
      string,
      { label: string; value: string; hex: string }
    >();
    const sizesSet = new Set<string>();

    products.forEach((p) => {
      // @ts-ignore - Backend sometimes returns varying structures
      if (Array.isArray(p.colors)) {
        p.colors.forEach((c: any) => {
          let name = "";
          let hex = "";

          if (typeof c === "object" && c.name) {
            name = c.name;
            hex = c.hex || "";
          } else if (typeof c === "string") {
            name = c;
          }

          if (name) {
            const value = hex || name;
            // Use name as key to ensure uniqueness for display, but value is hex if available
            colorsMap.set(name, {
              label: name,
              value: value,
              hex: hex || "#000000",
            });
          }
        });
      }
      if (Array.isArray(p.sizes)) {
        p.sizes.forEach((s) => sizesSet.add(s));
      }
    });

    return {
      availableColors: Array.from(colorsMap.values()),
      availableSizes: Array.from(sizesSet),
    };
  }, [products]);

  const methods = useForm<FilterForm>({
    defaultValues: {
      minPrice: Number(params.get("minPrice")) || 0,
      maxPrice: Number(params.get("maxPrice")) || MAX_PRICE_RANGE,
      state: params.get("state") || "all",
      colors: params.get("colors")?.split(",") || [],
      sizes: params.get("sizes")?.split(",") || [],
      rating: params.get("rating") || undefined,
    },
  });

  const { setValue, watch } = methods;

  // Local state for slider to avoid lag
  const [priceRange, setPriceRange] = useState([
    Number(params.get("minPrice")) || 0,
    Number(params.get("maxPrice")) || MAX_PRICE_RANGE,
  ]);

  const selectedSizes = watch("sizes");
  const selectedColors = watch("colors");
  const watchedMinPrice = watch("minPrice");
  const watchedMaxPrice = watch("maxPrice");

  // Sync internal form state when params change
  useEffect(() => {
    const min = Number(params.get("minPrice")) || 0;
    const max = Number(params.get("maxPrice")) || MAX_PRICE_RANGE;
    setPriceRange([min, max]);
    setValue("minPrice", min);
    setValue("maxPrice", max);
    setValue("state", params.get("state") || "all");
    setValue("colors", params.get("colors")?.split(",") || []);
    setValue("sizes", params.get("sizes")?.split(",") || []);
    setValue("rating", params.get("rating") || undefined);
  }, [params, setValue]);

  /* ───────────────── DATA LOADING ───────────────── */
  useEffect(() => {
    (async () => {
      const { State } = await importCSC();
      const states = State.getStatesOfCountry(DEFAULT_COUNTRY);
      setStateOptions(
        states.map((s) => ({
          label: s.name,
          value: s.name,
        })),
      );
    })();
  }, []);

  /* ───────────────── URL SYNC ───────────────── */

  const updateParam = (key: string, value: string | undefined | null) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    next.set("page", "1");
    setParams(next);
  };

  const handlePriceCommit = (value: number[]) => {
    setValue("minPrice", value[0]);
    setValue("maxPrice", value[1]);

    const next = new URLSearchParams(params);
    if (value[0] > 0) next.set("minPrice", value[0].toString());
    else next.delete("minPrice");

    if (value[1] < MAX_PRICE_RANGE) next.set("maxPrice", value[1].toString());
    else next.delete("maxPrice");

    next.set("page", "1");
    setParams(next);
  };

  const toggleArrayItem = (
    field: "colors" | "sizes",
    item: string,
    currentList: string[],
  ) => {
    const next = currentList.includes(item)
      ? currentList.filter((i) => i !== item)
      : [...currentList, item];

    setValue(field, next);
    updateParam(field, next.length > 0 ? next.join(",") : undefined);
  };

  return (
    <FormProvider {...methods}>
      <div className={cn("space-y-0", mobile ? "touch-action-pan-y" : "")}>
        {/* Price Range */}
        <Section title="Price Range" defaultOpen>
          <div className="pt-2 pb-2 px-1">
            <Slider
              defaultValue={[0, MAX_PRICE_RANGE]}
              value={priceRange}
              max={MAX_PRICE_RANGE}
              step={500}
              minStepsBetweenThumbs={1}
              onValueChange={(val) => {
                setPriceRange(val);
                setValue("minPrice", val[0]);
                setValue("maxPrice", val[1]);
              }}
              onValueCommit={handlePriceCommit}
              className="mb-8"
            />
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <FormInput
                  name="minPrice"
                  type="number"
                  placeholder="Min"
                  className="h-10"
                />
              </div>
              <Minus className="h-3 w-3 text-muted-foreground" />
              <div className="flex-1">
                <FormInput
                  name="maxPrice"
                  type="number"
                  placeholder="Max"
                  className="h-10"
                />
              </div>
            </div>
            {/* Apply button for manual input updates */}
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() =>
                  handlePriceCommit([watchedMinPrice, watchedMaxPrice])
                }
              >
                Apply Price
              </Button>
            </div>
          </div>
        </Section>

        {/* Location (State Only) */}
        <Section title="Location" defaultOpen>
          <div className="space-y-3">
            <FormSelect
              name="state"
              label="State"
              options={[{ label: "All States", value: "all" }, ...stateOptions]}
              placeholder="Select State"
            />
            {/* State listener */}
            <EffectListener
              val={methods.watch("state")}
              onChange={(val) => updateParam("state", val === "all" ? "" : val)}
            />
          </div>
        </Section>

        {/* Ratings */}
        <Section title="Rating">
          <div className="space-y-3">
            {RATINGS.map((r) => (
              <div
                key={r}
                className="flex items-center space-x-2 group cursor-pointer"
                onClick={() => {
                  const current = params.get("rating");
                  updateParam(
                    "rating",
                    current === String(r) ? undefined : String(r),
                  );
                }}
              >
                <Checkbox
                  id={`rating-${r}`}
                  checked={params.get("rating") === String(r)}
                  onCheckedChange={() => {}}
                  className="pointer-events-none"
                />
                <Label
                  htmlFor={`rating-${r}`}
                  className="text-sm font-normal flex items-center gap-2 cursor-pointer w-full group-hover:bg-muted/50 p-1 rounded-md transition-colors pointer-events-none"
                >
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={i < r ? "fill-current" : "text-muted/20"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </Section>

        {/* Sizes */}
        <Section title="Sizes">
          {availableSizes.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              No sizes available in results
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <div
                  key={size}
                  onClick={() => toggleArrayItem("sizes", size, selectedSizes)}
                  className={cn(
                    "cursor-pointer text-xs font-medium border rounded-md h-9 min-w-[36px] px-2 flex items-center justify-center transition-all hover:border-primary/50",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-foreground hover:bg-muted/50",
                  )}
                >
                  {size}
                </div>
              );
            })}
          </div>
        </Section>

        {/* Colors */}
        <Section title="Colors">
          {availableColors.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              No colors available in results
            </p>
          )}
          <div className="grid grid-cols-5 gap-y-3 gap-x-2">
            {availableColors.map((color) => {
              const isSelected = selectedColors.includes(color.value);
              const isWhite = color.value.toLowerCase() === "white";
              return (
                <div
                  key={color.value}
                  onClick={() =>
                    toggleArrayItem("colors", color.value, selectedColors)
                  }
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border shadow-sm flex items-center justify-center transition-all group-hover:scale-110 relative",
                      isSelected ? "ring-2 ring-primary ring-offset-2" : "",
                    )}
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && (
                      <Check
                        className={cn(
                          "h-3 w-3",
                          isWhite ? "text-black" : "text-white",
                        )}
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate w-full text-center group-hover:text-foreground transition-colors">
                    {color.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      </div>
    </FormProvider>
  );
}

function EffectListener({
  val,
  onChange,
}: {
  val: any;
  onChange: (val: any) => void;
}) {
  const [lastVal, setLastVal] = useState(val);
  useEffect(() => {
    if (val !== lastVal) {
      if (val === "" && lastVal === "") return; // Initial mount avoidance if needed
      if (lastVal === undefined && val === "") return; // Avoid clearing on mount
      // Actually, we just want to update URL if value changes
      if (val !== lastVal) {
        onChange(val);
        setLastVal(val);
      }
    }
  }, [val, lastVal, onChange]);
  return null;
}

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/60 last:border-0">
      <div
        className="flex items-center justify-between py-4 px-4 group cursor-pointer select-none hover:bg-muted/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="font-semibold text-[13px] uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
          {title}
        </h4>
        <div
          className={cn(
            "p-1 rounded-md text-muted-foreground/50 group-hover:text-primary transition-all",
            isOpen ? "rotate-180" : "",
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-6 animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
          {children}
        </div>
      )}
    </div>
  );
}
