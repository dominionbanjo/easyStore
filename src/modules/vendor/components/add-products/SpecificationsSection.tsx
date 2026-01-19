import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label>Specifications</Label>
        <Button type="button" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Add spec
        </Button>
      </div>

      {/* Rows */}
      {specs.map((s, i) => (
        <div key={i} className="grid grid-cols-[1fr_1.2fr] gap-2">
          {/* Key */}
          <input
            className={cn(
              "border rounded-md min-w-0",
              "h-8 px-2 text-sm",
              "sm:h-10 sm:px-3 sm:text-base",
            )}
            placeholder="Title"
            value={s.key}
            onChange={(e) => onUpdate(i, "key", e.target.value)}
          />

          {/* Value + remove */}
          <div className="flex items-center gap-1 min-w-0">
            <input
              className={cn(
                "border rounded-md flex-1 min-w-0",
                "h-8 px-2 text-sm",
                "sm:h-10 sm:px-3 sm:text-base",
              )}
              placeholder="Value"
              value={s.value}
              onChange={(e) => onUpdate(i, "value", e.target.value)}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => onRemove(i)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
