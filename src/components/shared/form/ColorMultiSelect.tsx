import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Check, Search, X, Palette, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

import { useGetColorsQuery } from "@/services/productDetailsApi";
import type { DraftColor } from "@/features/productDraftSlice";

/* ───────────────── TYPES ───────────────── */

interface ApiColor {
  id: string;
  name: string;
  hex: string;
}

interface ColorMultiSelectProps {
  name: string;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
}

/* ───────────────── COMPONENT ───────────────── */

export function ColorMultiSelect({
  name,
  label = "Colors (Optional)",
  className,
  icon,
}: ColorMultiSelectProps) {
  const { control } = useFormContext();

  const { data, isLoading } = useGetColorsQuery();
  const colors: ApiColor[] = data?.data ?? [];

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  /* ───────── FILTER ───────── */

  const filtered = useMemo(() => {
    if (!search) return colors;
    const q = search.toLowerCase();
    return colors.filter((c) => c.name.toLowerCase().includes(q));
  }, [colors, search]);

  /* ───────── TOGGLE ───────── */

  function toggleColor(
    color: ApiColor,
    selected: DraftColor[],
    onChange: (v: DraftColor[]) => void,
  ) {
    if (selected.some((c) => c.id === color.id)) {
      onChange(selected.filter((c) => c.id !== color.id));
    } else {
      onChange([...selected, color]);
    }
  }

  /* ───────────────── RENDER ───────────────── */

  return (
    <div className={cn("space-y-1.5 relative", className)}>
      <Label className="font-medium text-[15px]">{label}</Label>

      <Controller
        name={name}
        control={control}
        defaultValue={[] as DraftColor[]}
        render={({ field }) => {
          const selected = field.value as DraftColor[];

          return (
            <Dialog open={open} onOpenChange={setOpen}>
              {/* Selected List as Main UI */}
              <div className="flex flex-wrap gap-2 mb-3 min-h-[44px]">
                {selected.length > 0 ? (
                  selected.map((c) => (
                    <Badge
                      key={c.id}
                      variant="secondary"
                      className="pl-1.5 pr-1 py-1 gap-2 rounded-xl group bg-muted/30 border-muted-foreground/10 hover:bg-muted/50 transition-all"
                    >
                      <span
                        className="h-5 w-5 rounded-lg border border-black/10 shadow-sm"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs font-bold">{c.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange(
                            selected.filter((x: DraftColor) => x.id !== c.id),
                          )
                        }
                        className="p-1 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <div className="w-full py-2 bg-muted/10 rounded-2xl border border-dashed border-muted-foreground/20 flex items-center justify-center">
                    <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/60">
                      No colors selected
                    </p>
                  </div>
                )}
              </div>

              {/* Trigger Button */}
              <DialogTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full h-10 rounded-xl border px-3 flex items-center gap-3 text-left text-sm transition-all duration-200 bg-muted/20 border-muted-foreground/10 hover:border-primary/30 group",
                    selected.length === 0 && "text-muted-foreground",
                  )}
                >
                  <div className="h-6 w-6 rounded-lg bg-background flex items-center justify-center shadow-sm text-muted-foreground group-hover:text-primary transition-colors">
                    {icon || <Palette className="h-3.5 w-3.5" />}
                  </div>
                  <span className="flex-1 font-bold">
                    {selected.length > 0
                      ? `Modify Colors (${selected.length})`
                      : "Add Product Colors"}
                  </span>
                  <Plus className="h-4 w-4 opacity-40" />
                </button>
              </DialogTrigger>

              <DialogContent
                showCloseButton={false}
                className="max-w-xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl max-h-[85vh] flex flex-col"
              >
                <DialogHeader className="p-8 pb-4 shrink-0 flex flex-row items-center justify-between space-y-0">
                  <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Palette className="h-5 w-5 text-primary" />
                    </div>
                    Select Colors
                  </DialogTitle>

                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl h-9 px-4 font-black uppercase tracking-widest text-[10px] bg-muted/30 hover:bg-muted/50 border border-muted-foreground/10 flex items-center gap-2 group transition-all"
                    >
                      <X className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                      Close
                    </Button>
                  </DialogClose>
                </DialogHeader>

                <div className="px-8 pb-3 shrink-0">
                  {/* Search bar inside modal */}
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search available colors..."
                      className="pl-11 h-12 rounded-2xl bg-muted/20 border-muted-foreground/10 focus-visible:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="px-8 flex-1 overflow-y-auto custom-scrollbar min-h-0">
                  {/* Colors Grid */}
                  {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-2xl" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {filtered.map((c) => {
                        const isSelected = selected.some((x) => x.id === c.id);

                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() =>
                              toggleColor(c, selected, field.onChange)
                            }
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden group",
                              isSelected
                                ? "bg-primary/5 border-primary shadow-sm"
                                : "bg-muted/5 border-muted-foreground/10 hover:border-primary/30",
                            )}
                          >
                            <span
                              className="h-7 w-7 rounded-xl border border-black/10 shadow-inner shrink-0"
                              style={{ backgroundColor: c.hex }}
                            />
                            <div className="flex flex-col min-w-0">
                              <span
                                className={cn(
                                  "text-xs font-black truncate uppercase tracking-tight",
                                  isSelected
                                    ? "text-primary"
                                    : "text-foreground",
                                )}
                              >
                                {c.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                {c.hex}
                              </span>
                            </div>

                            {isSelected && (
                              <motion.div
                                layoutId="check-indicator"
                                className="absolute top-2 right-2 h-4 w-4 bg-primary text-white rounded-full flex items-center justify-center"
                              >
                                <Check className="h-2.5 w-2.5 stroke-[4]" />
                              </motion.div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-8 pb-8 pt-6 border-t border-border/40 shrink-0">
                  <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                    {selected.length} Selected
                  </p>
                  <Button
                    type="button"
                    className="rounded-xl px-8 font-black uppercase tracking-widest text-xs h-11"
                    onClick={() => setOpen(false)}
                  >
                    Done
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          );
        }}
      />
    </div>
  );
}
