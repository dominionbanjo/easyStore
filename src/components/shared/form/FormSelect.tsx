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
  icon?: React.ReactNode;
}

export function FormSelect({
  name,
  label,
  placeholder = "Select an option",
  options,
  className,
  disabled = false,
  icon,
}: FormSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = (errors as any)?.[name]?.message as string | undefined;

  return (
    <div className={cn("flex flex-col gap-1.5 group", className)}>
      {label && (
        <Label
          htmlFor={name}
          className="text-sm font-medium text-foreground group-focus-within:text-primary transition-colors"
        >
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
                "w-full h-12 rounded-xl border border-muted-foreground/10 bg-muted/20 px-3 py-[10px] text-[15px] shadow-xs transition-colors focus:bg-background relative text-left",
                icon ? "pl-11" : "px-4",
                error && "border-destructive focus-visible:ring-destructive/20",
              )}
            >
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
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
