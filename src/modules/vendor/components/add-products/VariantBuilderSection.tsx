import { useEffect, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  Plus,
  Trash2,
  Tag,
  Box,
  Percent,
  Settings2,
  Zap,
  ArrowDown,
  X,
  Palette,
  Edit2,
  RotateCcw,
} from "lucide-react";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { FormPriceInput } from "@/components/shared/form/FormPriceInput";
import { FormInput } from "@/components/shared/form/FormInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChipSection from "./ChipSection";
import { ColorSelectModal } from "./ColorSelectModal";

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

  const options = (watch("options") as Option[]) || [];

  // Generate combinations
  useEffect(() => {
    // Skip generation if options or some options are missing names
    const processedOptions = options.filter(
      (o) => o.name && o.name.trim().length > 0,
    );

    if (processedOptions.length === 0) {
      if ((getValues("variants") || []).length > 0) {
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
    const hydratedVariants = getValues("variants") || [];

    const nextVariants = combinations.map((combo) => {
      const existing = (hydratedVariants as VariantField[]).find((v) => {
        if (!v.combinations) return false;
        const keys1 = Object.keys(combo);
        const keys2 = Object.keys(v.combinations);
        if (keys1.length !== keys2.length) return false;

        // Exact match for keys and values
        return keys1.every((k) => combo[k] === v.combinations[k]);
      });

      return existing
        ? { ...existing }
        : {
            combinations: combo,
            price: 0,
            stock: 0,
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
  }, [JSON.stringify(options)]);

  const addOption = () => {
    prependOption({ name: "", values: [] });
    setEditingNameIndex(0);
  };

  const [bulkValues, setBulkValues] = useState({
    price: "",
    stock: "",
    sku: "",
  });

  const applyBulkEdit = (field: "price" | "stock" | "sku") => {
    const value = bulkValues[field];
    if (value === "" && field !== "sku") return;

    variantFields.forEach((_, index) => {
      setValue(
        `variants.${index}.${field}`,
        field === "sku" ? value : Number(value),
      );
    });
  };

  return (
    <div className="space-y-8">
      {/* Options Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Product Options
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addOption}
            className="rounded-full shadow-sm text-xs h-8 px-3 border-dashed border-primary/40 text-primary"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Option
          </Button>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {optionFields.map((field, index: number) => (
              <motion.div
                key={field.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3 md:p-5 rounded-[2rem] border border-border/40 bg-muted/5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-border/10 p-3 md:p-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                        <span className="text-sm font-black text-primary">
                          V{index + 1}
                        </span>
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                        Variant Option Axis
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="h-8 px-3 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors gap-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase">
                        Remove Opt
                      </span>
                    </Button>
                  </div>

                  {/* Body */}
                  <div className="p-4 md:p-8">
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
                                    className="h-12 md:h-14 rounded-2xl bg-background border-primary/20 focus:ring-primary/20 transition-all font-bold text-base md:text-lg pr-12"
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-muted hover:bg-muted-foreground/10 flex items-center justify-center transition-colors"
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
                                  className="[&_button]:h-12 md:[&_button]:h-14 [&_button]:rounded-2xl"
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
                                    className="w-full h-12 rounded-xl border-dashed"
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
                                      className="w-full h-12 rounded-xl"
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
                            <div className="h-14 md:h-16 rounded-[1.5rem] bg-primary/5 border border-primary/20 flex items-center justify-between px-4 md:px-6 transition-all group-hover:bg-primary/10">
                              <span className="text-lg md:text-xl font-black text-primary capitalize tracking-tight">
                                {options[index]?.name}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingNameIndex(index)}
                                className="h-10 w-10 rounded-xl bg-background shadow-sm hover:bg-primary hover:text-white transition-all scale-90 group-hover:scale-100"
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
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
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
                            <div className="flex flex-wrap gap-2 mt-4 p-5 rounded-[2rem] bg-muted/5 border border-border/40 min-h-[120px] border-dashed">
                              {(options[index]?.values || []).length > 0 ? (
                                (options[index]?.values || []).map((v) => (
                                  <Badge
                                    key={v}
                                    variant="secondary"
                                    className="bg-primary/10 text-primary border-none rounded-2xl h-8 md:h-10 px-3 md:px-4 text-[10px] md:text-sm font-bold flex items-center gap-2 shadow-sm"
                                  >
                                    {v}
                                    <button
                                      type="button"
                                      className="p-1 hover:bg-primary/20 rounded-lg transition-colors"
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
              </motion.div>
            ))}
          </AnimatePresence>

          {optionFields.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center border-2 border-dashed rounded-[3rem] bg-muted/5 border-border/40 flex flex-col items-center gap-4 group hover:bg-muted/10 hover:border-primary/20 transition-all cursor-pointer"
              onClick={addOption}
            >
              <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
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
                className="rounded-full h-10 px-6 border-primary/20 text-primary"
              >
                Create First Option
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Variants Matrix */}
      {variantFields.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-border/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Box className="h-4 w-4" />
                Variant Matrix
              </Label>
              <p className="text-[10px] text-muted-foreground font-medium">
                Set individual price & stock for generated combinations.
              </p>
            </div>

            {/* Bulk Edit Bar */}
            <div className="flex items-center gap-2 p-2 bg-muted/10 rounded-3xl border border-border/40 shadow-inner overflow-x-auto whitespace-nowrap">
              <div className="flex items-center gap-2 px-3 border-r border-border/20 mr-1">
                <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Bulk
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative group">
                  <Input
                    type="number"
                    placeholder="Price"
                    className="h-8 w-20 text-[10px] rounded-full bg-background border-none focus-visible:ring-primary/20 pr-6"
                    value={bulkValues.price}
                    onChange={(e) =>
                      setBulkValues((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />
                  <Button
                    type="button"
                    size="icon"
                    className="h-6 w-6 absolute right-1 top-1 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all scale-75 group-hover:scale-100"
                    onClick={() => applyBulkEdit("price")}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>

                <div className="relative group">
                  <Input
                    type="number"
                    placeholder="Stock"
                    className="h-8 w-20 text-[10px] rounded-full bg-background border-none focus-visible:ring-primary/20 pr-6"
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
                    size="icon"
                    className="h-6 w-6 absolute right-1 top-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white transition-all scale-75 group-hover:scale-100"
                    onClick={() => applyBulkEdit("stock")}
                  >
                    <ArrowDown className="h-3 w-3" />
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
              <AnimatePresence initial={false}>
                {variantFields.map((field, index: number) => {
                  const variantData = field as unknown as VariantField;
                  const comboValues = Object.values(
                    variantData.combinations || {},
                  );
                  return (
                    <motion.div
                      key={field.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col md:grid md:grid-cols-[1fr_110px_110px_110px_110px] gap-3 p-4 rounded-3xl border border-border/40 bg-background/50 hover:bg-white dark:hover:bg-neutral-900 transition-all duration-300 shadow-sm hover:shadow-md group"
                    >
                      {/* Combination Tags */}
                      <div className="flex items-center flex-wrap gap-2 w-full">
                        {comboValues.map((v, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="font-black text-[11px] h-7 px-3 bg-primary/10 text-primary border-none rounded-full shadow-inner"
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
                            inputClassName="h-10 text-xs rounded-2xl bg-muted/20 border-transparent focus:border-primary/20 focus:bg-background transition-all"
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
                            inputClassName="h-10 text-xs pl-8 rounded-2xl bg-muted/20 border-transparent focus:border-primary/20 focus:bg-background transition-all"
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
                            inputClassName="h-10 text-xs pl-8 rounded-2xl bg-muted/20 border-transparent focus:border-primary/20 focus:bg-background transition-all"
                            icon={
                              <Percent className="h-3 w-3 text-muted-foreground/60" />
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
                            inputClassName="h-10 text-xs pl-8 rounded-2xl bg-muted/20 border-transparent focus:border-primary/20 focus:bg-background transition-all"
                            icon={
                              <Box className="h-3 w-3 text-muted-foreground/60" />
                            }
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
