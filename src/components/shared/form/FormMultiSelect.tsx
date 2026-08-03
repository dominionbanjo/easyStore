import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Option {
  label: string;
  value: string;
}

interface FormMultiSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  className?: string;
  disabled?: boolean;
  isSearchable?: boolean;
}

export function FormMultiSelect({
  name,
  label,
  placeholder = "Select options",
  options,
  className,
  disabled = false,
  isSearchable = false,
}: FormMultiSelectProps) {
  const {
    control,
    formState: { errors, touchedFields, submitCount },
  } = useFormContext();

  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fieldError = (errors as Record<string, unknown>)[name];
  const rawMessage =
    typeof fieldError === "object" &&
    fieldError !== null &&
    "message" in fieldError
      ? fieldError.message
      : undefined;
  const error = typeof rawMessage === "string" ? rawMessage : undefined;
  const shouldShowError = !!error && (!!touchedFields[name] || submitCount > 0);

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  const triggerClasses = cn(
    "w-full min-h-12 rounded-sm border border-muted-foreground/10 bg-muted/20 px-3 py-2 text-[15px] transition-colors focus:bg-background relative text-left flex items-center justify-between gap-2 flex-wrap",
    shouldShowError && "border-destructive focus-visible:ring-destructive/20",
    disabled && "opacity-50 cursor-not-allowed",
  );

  return (
    <div className={cn("flex flex-col gap-1.5 group", className)}>
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "text-sm font-medium text-foreground transition-colors uppercase text-xs text-muted-foreground",
            shouldShowError && "text-destructive",
          )}
        >
          {label}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValues = (field.value as string[]) || [];

          const toggleValue = (value: string) => {
            const newValues = selectedValues.includes(value)
              ? selectedValues.filter((v) => v !== value)
              : [...selectedValues, value];
            field.onChange(newValues);
          };

          const removeValue = (e: React.MouseEvent, value: string) => {
            e.stopPropagation();
            toggleValue(value);
          };

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild disabled={disabled}>
                <button type="button" className={triggerClasses}>
                  <div className="flex flex-wrap gap-1.5 flex-1 items-center">
                    {selectedValues.length > 0 ? (
                      selectedValues.map((val) => {
                        const option = options.find((opt) => opt.value === val);
                        return (
                          <Badge
                            key={val}
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-2 rounded-full flex items-center gap-1 group/badge py-0.5"
                          >
                            <span>{option?.label || val}</span>
                            {!disabled && (
                              <X 
                                className="h-3 w-3 cursor-pointer opacity-60 hover:opacity-100" 
                                onClick={(e) => removeValue(e, val)}
                              />
                            )}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-muted-foreground">{placeholder}</span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 border-border/50 shadow-xl overflow-hidden"
                style={{ width: "var(--radix-popover-trigger-width)" }}
                align="start"
              >
                {isSearchable && (
                  <div className="sticky top-0 bg-popover z-20 p-2 border-b border-border/40">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-9 pl-8 bg-muted/30 border-none rounded-sm text-xs focus-visible:ring-1"
                        autoFocus
                      />
                    </div>
                  </div>
                )}
                <div className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-sm rounded-sm transition-colors text-left",
                          selectedValues.includes(opt.value)
                            ? "bg-primary/10 text-primary font-bold"
                            : "hover:bg-muted text-foreground/80 hover:text-foreground",
                        )}
                        onClick={() => toggleValue(opt.value)}
                      >
                        <span className="truncate">{opt.label}</span>
                        {selectedValues.includes(opt.value) && (
                          <Check className="h-3.5 w-3.5 shrink-0" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="py-6 px-4 text-center text-xs text-muted-foreground italic">
                      No results found.
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          );
        }}
      />

      {shouldShowError && (
        <p className="text-xs text-destructive mt-0.5">{error}</p>
      )}
    </div>
  );
}
