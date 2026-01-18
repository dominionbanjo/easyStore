import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
}

/* ───────────────── COMPONENT ───────────────── */

export function ColorMultiSelect({
  name,
  label = "Colors",
  className,
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
    <div className={cn("space-y-2 relative", className)}>
      <Label>{label}</Label>

      <Controller
        name={name}
        control={control}
        defaultValue={[] as DraftColor[]}
        render={({ field }) => {
          const selected = field.value as DraftColor[];

          return (
            <>
              {/* ─── Selected preview ─── */}
              {selected.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selected.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm bg-muted/40"
                    >
                      <span
                        className="h-3 w-3 rounded-full border"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>

                      <button
                        type="button"
                        onClick={() =>
                          field.onChange(
                            selected.filter((x: DraftColor) => x.id !== c.id),
                          )
                        }
                      >
                        <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* ─── Trigger ─── */}
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={cn(
                  "w-full h-11 rounded-md border px-3 flex items-center justify-between text-left",
                  selected.length === 0 && "text-muted-foreground",
                )}
              >
                <span className="truncate">
                  {selected.length
                    ? `${selected.length} color(s) selected`
                    : "Select colors"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </button>

              {/* ─── Dropdown ─── */}
              {open && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border bg-background shadow-lg">
                  {/* Search */}
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search colors..."
                        className="pl-8 h-9"
                      />
                    </div>
                  </div>

                  {/* List */}
                  <div className="max-h-72 overflow-y-auto">
                    {isLoading && (
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    )}

                    {!isLoading &&
                      filtered.map((c) => {
                        const isSelected = selected.some((x) => x.id === c.id);

                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() =>
                              toggleColor(c, selected, field.onChange)
                            }
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted",
                              isSelected && "bg-primary/10 text-primary",
                            )}
                          >
                            <span
                              className="h-4 w-4 rounded-full border"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span>{c.name}</span>
                            {isSelected && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </button>
                        );
                      })}
                  </div>

                  {/* Footer */}
                  <div className="p-2 border-t flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setOpen(false)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </>
          );
        }}
      />
    </div>
  );
}
