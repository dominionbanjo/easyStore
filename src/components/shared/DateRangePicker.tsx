import { useState } from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";

export type PresetKey = "all" | "today" | "week" | "month";

const presets: { key: PresetKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
];

function getPresetRange(key: PresetKey): { dateFrom?: string; dateTo?: string } {
  const now = new Date();
  switch (key) {
    case "today": {
      const d = format(now, "yyyy-MM-dd");
      return { dateFrom: d, dateTo: d };
    }
    case "week": {
      const from = startOfWeek(now, { weekStartsOn: 1 });
      return { dateFrom: format(from, "yyyy-MM-dd"), dateTo: format(now, "yyyy-MM-dd") };
    }
    case "month": {
      const from = startOfMonth(now);
      return { dateFrom: format(from, "yyyy-MM-dd"), dateTo: format(now, "yyyy-MM-dd") };
    }
    default:
      return {};
  }
}

interface DateRangePickerProps {
  value: { dateFrom?: string; dateTo?: string };
  onChange: (range: { dateFrom?: string; dateTo?: string }) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [activePreset, setActivePreset] = useState<PresetKey>("all");
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const handlePreset = (key: PresetKey) => {
    setActivePreset(key);
    setRange(undefined);
    onChange(getPresetRange(key));
  };

  const handleRangeSelect = (selected: DateRange | undefined) => {
    setRange(selected);
    setActivePreset("all" as PresetKey);
    if (selected?.from && selected?.to) {
      onChange({
        dateFrom: format(selected.from, "yyyy-MM-dd"),
        dateTo: format(selected.to, "yyyy-MM-dd"),
      });
      setOpen(false);
    }
  };

  const hasActiveFilter = activePreset !== "all" || range?.from;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {presets.map((p) => (
        <button
          key={p.key}
          onClick={() => handlePreset(p.key)}
          className={cn(
            "px-3 py-1.5 rounded-sm text-xs font-medium transition-colors",
            activePreset === p.key
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80",
          )}
        >
          {p.label}
        </button>
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-1 text-xs",
              hasActiveFilter && activePreset === ("all" as PresetKey) && range?.from
                ? "border-primary text-primary"
                : "text-muted-foreground",
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            {range?.from && range?.to
              ? `${format(range.from, "MMM d")} – ${format(range.to, "MMM d")}`
              : "Custom Range"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
            initialFocus
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
