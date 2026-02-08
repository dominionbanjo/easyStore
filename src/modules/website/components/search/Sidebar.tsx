import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import {
  Filter as FilterIcon,
  RotateCcw,
  ChevronDown,
  Check,
  X,
  Star as StarIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Slider } from "@/components/ui/slider";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { FormPriceInput } from "@/components/shared/form/FormPriceInput";
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
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-card/50 backdrop-blur-md border rounded-[2rem] shadow-2xl shadow-primary/5 overflow-hidden sticky top-24"
      >
        <div className="p-6 bg-primary/[0.03] border-b border-primary/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <FilterIcon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-extrabold text-base tracking-tight text-foreground">
              Filters
            </h3>
          </div>
          <ResetButton />
        </div>
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
          <FilterContent products={products} />
        </div>
      </motion.div>
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
          className="w-full h-12 md:h-11 gap-3 lg:hidden rounded-2xl border-zinc-200 dark:border-emerald-500/20 bg-white dark:bg-neutral-900 backdrop-blur-xl hover:bg-zinc-50 dark:hover:bg-neutral-800 transition-all font-black text-xs shadow-sm justify-center group uppercase tracking-[0.15em] active:scale-95 text-zinc-900 dark:text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <FilterIcon className="h-4 w-4 text-emerald-500 dark:text-emerald-400 group-hover:rotate-12 transition-transform relative z-10" />
          <span className="relative z-10">Filter Products</span>
          {activeCount > 0 && (
            <Badge
              variant="default"
              className="px-2 h-5 min-w-5 flex items-center justify-center rounded-lg text-[10px] ml-0.5 bg-emerald-500 text-white dark:text-neutral-950 border-none shadow-md shadow-emerald-500/30 dark:shadow-emerald-500/20 relative z-10"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[92vh] rounded-t-[3rem] border-t-0 shadow-2xl bg-card/95 backdrop-blur-xl">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-muted/30 mt-3" />
        <DrawerHeader className="text-left px-8 pt-6 pb-6 border-b border-primary/5">
          <div className="flex items-center justify-between w-full">
            <div>
              <DrawerTitle className="text-2xl font-black flex items-center gap-3 tracking-tighter">
                Filters
              </DrawerTitle>
              <DrawerDescription className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest mt-1">
                Customize your view
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 bg-muted/20"
              >
                <X size={18} />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto custom-scrollbar flex-1">
          <FilterContent
            mobile
            products={products}
            onClose={() => setIsOpen(false)}
          />
        </div>

        <DrawerFooter className="pt-6 pb-12 border-t border-primary/5 bg-background/50 backdrop-blur-md px-8">
          <div className="flex gap-4">
            <ResetButton
              onReset={() => setIsOpen(false)}
              className="flex-1 h-14 rounded-2xl text-sm font-black border-2 border-muted hover:bg-muted/50 transition-all uppercase tracking-widest"
            />
            <DrawerClose asChild>
              <Button className="flex-[1.5] h-14 rounded-2xl shadow-2xl shadow-primary/30 font-black tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98] text-white">
                Show {products.length} Items
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

  /* ───────────────── ANIMATION VARIANTS ───────────────── */

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

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

  const selectedSizes = watch("sizes");
  const selectedColors = watch("colors");
  const watchedMinPrice = watch("minPrice");
  const watchedMaxPrice = watch("maxPrice");

  // Sync internal form state when params change
  useEffect(() => {
    const min = Number(params.get("minPrice")) || 0;
    const max = Number(params.get("maxPrice")) || MAX_PRICE_RANGE;
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn("space-y-0", mobile ? "touch-action-pan-y" : "")}
      >
        {/* Price Range */}
        <motion.div variants={itemVariants}>
          <Section
            title="Price Range"
            defaultOpen
            isActive={watchedMinPrice > 0 || watchedMaxPrice < MAX_PRICE_RANGE}
            onClear={() => {
              setValue("minPrice", 0);
              setValue("maxPrice", MAX_PRICE_RANGE);
              handlePriceCommit([0, MAX_PRICE_RANGE]);
            }}
          >
            <div className="space-y-6">
              <div className="px-1">
                <Slider
                  max={MAX_PRICE_RANGE}
                  step={100}
                  value={[watchedMinPrice, watchedMaxPrice]}
                  onValueChange={(val) => {
                    setValue("minPrice", val[0]);
                    setValue("maxPrice", val[1]);
                  }}
                  onValueCommit={handlePriceCommit}
                  className="my-4"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <FormPriceInput
                    name="minPrice"
                    placeholder="Min"
                    className="h-9"
                    icon={<span className="text-xs font-bold">₦</span>}
                  />
                </div>
                <div className="relative">
                  <FormPriceInput
                    name="maxPrice"
                    placeholder="Max"
                    className="h-9"
                    icon={<span className="text-xs font-bold">₦</span>}
                  />
                </div>
              </div>

              <Button
                className="w-full h-10 rounded-xl font-semibold bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-xs"
                onClick={() =>
                  handlePriceCommit([watchedMinPrice, watchedMaxPrice])
                }
              >
                Apply Filter
              </Button>
            </div>
          </Section>
        </motion.div>

        {/* Location (State Only) */}
        <motion.div variants={itemVariants}>
          <Section
            title="Location"
            defaultOpen
            isActive={
              methods.watch("state") !== "all" && !!methods.watch("state")
            }
            onClear={() => {
              setValue("state", "all");
              updateParam("state", "");
            }}
          >
            <div className="space-y-3">
              <FormSelect
                name="state"
                label="State"
                options={[
                  { label: "All States", value: "all" },
                  ...stateOptions,
                ]}
                placeholder="Select State"
              />
              <EffectListener
                val={methods.watch("state")}
                onChange={(val) =>
                  updateParam("state", val === "all" ? "" : val)
                }
              />
            </div>
          </Section>
        </motion.div>

        {/* Ratings */}
        <motion.div variants={itemVariants}>
          <Section
            title="Rating"
            isActive={!!params.get("rating")}
            onClear={() => updateParam("rating", undefined)}
          >
            <div className="grid grid-cols-2 gap-2">
              {RATINGS.map((r) => {
                const isSelected = params.get("rating") === String(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() =>
                      updateParam("rating", isSelected ? undefined : String(r))
                    }
                    className={cn(
                      "flex items-center justify-center gap-1.5 p-2 rounded-xl border transition-all text-xs font-bold",
                      isSelected
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 py-2"
                        : "bg-white text-muted-foreground border-border/50 hover:bg-muted/30",
                    )}
                  >
                    <StarIcon
                      size={12}
                      className={cn(
                        isSelected
                          ? "fill-white"
                          : "fill-amber-400 text-amber-400",
                      )}
                    />
                    {r}+ Stars
                  </button>
                );
              })}
            </div>
          </Section>
        </motion.div>

        {/* Sizes */}
        <motion.div variants={itemVariants}>
          <Section
            title="Sizes"
            isActive={selectedSizes.length > 0}
            onClear={() => {
              setValue("sizes", []);
              updateParam("sizes", undefined);
            }}
          >
            {availableSizes.length === 0 && (
              <p className="text-[10px] text-muted-foreground/50 italic py-2">
                No sizes available in results
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <div
                    key={size}
                    onClick={() =>
                      toggleArrayItem("sizes", size, selectedSizes)
                    }
                    className={cn(
                      "cursor-pointer text-[10px] font-black uppercase border rounded-xl h-10 min-w-[44px] px-3 flex items-center justify-center transition-all",
                      isSelected
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                        : "bg-white text-muted-foreground border-border/50 hover:border-primary/30 hover:bg-primary/[0.02]",
                    )}
                  >
                    {size}
                  </div>
                );
              })}
            </div>
          </Section>
        </motion.div>

        {/* Colors */}
        <motion.div variants={itemVariants}>
          <Section
            title="Colors"
            isActive={selectedColors.length > 0}
            onClear={() => {
              setValue("colors", []);
              updateParam("colors", undefined);
            }}
          >
            {availableColors.length === 0 && (
              <p className="text-[10px] text-muted-foreground/50 italic py-2">
                No colors available in results
              </p>
            )}
            <div className="grid grid-cols-5 gap-y-4 gap-x-2 pt-2">
              {availableColors.map((color) => {
                const isSelected = selectedColors.includes(color.value);
                const isWhite = color.value.toLowerCase() === "white";
                return (
                  <div
                    key={color.value}
                    onClick={() =>
                      toggleArrayItem("colors", color.value, selectedColors)
                    }
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full border-2 border-transparent shadow-sm flex items-center justify-center transition-all group-hover:scale-110",
                        isSelected
                          ? "border-primary scale-110 shadow-lg shadow-primary/20"
                          : "border-border/50",
                      )}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={cn(
                            "h-4 w-4",
                            isWhite ? "text-black" : "text-white",
                          )}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[9px] font-bold truncate w-full text-center transition-colors uppercase tracking-tight",
                        isSelected ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {color.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Section>
        </motion.div>
      </motion.div>
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
  isActive = false,
  onClear,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isActive?: boolean;
  onClear?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-primary/5 last:border-0 overflow-hidden">
      <div className="flex items-center justify-between py-6 px-6 cursor-pointer select-none group hover:bg-primary/[0.01] transition-all">
        <div
          className="flex-1 flex items-center gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-primary transition-colors">
            {title}
          </h4>
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full bg-primary transition-all duration-500",
              isActive ? "opacity-100 scale-100" : "opacity-0 scale-0",
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          {isActive && onClear && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-[9px] font-black uppercase tracking-tighter text-primary hover:text-primary/70 transition-colors bg-primary/10 px-2 py-1 rounded-lg"
            >
              Clear
            </button>
          )}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "p-1.5 rounded-xl text-muted-foreground/30 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300",
              isOpen ? "rotate-180" : "",
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "circOut" }}
          >
            <div className="px-6 pb-8">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
