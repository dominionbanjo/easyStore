import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { useGetColorsQuery } from "@/services/productDetailsApi";

/* ───────────────── TYPES ───────────────── */

interface Color {
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

  const colors: Color[] = data?.data ?? [];

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  /* ───────── FILTER ───────── */

  const filtered = useMemo(() => {
    if (!search) return colors;
    const q = search.toLowerCase();
    return colors.filter((c) => c.name.toLowerCase().includes(q));
  }, [colors, search]);

  function toggleColor(
    value: string,
    selected: string[],
    onChange: (v: string[]) => void,
  ) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  function removeColor(
    value: string,
    selected: string[],
    onChange: (v: string[]) => void,
  ) {
    onChange(selected.filter((v) => v !== value));
  }

  function getColorById(id: string) {
    return colors.find((c) => c.id === id);
  }

  return (
    <div className={cn("space-y-2 relative", className)}>
      <Label>{label}</Label>

      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <>
            {/* Selected chips */}
            {field.value.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {field.value.map((id: string) => {
                  const c = getColorById(id);
                  if (!c) return null;

                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
                    >
                      <span
                        className="h-3 w-3 rounded-full border"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          removeColor(id, field.value, field.onChange)
                        }
                      >
                        <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Trigger */}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className={cn(
                "w-full h-11 rounded-md border px-3 flex items-center justify-between text-left",
                field.value.length === 0 && "text-muted-foreground",
              )}
            >
              <span className="truncate">
                {field.value.length
                  ? `${field.value.length} color(s) selected`
                  : "Select colors"}
              </span>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </button>

            {/* Dropdown */}
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

                {/* Content */}
                <div className="max-h-72 overflow-y-auto">
                  {isLoading && (
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  )}

                  {!isLoading && filtered.length === 0 && (
                    <p className="p-4 text-sm text-muted-foreground">
                      No colors found
                    </p>
                  )}

                  {!isLoading &&
                    filtered.map((c) => {
                      const selected = field.value.includes(c.id);

                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() =>
                            toggleColor(c.id, field.value, field.onChange)
                          }
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted",
                            selected && "bg-primary/10 text-primary",
                          )}
                        >
                          <span
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                          {selected && <Check className="ml-auto h-4 w-4" />}
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
        )}
      />
    </div>
  );
}
