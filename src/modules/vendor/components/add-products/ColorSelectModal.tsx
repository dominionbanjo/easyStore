import { useMemo, useState } from "react";
import { Check, Search, Palette } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

import { useGetColorsQuery } from "@/services/productDetailsApi";

interface ApiColor {
  id: string;
  name: string;
  hex: string;
}

interface ColorSelectModalProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
  trigger?: React.ReactNode;
}

export function ColorSelectModal({
  selectedValues,
  onChange,
  trigger,
}: ColorSelectModalProps) {
  const { data, isLoading } = useGetColorsQuery();
  const colors: ApiColor[] = data?.data ?? [];

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [localSelected, setLocalSelected] = useState<string[]>([]);

  // Initialize local state when modal opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setLocalSelected([...selectedValues]);
    }
    setOpen(newOpen);
  };

  const filtered = useMemo(() => {
    if (!search) return colors;
    const q = search.toLowerCase();
    return colors.filter((c: ApiColor) => c.name.toLowerCase().includes(q));
  }, [colors, search]);

  function toggleColor(colorName: string) {
    setLocalSelected((prev) =>
      prev.includes(colorName)
        ? prev.filter((v) => v !== colorName)
        : [...prev, colorName],
    );
  }

  const handleApply = () => {
    onChange(localSelected);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-dashed border-primary/40 text-primary gap-2 h-11 px-6 font-bold"
          >
            <Palette className="h-4 w-4" /> Pick Variant Colors
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-4xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl h-[85vh] flex flex-col"
      >
        <DialogHeader className="px-8 py-6 shrink-0 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Palette className="h-6 w-6" />
            </div>
            Variant Colors
          </DialogTitle>
        </DialogHeader>

        <div className="px-8 pb-4 shrink-0">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter colors by name or hex..."
              className="pl-12 h-14 rounded-2xl bg-muted/20 border-muted-foreground/10 focus-visible:ring-primary/20 transition-all font-medium text-lg"
            />
          </div>
        </div>

        <div className="px-8 flex-1 overflow-y-auto custom-scrollbar min-h-0 py-4">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filtered.map((c: ApiColor) => {
                const isSelected = localSelected.includes(c.name);

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleColor(c.name)}
                    className={cn(
                      "flex flex-col gap-3 p-4 rounded-3xl border transition-all duration-300 text-left relative overflow-hidden group",
                      isSelected
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-muted/5 border-muted-foreground/10 hover:border-primary/30",
                    )}
                  >
                    <div
                      className="h-12 w-full rounded-2xl border border-black/10 shadow-inner shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span
                        className={cn(
                          "text-xs font-black truncate uppercase tracking-tight",
                          isSelected ? "text-primary" : "text-foreground",
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
                        className="absolute top-3 right-3 h-5 w-5 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white"
                      >
                        <Check className="h-3 w-3 stroke-[4]" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-8 py-8 border-t border-border/40 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Selection Summary
            </span>
            <span className="text-xl font-black text-primary">
              {localSelected.length} Colors Picked
            </span>
          </div>
          <Button
            type="button"
            className="rounded-2xl px-12 font-black uppercase tracking-widest text-sm h-14 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            onClick={handleApply}
          >
            Apply to Variants
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
