import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, Check } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  onValueChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  isSearchable?: boolean;
}

export function FormSelect({
  name,
  label,
  placeholder = "Select an option",
  options,
  className,
  disabled = false,
  icon,
  onValueChange,
  onSearchChange,
  isSearchable = false,
}: FormSelectProps) {
  const {
    control,
    formState: { errors, touchedFields, submitCount },
  } = useFormContext();

  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const error = (errors as any)?.[name]?.message as string | undefined;
  const shouldShowError =
    !!error && ((touchedFields as any)?.[name] || submitCount > 0);

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  const triggerClasses = cn(
    "w-full h-12 rounded-sm border border-muted-foreground/10 bg-muted/20 px-3 py-[10px] text-[15px] transition-colors focus:bg-background relative text-left flex items-center justify-between",
    icon ? "pl-11" : "px-4",
    shouldShowError && "border-destructive focus-visible:ring-destructive/20",
    disabled && "opacity-50 cursor-not-allowed",
  );

  return (
    <div className={cn("flex flex-col gap-1.5 group", className)}>
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "text-sm font-medium text-foreground transition-colors",
            shouldShowError && "text-destructive",
          )}
        >
          {label}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            {isSearchable ? (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild disabled={disabled}>
                  <button type="button" className={triggerClasses}>
                    {icon && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        {icon}
                      </div>
                    )}
                    <span
                      className={cn(
                        "truncate",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {options.find((opt) => opt.value === field.value)
                        ?.label || placeholder}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 border-border/50 shadow-xl overflow-hidden"
                  style={{ width: "var(--radix-popover-trigger-width)" }}
                  align="start"
                >
                  <div className="sticky top-0 bg-popover z-20 p-2 border-b border-border/40">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSearchTerm(val);
                          onSearchChange?.(val);
                        }}
                        className="h-9 pl-8 bg-muted/30 border-none rounded-sm text-xs focus-visible:ring-1"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 text-sm rounded-sm transition-colors text-left",
                            field.value === opt.value
                              ? "bg-primary/10 text-primary font-bold"
                              : "hover:bg-muted text-foreground/80 hover:text-foreground",
                          )}
                          onClick={() => {
                            field.onChange(opt.value);
                            onValueChange?.(opt.value);
                            setOpen(false);
                            setSearchTerm("");
                          }}
                        >
                          <span className="truncate">{opt.label}</span>
                          {field.value === opt.value && (
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
            ) : (
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  onValueChange?.(val);
                }}
                value={field.value || undefined}
                disabled={disabled}
              >
                <SelectTrigger id={name} className={triggerClasses}>
                  {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      {icon}
                    </div>
                  )}
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </>
        )}
      />

      {shouldShowError && (
        <p className="text-xs text-destructive mt-0.5">{error}</p>
      )}
    </div>
  );
}
