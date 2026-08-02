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
  selectLocationSource,
  setLocationState,
} from "@/features/locationSlice";
import { NigeriaData } from "@/utils/nigeria-data";
import { useLocationPreference } from "@/hooks/useLocationPreference";

interface StateSelectorProps {
  className?: string;
}

export default function StateSelector({ className }: StateSelectorProps) {
  const dispatch = useDispatch();
  const locationState = useSelector(selectLocationState);
  const locationSource = useSelector(selectLocationSource);
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

  const isDetected = locationSource === "gps" || locationSource === "address";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-10 gap-2 rounded-sm px-3 text-sm font-semibold",
            locationState && "border-primary/40 text-primary",
            className,
          )}
        >
          <MapPin className={cn("h-4 w-4", locationState && "text-primary")} />
          <span className="max-w-[120px] truncate">
            {locationState ?? "All Nigeria"}
          </span>
          {isDetected && (
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-72 p-0">
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Your Location
            </p>
            {locationState && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 text-xs font-semibold text-destructive hover:underline"
              >
                <X className="h-3 w-3" /> All Nigeria
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
