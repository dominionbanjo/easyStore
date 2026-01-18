import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
}

export function FormSelect({
  name,
  label,
  placeholder = "Select an option",
  options,
  className,
  disabled = false,
}: FormSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = (errors as any)?.[name]?.message as string | undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              className={cn(
                "w-full h-11 rounded-md border border-input px-3 py-[10px] text-[15px] shadow-xs transition-colors",
                error && "border-destructive focus-visible:ring-destructive/20"
              )}
            >
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
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
