import React, { useEffect, useState } from "react";
import { useFormContext, useController } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormPriceInputProps {
  label?: string;
  name: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  icon?: React.ReactNode;
}

const formatWithCommas = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null || value === "") return "";
  const num =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("en-US").format(num);
};

export function FormPriceInput({
  label,
  name,
  placeholder,
  className,
  inputClassName,
  icon,
}: FormPriceInputProps) {
  const {
    control,
    formState: { errors, touchedFields, submitCount },
  } = useFormContext();
  const { field } = useController({
    name,
    control,
  });

  const [displayValue, setDisplayValue] = useState(
    formatWithCommas(field.value),
  );

  // Sync internal display value when form value changes (e.g., from slider)
  useEffect(() => {
    setDisplayValue(formatWithCommas(field.value));
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Only allow digits and commas
    const cleanedValue = rawValue.replace(/[^\d]/g, "");

    // If empty, set to null so the input stays empty and placeholder shows
    const numericValue =
      cleanedValue === "" ? null : parseInt(cleanedValue, 10);

    // Update display state (formatted)
    setDisplayValue(formatWithCommas(numericValue));

    // Update form state (numeric)
    field.onChange(numericValue);
  };

  const getNestedError = (obj: any, path: string) => {
    return path
      .split(/[.[\]]/)
      .filter(Boolean)
      .reduce((acc, part) => acc?.[part], obj);
  };

  const errorObj = getNestedError(errors, name);
  const error = errorObj?.message as string | undefined;
  const shouldShowError =
    !!error && (getNestedError(touchedFields, name) || submitCount > 0);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "font-medium text-[15px]",
            shouldShowError && "text-destructive",
          )}
        >
          {label}
        </Label>
      )}

      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <Input
          {...field}
          value={displayValue}
          onChange={handleChange}
          id={name}
          placeholder={placeholder}
          aria-invalid={shouldShowError}
          className={cn(
            "h-12 rounded-sm text-[15px] transition-all duration-200 bg-muted/20 border-muted-foreground/10 focus:bg-background",
            icon ? "pl-11" : "px-4",
            shouldShowError &&
              "border-destructive ring-0 focus-visible:ring-destructive/30",
            inputClassName,
          )}
        />
      </div>

      {shouldShowError && (
        <p className="text-sm text-destructive mt-0.5 text-left">{error}</p>
      )}
    </div>
  );
}
