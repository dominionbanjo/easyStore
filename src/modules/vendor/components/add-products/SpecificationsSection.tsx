import {
  Plus,
  X,
  ListTodo,
  Settings2,
  Trash2,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

/* ───────────────── TYPES ───────────────── */

export type SpecItem = {
  key: string;
  value: string;
};

interface SpecificationsSectionProps {
  specs: SpecItem[];
  onAdd: () => void;
  onUpdate: (index: number, field: "key" | "value", value: string) => void;
  onRemove: (index: number) => void;
}

/* ───────────────── COMPONENT ───────────────── */

export default function SpecificationsSection({
  specs,
  onAdd,
  onUpdate,
  onRemove,
}: SpecificationsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-sm bg-primary/10 flex items-center justify-center">
            <Settings2 className="h-4 w-4 text-primary" />
          </div>
          <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground/80">
            Technical Specs
          </Label>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="rounded-sm border-primary/20 hover:bg-primary/5 hover:text-primary transition-all font-bold px-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Specification
        </Button>
      </div>

      {/* Rows */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {specs.length > 0 ? (
            specs.map((s, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative grid grid-cols-1 md:grid-cols-[1fr_1.5fr_auto] gap-4 p-4 rounded-sm bg-muted/20 border border-muted-foreground/10 hover:border-primary/30 transition-all duration-300"
              >
                {/* Key */}
                <div className="relative">
                  <input
                    className="w-full h-11 bg-background border-none rounded-sm px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40 "
                    placeholder="e.g. Material"
                    value={s.key}
                    onChange={(e) => onUpdate(i, "key", e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20 transition-opacity group-focus-within:opacity-100">
                    <ListTodo className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Value */}
                <div className="relative">
                  <input
                    className="w-full h-11 bg-background border-none rounded-sm px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40 "
                    placeholder="e.g. 100% Organic Cotton"
                    value={s.value}
                    onChange={(e) => onUpdate(i, "value", e.target.value)}
                  />
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="h-11 w-11 rounded-sm bg-destructive/10 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Mobile remove helper */}
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="md:hidden absolute -top-2 -right-2 h-7 w-7 rounded-sm bg-destructive text-white flex items-center justify-center "
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 border-2 border-dashed border-muted-foreground/10 rounded-sm flex flex-col items-center justify-center gap-3 bg-muted/5"
            >
              <div className="h-12 w-12 rounded-sm bg-muted/20 flex items-center justify-center">
                <GripVertical className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">
                No specifications defined
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
