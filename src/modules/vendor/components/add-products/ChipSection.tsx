import { useState, useRef } from "react";
import { X, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ChipSectionProps {
  label: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}

export default function ChipSection({
  label,
  values,
  onAdd,
  onRemove,
}: ChipSectionProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd() {
    const v = input.trim();
    if (!v) {
      inputRef.current?.focus();
      return;
    }
    onAdd(v);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {/* Input row */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          className={cn(
            "border rounded-md flex-1 min-w-0",
            "h-9 px-3 text-sm",
            "sm:h-10 sm:text-base",
          )}
          placeholder={`Add ${label.toLowerCase()}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />

        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
          onClick={handleAdd}
          aria-label={`Add ${label}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Chips */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((v) => (
            <Badge
              key={v}
              variant="secondary"
              className="flex items-center gap-1.5 px-3 py-1 text-sm"
            >
              <span className="truncate max-w-[140px] sm:max-w-none">{v}</span>

              <button
                type="button"
                onClick={() => onRemove(v)}
                className="rounded-full hover:bg-muted p-0.5"
                aria-label={`Remove ${v}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
