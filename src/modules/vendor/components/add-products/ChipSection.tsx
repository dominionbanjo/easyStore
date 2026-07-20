import { useState, useRef, useEffect } from "react";
import { X, Plus, Hash, Sparkles, Ruler } from "lucide-react";


import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ChipSectionProps {
  label: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder?: string;
}

const ICONS: Record<string, any> = {
  Tags: Hash,
  Highlights: Sparkles,
  Sizes: Ruler,
};

export default function ChipSection({
  label,
  values,
  onAdd,
  onRemove,
  placeholder,
}: ChipSectionProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const Icon = ICONS[label] || Hash;

  function handleAdd() {
    const v = input.trim();
    if (!v) {
      inputRef.current?.focus();
      return;
    }
    onAdd(v);
    setInput("");
  }

  // Robust focus return: whenever values array grows, return focus to this input
  const prevCount = useRef(values.length);
  useEffect(() => {
    if (values.length > prevCount.current) {
      inputRef.current?.focus();
    }
    prevCount.current = values.length;
  }, [values.length]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-sm bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground/80">
          {label}
        </Label>
      </div>

      {/* Input row */}
      <div className="relative group">
        <input
          ref={inputRef}
          className={cn(
            "w-full h-12 bg-muted/20 border-muted-foreground/10 rounded-sm pl-4 pr-14 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40",
          )}
          placeholder={placeholder || `Add new ${label.toLowerCase()}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />

        <button
          type="button"
          onClick={handleAdd}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-sm bg-primary text-white flex items-center justify-center  transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 min-h-[32px]">
          {values.map((v) => (
            <div key={v}>
              <Badge
                variant="secondary"
                className="pl-3 pr-1 py-1.5 gap-2 rounded-sm group bg-muted/30 border-muted-foreground/10 hover:bg-muted/50 transition-all"
              >
                <span className="text-xs font-bold">{v}</span>
                <button
                  type="button"
                  onClick={() => onRemove(v)}
                  className="p-1 hover:bg-destructive/10 hover:text-destructive rounded-sm transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          ))}
          {values.length === 0 && (
            <p className="text-[10px] text-muted-foreground/40 uppercase font-black tracking-widest py-2"
            >
              No {label.toLowerCase()} added yet
            </p>
          )}
      </div>
    </div>
  );
}
