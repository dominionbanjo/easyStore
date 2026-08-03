import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, LocateFixed, Search, X, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  clearLocationState,
  selectLocationState,
  setLocationState,
} from "@/features/locationSlice";
import { NigeriaData } from "@/utils/nigeria-data";
import { useLocationPreference } from "@/hooks/useLocationPreference";

interface StateSelectorProps {
  className?: string;
  align?: "start" | "center" | "end";
}

export default function StateSelector({
  className,
  align = "start",
}: StateSelectorProps) {
  const dispatch = useDispatch();
  const locationState = useSelector(selectLocationState);
  const { detectAndSet } = useLocationPreference();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredStates = useMemo(() => {
    const states = NigeriaData.getStates();
    if (!query.trim()) return states;
    const q = query.trim().toLowerCase();
    return states.filter((s) => s.name.toLowerCase().includes(q));
  }, [query]);

  const hasGeolocation = "geolocation" in navigator;

  const handleSelect = (stateName: string) => {
    dispatch(setLocationState({ state: stateName, source: "manual" }));
    setOpen(false);
  };

  const handleClear = () => {
    dispatch(clearLocationState());
    setOpen(false);
  };

  const handleDetect = () => {
    void detectAndSet(true);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "p-2 flex-shrink-0",
            locationState && "text-primary",
            className,
          )}
          aria-label={
            locationState
              ? `Location: ${locationState}. Click to change.`
              : "Location: All Nigeria. Click to change."
          }
        >
          <MapPin className={cn("h-5 w-5", locationState && "text-primary")} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align={align} className="w-72 p-0">
        <div className="p-3 space-y-2">
          {/* Current location display */}
          <div className="flex items-center gap-2.5 rounded-sm border border-primary/15 bg-primary/[0.04] px-3 py-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Current Location
              </p>
              <p
                title={locationState ?? "All Nigeria"}
                className={cn(
                  "truncate text-sm font-bold",
                  !locationState && "font-medium text-muted-foreground",
                )}
              >
                {locationState ?? "All Nigeria"}
              </p>
            </div>
            {locationState && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Reset to All Nigeria"
                className="flex items-center gap-1 rounded-sm px-1.5 py-1 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>

          {hasGeolocation && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-2 justify-start rounded-sm"
              onClick={handleDetect}
            >
              <LocateFixed className="h-4 w-4 text-primary" />
              Detect my location
            </Button>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search states..."
              className="pl-9 h-9 rounded-sm"
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto border-t border-border/50 py-1">
          {filteredStates.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No states match "{query}"
            </p>
          ) : (
            filteredStates.map((state) => {
              const isSelected = locationState === state.name;
              return (
                <button
                  key={state.isoCode}
                  type="button"
                  onClick={() => handleSelect(state.name)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-4 py-2 text-left text-sm hover:bg-accent/60 transition-colors",
                    isSelected && "bg-accent/60 font-bold text-primary",
                  )}
                >
                  <span>{state.name}</span>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
