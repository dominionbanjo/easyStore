import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { RotateCcw } from "lucide-react";
import {
  Setting4,
  ArrowDown2,
  Sort,
  Routing,
  Star1,
  Filter,
  Colorfilter,
  Size,
  RotateLeft,
  TickCircle,
  CloseCircle,
} from "iconsax-react";

import { Slider } from "@/components/ui/slider";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { FormPriceInput } from "@/components/shared/form/FormPriceInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import type { IProduct } from "@/types/product/productTypes";
import { NigeriaData } from "@/utils/nigeria-data";

/* ───────────────── CONSTANTS ───────────────── */

const RATINGS = [4, 3, 2, 1];
const MAX_PRICE_RANGE = 500000;
const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating_desc" },
  { label: "Newest Arrivals", value: "date_desc" },
];

const COLOR_MAP: Record<string, string> = {
  white: "#FFFFFF",
  black: "#000000",
  charcoal: "#36454F",
  "dark orange": "#FF8C00",
  "navy blue": "#000080",
  burgundy: "#800020",
  beige: "#F5F5DC",
  cream: "#FFFDD0",
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
  olive: "#808000",
  teal: "#008080",
  maroon: "#800000",
  brown: "#A52A2A",
  tan: "#D2B48C",
  khaki: "#F0E68C",
  gray: "#808080",
  grey: "#808080",
  "light gray": "#D3D3D3",
  "dark gray": "#A9A9A9",
};

/* ───────────────── TYPES ───────────────── */

type FilterForm = {
  minPrice: number;
  maxPrice: number;
  state: string;
  rating?: string;
};

type Option = { label: string; value: string };

interface SearchFiltersProps {
  className?: string;
  products?: IProduct[];
  /** Aggregated variant combination options from the search API response.
   *  Keys are option names (e.g. "Color", "Size"), values are unique sorted strings. */
  filters?: Record<string, string[]>;
}

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
  products: _products = [],
  filters = {},
}: SearchFiltersProps) {
  return (
    <div className={cn("hidden lg:block w-full space-y-6", className)}>
      <div
        className="bg-card/50 backdrop-blur-sm border rounded-sm overflow-hidden sticky top-20 shadow-sm"
      >
        <div className="p-4 bg-primary/[0.03] border-b border-primary/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Setting4
              variant="Outline"
              color="currentColor"
              size={16}
              className="text-primary"
            />
            <h3 className="font-black text-[12px] uppercase tracking-[0.1em] text-foreground">
              Filters
            </h3>
          </div>
          <ResetButton variant="text" />
        </div>
        <div className="max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
          <FilterContent filters={filters} />
        </div>
      </div>
    </div>
  );
}

export function MobileSearchFilters({
  filters = {},
}: {
  products?: IProduct[];
  filters?: Record<string, string[]>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [params] = useSearchParams();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // More aggressive scroll detection for different containers
      const scrollPos =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      const isMobile = window.innerWidth < 1024; // Align with lg breakpoint
      setIsScrolled(scrollPos > 150 && isMobile);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Also listen on document for capturing phase just in case
    document.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });

    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const activeCount = useMemo(() => {
    let count = 0;
    const skipParams = ["q", "page", "limit", "sort", "_lr"];
    params.forEach((_, key) => {
      if (!skipParams.includes(key)) {
        count++;
      }
    });
    return count;
  }, [params]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <div
          className={cn(
            "transition-all duration-300",
            isScrolled
              ? "fixed bottom-24 left-6 z-[9999] pointer-events-auto scale-100 opacity-100"
              : "flex-1",
          )}
        >
          <button
            className={cn(
              "flex items-center justify-center transition-all duration-500 group relative",
              isScrolled
                ? "h-14 w-14 rounded-full bg-primary text-white shadow-[0_8px_32px_rgba(16,185,129,0.3)] border-2 border-white/20 hover:scale-105 active:scale-95"
                : "w-full gap-2 h-10 px-4 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-zinc-200/50 dark:hover:bg-white/5 rounded-l-full",
            )}
          >
            <Setting4
              variant="Outline"
              color="currentColor"
              size={isScrolled ? 20 : 16}
              className={cn(
                "transition-transform duration-500",
                !isScrolled && "text-primary group-hover:rotate-90",
                isScrolled && "rotate-0",
              )}
            />
            {!isScrolled && <span>Refine</span>}
            {activeCount > 0 && (
              <Badge
                variant="default"
                className={cn(
                  "px-2 h-4 min-w-4 flex items-center justify-center rounded-sm text-[8px] transition-all",
                  isScrolled
                    ? "absolute -top-1 -right-1 bg-white text-primary font-black shadow-sm"
                    : "ml-1 bg-emerald-500 text-white dark:text-neutral-950 border-none relative z-10",
                )}
              >
                {activeCount}
              </Badge>
            )}
          </button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-h-[92vh] rounded-t-sm border-t-0 flex flex-col bg-card/95 backdrop-blur-xl">
        <div className="mx-auto w-12 h-1.5 rounded-sm bg-muted/30 mt-3" />
        <DrawerHeader className="text-left px-8 pt-4 pb-4 border-b border-primary/5">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <DrawerTitle className="text-xl font-black flex items-center gap-2 tracking-tighter">
                Filters
              </DrawerTitle>
              <DrawerDescription className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-0.5">
                Customize your view
              </DrawerDescription>
            </div>
            <div className="flex items-center gap-2">
              <ResetButton variant="icon" />
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-sm h-9 w-9 bg-muted/20 text-muted-foreground hover:text-primary"
                >
                  <CloseCircle
                    variant="Outline"
                    color="currentColor"
                    size={20}
                  />
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto custom-scrollbar flex-1">
          <FilterContent
            mobile
            filters={filters}
            onClose={() => setIsOpen(false)}
          />
        </div>

        <DrawerFooter className="pt-4 pb-20 border-t border-primary/5 bg-background/50 backdrop-blur-md px-8">
          <div className="flex justify-start">
            <DrawerClose asChild>
              <Button className="h-11 px-10 rounded-sm font-black tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98] text-white">
                Apply
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
  variant = "text",
}: {
  onReset?: () => void;
  className?: string;
  variant?: "text" | "icon";
}) {
  const [params, setParams] = useSearchParams();

  const handleReset = () => {
    const next = new URLSearchParams();
    if (params.get("q")) next.set("q", params.get("q")!);
    setParams(next);
    onReset?.();
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleReset}
        className={cn(
          "h-9 w-9 rounded-sm bg-muted/20 text-muted-foreground hover:text-primary",
          className,
        )}
        title="Reset Filters"
      >
        <RotateLeft variant="Outline" color="currentColor" size={18} />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleReset}
      className={cn(
        "h-8 px-2 text-[10px] font-black uppercase text-muted-foreground hover:text-foreground hover:bg-muted",
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
  filters = {},
}: {
  mobile?: boolean;
  filters?: Record<string, string[]>;
  onClose?: () => void;
}) {
  console.log("[FilterContent] Rendered with filters:", filters);
  const [params, setParams] = useSearchParams();
  const [stateOptions, setStateOptions] = useState<Option[]>([]);

  // Case-insensitive lookup for specific UI categories
  const colorKey = useMemo(
    () => Object.keys(filters).find((k) => k.toLowerCase() === "color"),
    [filters],
  );

  const colorFilterOptions = useMemo(
    () =>
      (colorKey ? filters[colorKey] : []).map((name) => ({
        label: name,
        value: name,
        hex: "#000000",
      })),
    [filters, colorKey],
  );

  const dynamicFilters = useMemo(() => {
    console.log("[Sidebar] Received filters:", filters);
    const entries = Object.entries(filters);
    console.log("[Sidebar] Dynamic filter entries:", entries);
    return entries;
  }, [filters]);

  const methods = useForm<FilterForm>({
    defaultValues: {
      minPrice: Number(params.get("minPrice")) || 0,
      maxPrice: Number(params.get("maxPrice")) || MAX_PRICE_RANGE,
      state: params.get("state") || "all",
      rating: params.get("rating") || undefined,
    },
  });

  const { setValue, watch } = methods;

  const watchedMinPrice = watch("minPrice");
  const watchedMaxPrice = watch("maxPrice");

  // Sync internal form state when params change
  useEffect(() => {
    const min = Number(params.get("minPrice")) || 0;
    const max = Number(params.get("maxPrice")) || MAX_PRICE_RANGE;
    setValue("minPrice", min);
    setValue("maxPrice", max);
    setValue("state", params.get("state") || "all");
    setValue("rating", params.get("rating") || undefined);
  }, [params, setValue]);

  /* ───────────────── DATA LOADING ───────────────── */
  useEffect(() => {
    setStateOptions(
      NigeriaData.getStates().map((s) => ({
        label: s.name,
        value: s.name,
      })),
    );
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

  return (
    <FormProvider {...methods}>
      <div className={cn("space-y-0", mobile ? "touch-action-pan-y" : "")}>
        {/* Sort By */}
        <div>
          <Section
            title="Sort By"
            icon={<Sort variant="Outline" color="currentColor" size={16} />}
            defaultOpen
            isActive={
              params.get("sort") !== "relevance" && !!params.get("sort")
            }
            onClear={() => updateParam("sort", undefined)}
          >
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => {
                const isSelected =
                  (params.get("sort") || "relevance") === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      updateParam(
                        "sort",
                        option.value === "relevance" ? undefined : option.value,
                      )
                    }
                    className={cn(
                      "px-3 h-9 rounded-sm border text-[10px] font-black uppercase transition-all tracking-wider",
                      isSelected
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-white text-muted-foreground border-border/50 hover:bg-muted/30",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </Section>
        </div>

        {/* Price Range */}
        <div>
          <Section
            title="Price Range"
            icon={<Filter variant="Outline" color="currentColor" size={16} />}
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
                className="w-full h-10 rounded-sm font-semibold bg-primary text-white   hover: transition-all text-xs"
                onClick={() =>
                  handlePriceCommit([watchedMinPrice, watchedMaxPrice])
                }
              >
                Apply Filter
              </Button>
            </div>
          </Section>
        </div>

        {/* Location (State Only) */}
        <div>
          <Section
            title="Location"
            icon={<Routing variant="Outline" color="currentColor" size={16} />}
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
        </div>

        {/* Ratings */}
        <div>
          <Section
            title="Rating"
            icon={<Star1 variant="Outline" color="currentColor" size={16} />}
            defaultOpen
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
                      "flex items-center justify-center gap-1.5 p-2 rounded-sm border transition-all text-xs font-bold",
                      isSelected
                        ? "bg-primary text-white border-primary   py-2"
                        : "bg-white text-muted-foreground border-border/50 hover:bg-muted/30",
                    )}
                  >
                    <Star1
                      variant={isSelected ? "Bold" : "Outline"}
                      color={isSelected ? "currentColor" : "#fbbf24"}
                      size={14}
                    />
                    {r}+ Stars
                  </button>
                );
              })}
            </div>
          </Section>
        </div>

        {/* Dynamic Filters from API (Size, Color, Material, etc.) */}
        {dynamicFilters.map(([key, values]) => {
          const isColor = key.toLowerCase() === "color";
          // Use exact key from API for parameter consistency
          const paramKey = key;
          const activeValues = (params.get(paramKey) ?? "")
            .split(",")
            .filter(Boolean);
          const isActive = activeValues.length > 0;

          // Double check values
          console.log(`[FilterContent] Section ${key}:`, {
            values,
            activeValues,
            isActive,
          });

          return (
            <div key={key}>
              <Section
                title={key}
                icon={
                  isColor ? (
                    <Colorfilter
                      variant="Outline"
                      color="currentColor"
                      size={16}
                    />
                  ) : (
                    <Size variant="Outline" color="currentColor" size={16} />
                  )
                }
                defaultOpen
                isActive={isActive}
                onClear={() => updateParam(paramKey, undefined)}
              >
                {values.length === 0 ? (
                  <div className="py-8 px-4 border-2 border-dashed border-muted/20 rounded-sm flex flex-col items-center justify-center text-center bg-muted/5">
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
                      No {key.toLowerCase()} found
                    </p>
                  </div>
                ) : isColor ? (
                  /* Color Swatch Grid */
                  <div className="grid grid-cols-5 gap-y-4 gap-x-2 pt-2">
                    {colorFilterOptions.map((color) => {
                      const active = activeValues.includes(color.value);
                      const isWhite = color.value.toLowerCase() === "white";
                      return (
                        <div
                          key={color.value}
                          onClick={() => {
                            const next = active
                              ? activeValues.filter((v) => v !== color.value)
                              : [...activeValues, color.value];
                            updateParam(
                              paramKey,
                              next.length > 0 ? next.join(",") : undefined,
                            );
                          }}
                          className="flex flex-col items-center gap-2 cursor-pointer group"
                        >
                          <div
                            className={cn(
                              "w-9 h-9 rounded-sm border-2 border-transparent flex items-center justify-center transition-all group-hover:scale-110 shadow-sm",
                              active
                                ? "border-primary scale-110 shadow-md ring-2 ring-primary/20"
                                : "border-border/50 shadow-inner",
                            )}
                            style={{
                              backgroundColor:
                                COLOR_MAP[color.label.toLowerCase()] ||
                                color.label.toLowerCase().replace(/\s+/g, ""),
                              border: isWhite
                                ? "1px solid #e5e7eb"
                                : "1px solid rgba(0,0,0,0.1)",
                            }}
                          >
                            <span className="text-[8px] font-black pointer-events-none opacity-20">
                              {color.label.charAt(0)}
                            </span>
                            {active && (
                              <TickCircle
                                variant="Bold"
                                color={isWhite ? "#000000" : "#ffffff"}
                                size={16}
                                className="absolute"
                              />
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-[9px] font-black truncate w-[60px] text-center transition-colors uppercase tracking-tight",
                              active ? "text-primary" : "text-muted-foreground",
                            )}
                            title={color.label}
                          >
                            {color.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Standard Chip Grid (Sizes, etc.) */
                  <div className="flex flex-wrap gap-2">
                    {values.map((val) => {
                      const active = activeValues.includes(val);
                      return (
                        <div
                          key={val}
                          onClick={() => {
                            const next = active
                              ? activeValues.filter((v) => v !== val)
                              : [...activeValues, val];
                            updateParam(
                              paramKey,
                              next.length > 0 ? next.join(",") : undefined,
                            );
                          }}
                          className={cn(
                            "cursor-pointer text-[10px] font-black uppercase border rounded-sm h-10 min-w-[44px] px-3 flex items-center justify-center transition-all",
                            active
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-muted-foreground border-border/50 hover:border-primary/30 hover:bg-primary/[0.02]",
                          )}
                        >
                          {val}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Section>
            </div>
          );
        })}
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
  icon,
  children,
  defaultOpen = false,
  isActive = false,
  onClear,
}: {
  title: string;
  icon?: React.ReactNode;
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
          {icon && <div className="text-primary">{icon}</div>}
          <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-primary transition-colors">
            {title}
          </h4>
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-sm bg-primary transition-all duration-500",
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
              className="text-[9px] font-black uppercase tracking-tighter text-primary hover:text-primary/70 transition-colors bg-primary/10 px-2 py-1 rounded-sm"
            >
              Clear
            </button>
          )}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "p-1.5 rounded-sm text-muted-foreground/30 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300",
              isOpen ? "rotate-180" : "",
            )}
          >
            <ArrowDown2 variant="Outline" color="currentColor" size={16} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="px-6 pb-8 animate-in slide-in-from-top-2 fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
