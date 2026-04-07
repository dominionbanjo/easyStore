import { useMemo, useState } from "react";
import {
  Check,
  Search,
  Palette,
  Plus,
  Loader2,
  X,
  Droplets,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { extractErrorMessage } from "@/utils/errorHandler";

import {
  useGetColorsQuery,
  useCreateColorMutation,
} from "@/services/productDetailsApi";

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
  const { data, isLoading, refetch } = useGetColorsQuery();
  const [createColor, { isLoading: isCreating }] = useCreateColorMutation();

  const colors: ApiColor[] = data?.data ?? [];

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [localSelected, setLocalSelected] = useState<string[]>([]);

  // Quick Add State
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newHex, setNewHex] = useState("#000000");

  // Initialize local state when modal opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setLocalSelected([...selectedValues]);
      setShowAdd(false);
    }
    setOpen(newOpen);
  };

  const filtered = useMemo(() => {
    if (!search) return colors;
    const q = search.toLowerCase();
    return colors.filter(
      (c: ApiColor) =>
        c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q),
    );
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAddColor() {
    if (!newName.trim() || !newHex || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await createColor({
        name: newName.trim(),
        hex: newHex,
      }).unwrap();

      if (res && res.color && res.color.name) {
        toast.success("Color added successfully!");
        toggleColor(res.color.name);
        setNewName("");
        setNewHex("#000000");
        setShowAdd(false);
        refetch();
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to add color"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/60 text-primary gap-3 h-14 px-8 font-black uppercase tracking-widest text-xs transition-all hover:bg-primary/[0.02]"
          >
            <Palette className="h-4 w-4" /> Pick Variant Colors
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="max-w-6xl p-0 overflow-hidden sm:rounded-3xl border-none shadow-2xl h-full sm:h-[85vh] flex flex-col bg-background/95 backdrop-blur-3xl"
      >
        <div className="px-5 sm:px-8 py-5 sm:py-8 shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl sm:text-4xl font-black uppercase tracking-tighter flex items-center gap-3 sm:gap-5">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl sm:rounded-3xl bg-primary shadow-xl shadow-primary/20 flex items-center justify-center text-white">
              <Palette className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <div className="flex flex-col">
              <span>Variant Colors</span>
              <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground tracking-[0.3em] uppercase opacity-60">
                Select or create unique colors
              </span>
            </div>
          </DialogTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-xl h-12 w-12 bg-muted/40 hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="px-5 sm:px-8 pb-4 sm:pb-6 shrink-0 flex flex-col sm:flex-row gap-4">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or hex code (#...)"
              className="pl-12 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-bold text-base sm:text-lg"
            />
          </div>
          <Button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className={cn(
              "h-12 sm:h-14 px-6 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 transition-all shadow-lg",
              showAdd
                ? "bg-muted text-foreground"
                : "bg-foreground text-background shadow-foreground/10 hover:shadow-foreground/20",
            )}
          >
            {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAdd ? "Cancel" : "Add Custom"}
          </Button>
        </div>

        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-8 overflow-hidden bg-primary/[0.02]"
            >
              <div className="pb-8 pt-2 flex flex-col md:flex-row items-end gap-4 border-b border-primary/10">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">
                    Color Name
                  </label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Midnight Azure"
                    className="h-12 rounded-xl bg-background border-border"
                  />
                </div>
                <div className="w-full md:w-48 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">
                    Hex Code
                  </label>
                  <div className="relative">
                    <input
                      type="color"
                      value={newHex}
                      onChange={(e) => setNewHex(e.target.value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full overflow-hidden border-none p-0 bg-transparent cursor-pointer"
                    />
                    <Input
                      value={newHex}
                      onChange={(e) => setNewHex(e.target.value)}
                      placeholder="#000000"
                      className="h-12 rounded-xl bg-background border-border pr-12 font-mono uppercase"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleAddColor}
                  disabled={isCreating || !newName.trim()}
                  className="h-12 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-xs px-8 shadow-lg shadow-primary/20"
                >
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Color"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-8 flex-1 overflow-y-auto custom-scrollbar min-h-0 py-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-[2rem]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-muted/40 flex items-center justify-center">
                <Droplets className="h-12 w-12 text-muted-foreground opacity-20" />
              </div>
              <div className="space-y-2">
                <p className="font-black uppercase tracking-[0.2em] text-sm text-foreground/40">
                  No Colors Found
                </p>
                <p className="text-xs font-semibold text-muted-foreground">
                  Try another search or add a custom color above.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filtered.map((c: ApiColor) => {
                const isSelected = localSelected.includes(c.name);

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleColor(c.name)}
                    className={cn(
                      "flex flex-col items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 relative group overflow-hidden",
                      isSelected
                        ? "bg-primary/[0.03] border-primary shadow-xl shadow-primary/[0.05]"
                        : "bg-background border-border/40 hover:border-primary/40 shadow-sm",
                    )}
                  >
                    <div
                      className="h-16 w-16 rounded-3xl border-4 border-white shadow-2xl transition-transform group-hover:scale-110 duration-500"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="flex flex-col items-center min-w-0 w-full">
                      <span
                        className={cn(
                          "text-xs font-black truncate uppercase tracking-tight text-center w-full",
                          isSelected ? "text-primary" : "text-foreground",
                        )}
                      >
                        {c.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.2em] mt-1">
                        {c.hex}
                      </span>
                    </div>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: -45 }}
                          className="absolute -top-1 -right-1 h-10 w-10 bg-primary text-white flex items-center justify-center rounded-bl-[1.5rem]"
                        >
                          <Check className="h-4 w-4 stroke-[4]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-5 sm:px-8 py-5 sm:py-6 border-t border-border/40 shrink-0 bg-background/50 backdrop-blur-md">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground opacity-60">
              Colors Selected
            </span>
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl font-black text-foreground">
                {localSelected.length.toString().padStart(2, "0")}
              </span>
              <span className="h-8 w-[1px] bg-border/60" />
              <div className="flex -space-x-2">
                {localSelected.slice(0, 5).map((name) => {
                  const color = colors.find((cb) => cb.name === name);
                  return (
                    <div
                      key={name}
                      className="h-8 w-8 rounded-full border-2 border-background shadow-md"
                      style={{ backgroundColor: color?.hex }}
                    />
                  );
                })}
                {localSelected.length > 5 && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-black border-2 border-background">
                    +{localSelected.length - 5}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto rounded-xl h-12 sm:h-14 px-8 font-black uppercase tracking-widest text-[11px] border-border hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Discard Changes
            </Button>
            <Button
              type="button"
              className="w-full sm:w-auto rounded-xl h-12 sm:h-14 px-12 font-black uppercase tracking-widest text-xs bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 gap-3 group"
              onClick={handleApply}
            >
              Apply Selection{" "}
              <Zap className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
