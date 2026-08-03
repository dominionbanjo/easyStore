import { useEffect, useState, useMemo } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import {
  Plus,
  Trash2,
  Tag,
  Box,
  Settings2,
  Zap,
  X,
  Palette,
  Edit2,
  RotateCcw,
} from "lucide-react";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { cn } from "@/lib/utils";
import { FormPriceInput } from "@/components/shared/form/FormPriceInput";
import { FormInput } from "@/components/shared/form/FormInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChipSection from "./ChipSection";
import { ColorSelectModal } from "./ColorSelectModal";
import { SectionTooltip } from "@/components/shared/SectionTooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ───────────────── TYPES ───────────────── */

interface Option {
  id?: string;
  name: string;
  values: string[];
}

interface VariantField {
  id: string;
  combinations: Record<string, string>;
  sku?: string;
  price: number;
  stock: number;
  discount_price?: number | null;
}

const OPTION_NAME_SUGGESTIONS = [
  { label: "Color", value: "Color" },
  { label: "Size", value: "Size" },
  { label: "Dimensions", value: "Dimensions" },
  { label: "Material", value: "Material" },
  { label: "Weight", value: "Weight" },
  { label: "Style", value: "Style" },
  { label: "Storage", value: "Storage" },
  { label: "Custom Name", value: "custom" },
];

export function VariantBuilderSection() {
  const { control, getValues, watch, setValue } = useFormContext();
  const [editingNameIndex, setEditingNameIndex] = useState<number | null>(null);
  const [customNames, setCustomNames] = useState<Record<number, string>>({});

  const {
    fields: optionFields,
    prepend: prependOption,
    remove: removeOption,
    update: updateOption,
  } = useFieldArray({
    control,
    name: "options",
  });

  const { fields: variantFields, replace: replaceVariants } = useFieldArray({
    control,
    name: "variants",
  });

  const watchedOptions = useWatch({ control, name: "options" });
  const options = useMemo(() => (watchedOptions as Option[]) || [], [watchedOptions]);
  const variants = useWatch({ control, name: "variants" });

  // Generate combinations (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Skip generation if options or some options are missing names
      const processedOptions = options.filter(
        (o) => o.name && o.name.trim().length > 0,
      );

      if (processedOptions.length === 0) {
        if (((variants as VariantField[]) || []).length > 0) {
          replaceVariants([]);
        }
        return;
      }

      // If any option has no values yet, skip generation entirely.
      // This prevents placeholder combinations from overwriting real data
      // that was loaded from the backend during edit-mode hydration.
      const anyOptionEmpty = processedOptions.some(
        (o) => !o.values || o.values.length === 0,
      );
      if (anyOptionEmpty) return;

      const generateCombinations = (
        opts: Option[],
        current: Record<string, string> = {},
        index = 0,
      ): Record<string, string>[] => {
        if (index === opts.length) return [current];
        const result: Record<string, string>[] = [];
        const option = opts[index];
        const values = option.values;

        for (const val of values) {
          result.push(
            ...generateCombinations(
              opts,
              { ...current, [option.name]: val },
              index + 1,
            ),
          );
        }
        return result;
      };

      const combinations = generateCombinations(processedOptions);
      const hydratedVariants = (variants as VariantField[]) || [];

      // Optimize lookup with Hash Map O(N) instead of O(N*M)
      const getStableKey = (obj: Record<string, string>) =>
        JSON.stringify(Object.entries(obj).sort());
      const existingMap = new Map();
      for (const v of hydratedVariants as VariantField[]) {
        if (v.combinations) {
          existingMap.set(getStableKey(v.combinations), v);
        }
      }

      const nextVariants = combinations.map((combo) => {
        const existing = existingMap.get(getStableKey(combo));

        return existing
          ? { ...existing }
          : {
              combinations: combo,
              price: null as unknown as number,
              stock: null as unknown as number,
              discount_price: null,
              sku: "",
            };
      });

      const currentSerialized = JSON.stringify(
        (hydratedVariants as VariantField[]).map((v) => v.combinations),
      );
      const nextSerialized = JSON.stringify(
        nextVariants.map((v) => v.combinations),
      );

      if (currentSerialized !== nextSerialized) {
        replaceVariants(nextVariants);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [options, variants, replaceVariants]);

  const addOption = () => {
    prependOption({ name: "", values: [] });
    setEditingNameIndex(0);
  };

  const [bulkValues, setBulkValues] = useState({
    price: "",
    stock: "",
    discount_price: "",
  });
  const [bulkTarget, setBulkTarget] = useState("all");

  const targetOptions = useMemo(() => {
    const opts = Array.from(
      new Set(
        options.flatMap((opt) =>
          opt.name && opt.values?.length
            ? opt.values.map((v) => `${opt.name}: ${v}`)
            : [],
        ),
      ),
    ).map((val) => ({ label: val, value: val }));

    opts.unshift({ label: "All Variants", value: "all" });
    return opts;
  }, [options]);

  const applyBulkEdit = () => {
    const p = bulkValues.price;
    const s = bulkValues.stock;
    const d = bulkValues.discount_price;

    if (p === "" && s === "" && d === "") return;

    const priceNum = p === "" ? null : Number(p);
    const stockNum = s === "" ? null : Number(s);
    const discountNum = d === "" ? null : Number(d);

    variantFields.forEach((_v, index) => {
      const variantItem = getValues(`variants.${index}`) as VariantField;
      if (!variantItem || !variantItem.combinations) return;

      const matches =
        bulkTarget === "all" ||
        (bulkTarget.includes(": ") &&
          variantItem.combinations[bulkTarget.split(": ")[0]] ===
            bulkTarget.split(": ")[1]);

      if (matches) {
        if (p !== "") setValue(`variants.${index}.price`, priceNum);
        if (s !== "") setValue(`variants.${index}.stock`, stockNum);
        if (d !== "") setValue(`variants.${index}.discount_price`, discountNum);
      }
    });

    setBulkValues({ price: "", stock: "", discount_price: "" });
  };

  return (
    <div className="space-y-8">
      {/* Options Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Product Options
            </Label>
            <SectionTooltip content="Create options like Size or Color. Your choices here automatically generate the Variant Matrix below." />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addOption}
            className="rounded-sm  text-xs h-8 px-3 border-dashed border-primary/40 text-primary"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Option
          </Button>
        </div>

        <div className="space-y-4">
            {optionFields.map((field, index: number) => (
              <div
                key={field.id}
                className="rounded-sm border border-border/40 bg-muted/5 transition-all relative overflow-hidden"
              >
                <div className="flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-border/10 p-4 md:p-5 bg-muted/20">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-sm bg-primary/10 flex items-center justify-center ">
                        <span className="text-xs font-black text-primary">
                          V{index + 1}
                        </span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                        Option Axis
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="h-8 w-8 rounded-sm text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Body */}
                  <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
                      <div className="md:col-span-4 space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-1 flex items-center gap-2">
                          <Settings2 className="h-3 w-3 text-primary" />
                          Option Name
                        </Label>

                        {!options[index]?.name || editingNameIndex === index ? (
                          <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                            {customNames[index] !== undefined ||
                            (options[index]?.name &&
                              !OPTION_NAME_SUGGESTIONS.some(
                                (s) => s.value === options[index]?.name,
                              )) ? (
                              <div className="space-y-3">
                                <div className="relative group">
                                  <Input
                                    autoFocus
                                    placeholder="Enter custom name..."
                                    className="h-12 md:h-14 rounded-sm bg-background border-primary/20 focus:ring-primary/20 transition-all font-bold text-base md:text-lg pr-12"
                                    defaultValue={options[index]?.name || ""}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        const val = (
                                          e.target as HTMLInputElement
                                        ).value.trim();
                                        if (val) {
                                          const currentOpt = getValues(
                                            `options.${index}`,
                                          );
                                          updateOption(index, {
                                            ...currentOpt,
                                            name: val,
                                          });
                                          setEditingNameIndex(null);
                                          setCustomNames((prev) => {
                                            const next = { ...prev };
                                            delete next[index];
                                            return next;
                                          });
                                        }
                                      }
                                    }}
                                    onBlur={(e) => {
                                      const val = e.target.value.trim();
                                      if (val) {
                                        const currentOpt = getValues(
                                          `options.${index}`,
                                        );
                                        updateOption(index, {
                                          ...currentOpt,
                                          name: val,
                                        });
                                        setEditingNameIndex(null);
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCustomNames((prev) => {
                                        const next = { ...prev };
                                        delete next[index];
                                        return next;
                                      });
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-sm bg-muted hover:bg-muted-foreground/10 flex items-center justify-center transition-colors"
                                  >
                                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                </div>
                                <p className="text-[10px] text-muted-foreground/50 ml-1 italic">
                                  Press Enter to confirm custom name
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <FormSelect
                                  name={`options.${index}.name`}
                                  options={OPTION_NAME_SUGGESTIONS}
                                  placeholder="Select Option (e.g. Size)"
                                  className="[&_button]:h-12 md:[&_button]:h-14 [&_button]:rounded-sm"
                                  onValueChange={(val) => {
                                    if (val && val !== "custom") {
                                      const currentValues =
                                        getValues(`options.${index}.values`) ||
                                        [];
                                      updateOption(index, {
                                        name: val,
                                        values: currentValues,
                                      });
                                      setEditingNameIndex(null);
                                    }
                                  }}
                                />
                                {watch(`options.${index}.name`) ===
                                  "custom" && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 rounded-sm border-dashed"
                                    onClick={() =>
                                      setCustomNames((prev) => ({
                                        ...prev,
                                        [index]: "",
                                      }))
                                    }
                                  >
                                    Setup Custom Name
                                  </Button>
                                )}
                                {watch(`options.${index}.name`) &&
                                  watch(`options.${index}.name`) !== "custom" &&
                                  editingNameIndex === index && (
                                    <Button
                                      type="button"
                                      className="w-full h-12 rounded-sm"
                                      onClick={() => setEditingNameIndex(null)}
                                    >
                                      Confirm Selection
                                    </Button>
                                  )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="group relative">
                            <div className="h-14 md:h-16 rounded-sm bg-primary/5 border border-primary/20 flex items-center justify-between px-4 md:px-6 transition-all group-hover:bg-primary/10">
                              <span className="text-base md:text-lg font-black text-primary capitalize tracking-tighter">
                                {options[index]?.name}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingNameIndex(index)}
                                className="h-10 w-10 rounded-sm bg-background  hover:bg-primary hover:text-white transition-all scale-90 group-hover:scale-100"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground/40 mt-2 ml-1 font-bold uppercase tracking-widest">
                              Click edit to change axis
                            </p>
                          </div>
                        )}
                      </div>

                      <div
                        className={cn(
                          "md:col-span-8 transition-all duration-500",
                          !options[index]?.name && editingNameIndex !== index
                            ? "opacity-20 pointer-events-none grayscale"
                            : "opacity-100",
                        )}
                      >
                        {options[index]?.name?.trim()?.toLowerCase() ===
                        "color" ? (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-8 w-8 rounded-sm bg-primary/10 flex items-center justify-center">
                                <Palette className="h-4 w-4 text-primary" />
                              </div>
                              <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground/80">
                                Color Palette Selection
                              </Label>
                            </div>
                            <ColorSelectModal
                              selectedValues={options[index]?.values || []}
                              onChange={(vals) => {
                                const currentOpt = getValues(
                                  `options.${index}`,
                                );
                                updateOption(index, {
                                  ...currentOpt,
                                  values: vals,
                                });
                              }}
                            />
                            <div className="flex flex-wrap gap-2 mt-4 p-5 rounded-sm bg-muted/5 border border-border/40 min-h-[120px] border-dashed">
                              {(options[index]?.values || []).length > 0 ? (
                                (options[index]?.values || []).map((v) => (
                                  <Badge
                                    key={v}
                                    variant="secondary"
                                    className="bg-primary/10 text-primary border-none rounded-sm h-7 md:h-9 px-3 text-[9px] md:text-xs font-black flex items-center gap-2"
                                  >
                                    {v}
                                    <button
                                      type="button"
                                      className="p-1 hover:bg-primary/20 rounded-sm transition-colors"
                                      onClick={() => {
                                        const currentOpt = getValues(
                                          `options.${index}`,
                                        ) as Option;
                                        updateOption(index, {
                                          ...currentOpt,
                                          values: (
                                            currentOpt.values || []
                                          ).filter((x: string) => x !== v),
                                        });
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))
                              ) : (
                                <div className="w-full flex flex-col items-center justify-center text-center py-6 gap-2">
                                  <Palette className="h-6 w-6 text-muted-foreground/20" />
                                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-xs">
                                    No Colors Selected
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <ChipSection
                            label="Values"
                            values={options[index]?.values || []}
                            onAdd={(v: string) => {
                              const currentOpt = getValues(
                                `options.${index}`,
                              ) as Option;
                              const currentVals = currentOpt?.values || [];
                              if (!currentVals.includes(v)) {
                                updateOption(index, {
                                  ...currentOpt,
                                  values: [...currentVals, v],
                                });
                              }
                            }}
                            onRemove={(v: string) => {
                              const currentOpt = getValues(
                                `options.${index}`,
                              ) as Option;
                              updateOption(index, {
                                ...currentOpt,
                                values: (currentOpt.values || []).filter(
                                  (val: string) => val !== v,
                                ),
                              });
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {optionFields.length === 0 && (
            <div className="p-12 text-center border-2 border-dashed rounded-sm bg-muted/5 border-border/40 flex flex-col items-center gap-4 group hover:bg-muted/10 hover:border-primary/20 transition-all cursor-pointer"
              onClick={addOption}
            >
              <div className="h-16 w-16 rounded-sm bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Settings2 className="h-8 w-8 text-primary/40 group-hover:text-primary/60 transition-colors" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                  No Options Created
                </h3>
                <p className="text-muted-foreground/40 text-xs max-w-[280px] leading-relaxed">
                  Start by adding custom options like **Size** or **Color** to
                  auto-generate product variants.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-sm h-10 px-6 border-primary/20 text-primary"
              >
                Create First Option
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Variants Matrix */}
      {variantFields.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-border/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Box className="h-4 w-4" />
                  Variant Matrix
                </Label>
                <SectionTooltip content="Set the individual prices and stock limits for each unique combination of your options." />
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">
                Set individual price & stock for generated combinations.
              </p>
            </div>

            {/* Advanced Bulk Edit Bar */}
            <div className="flex flex-col gap-4 p-4 bg-muted/10 rounded-sm border border-border/40 mt-3 md:mt-0 w-full md:max-w-xl md:ml-auto">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  Bulk Edit Setup
                  <SectionTooltip content="Quickly apply price, stock, or discount to all variants or target specific groups (e.g. all 'Large' sizes)." />
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="space-y-1 md:col-span-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                    Apply To
                  </Label>
                  <Select value={bulkTarget} onValueChange={setBulkTarget}>
                    <SelectTrigger className="h-9 rounded-sm bg-background border-muted-foreground/20 text-xs">
                      <SelectValue placeholder="Target Options" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="max-h-[300px] overflow-y-auto w-full"
                    >
                      {targetOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-8 flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Price"
                    className="h-9 w-full text-xs rounded-sm bg-background border-muted-foreground/20 focus-visible:ring-primary/20"
                    value={bulkValues.price}
                    onChange={(e) =>
                      setBulkValues((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Discount"
                    className="h-9 w-full text-xs rounded-sm bg-background border-muted-foreground/20 focus-visible:ring-primary/20"
                    value={bulkValues.discount_price}
                    onChange={(e) =>
                      setBulkValues((prev) => ({
                        ...prev,
                        discount_price: e.target.value,
                      }))
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Stock"
                    className="h-9 w-full text-xs rounded-sm bg-background border-muted-foreground/20 focus-visible:ring-primary/20"
                    value={bulkValues.stock}
                    onChange={(e) =>
                      setBulkValues((prev) => ({
                        ...prev,
                        stock: e.target.value,
                      }))
                    }
                  />
                  <Button
                    type="button"
                    className="h-9 px-4 rounded-sm bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                    onClick={applyBulkEdit}
                    disabled={
                      !bulkValues.price &&
                      !bulkValues.stock &&
                      !bulkValues.discount_price
                    }
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Desktop header */}
            <div className="hidden md:grid grid-cols-[1fr_110px_110px_110px_110px] gap-3 px-4 mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              <div>Variant</div>
              <div>SKU (Opt)</div>
              <div>Price</div>
              <div>Discount</div>
              <div>Stock</div>
            </div>

            <div className="space-y-3">
                {variantFields.map((field, index: number) => {
                  const variantData = field as unknown as VariantField;
                  const comboValues = Object.values(
                    variantData.combinations || {},
                  );
                  return (
                    <div
                      key={field.id}
                      className="flex flex-col md:grid md:grid-cols-[1fr_110px_110px_110px_110px] gap-2 md:gap-3 p-3 md:p-4 rounded-sm border border-border/40 bg-background/50 hover:bg-white dark:hover:bg-neutral-900 transition-all duration-300 relative group"
                    >
                      {/* Combination Tags */}
                      <div className="flex items-center flex-wrap gap-2 w-full">
                        {comboValues.map((v, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="font-black text-[10px] h-6 px-2.5 bg-primary/10 text-primary border-none rounded-sm "
                          >
                            {String(v)}
                          </Badge>
                        ))}
                      </div>

                      {/* On mobile: 2-column grid. On md+: each is a grid cell */}
                      <div className="md:contents grid grid-cols-2 gap-2 w-full">
                        {/* SKU */}
                        <div className="space-y-1 w-full">
                          <span className="md:hidden text-[9px] font-black text-muted-foreground/60 uppercase ml-1">
                            SKU
                          </span>
                          <FormInput
                            name={`variants.${index}.sku`}
                            placeholder="SKU-123"
                            className="space-y-0"
                            inputClassName="h-9 text-[11px] rounded-sm bg-muted/20 border-transparent focus:border-primary/20 focus:bg-background transition-all"
                          />
                        </div>

                        {/* Price Field */}
                        <div className="space-y-1 w-full">
                          <span className="md:hidden text-[9px] font-black text-muted-foreground/60 uppercase ml-1">
                            Price
                          </span>
                          <FormPriceInput
                            name={`variants.${index}.price`}
                            placeholder="0.00"
                            className="space-y-0"
                            inputClassName="h-9 text-[11px] pl-7 rounded-sm bg-muted/20 border-transparent focus:border-primary/20 focus:bg-background transition-all"
                            icon={
                              <Tag className="h-3 w-3 text-muted-foreground/60" />
                            }
                          />
                        </div>

                        {/* Discount Field */}
                        <div className="space-y-1 w-full">
                          <span className="md:hidden text-[9px] font-black text-muted-foreground/60 uppercase ml-1">
                            Discount
                          </span>
                          <FormPriceInput
                            name={`variants.${index}.discount_price`}
                            placeholder="Opt"
                            className="space-y-0"
                            inputClassName="h-9 text-[11px] pl-7 rounded-sm bg-muted/20 border-transparent focus:border-primary/20 focus:bg-background transition-all"
                            icon={
                              <Tag className="h-3 w-3 text-muted-foreground/60" />
                            }
                          />
                        </div>

                        {/* Stock Field */}
                        <div className="space-y-1 w-full">
                          <span className="md:hidden text-[9px] font-black text-muted-foreground/60 uppercase ml-1">
                            Stock
                          </span>
                          <FormInput
                            name={`variants.${index}.stock`}
                            type="number"
                            placeholder="0"
                            className="space-y-0"
                            inputClassName="h-9 text-[11px] pl-7 rounded-sm bg-muted/20 border-transparent focus:border-primary/20 focus:bg-background transition-all"
                            icon={
                              <Box className="h-3 w-3 text-muted-foreground/60" />
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
