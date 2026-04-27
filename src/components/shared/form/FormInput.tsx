import { useState } from "react";
import { useFormContext, useController, type RegisterOptions } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string; // Wrapper className
  inputClassName?: string; // Input className
  icon?: React.ReactNode;
  rules?: RegisterOptions;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
}

export function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  className,
  inputClassName,
  icon,
  rules,
  disabled,
  readOnly,
  maxLength,
}: FormFieldProps) {
  const {
    control,
    formState: { errors, touchedFields, submitCount },
  } = useFormContext();

  const {
    field: { value, onChange, onBlur, ref },
  } = useController({
    name,
    control,
    rules,
  });

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

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

  // Map null/undefined to empty string for the native input
  const displayValue = value === null || value === undefined ? "" : value;

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
          id={name}
          ref={ref}
          name={name}
          type={inputType}
          value={displayValue}
          onBlur={onBlur}
          onChange={(e) => {
            const val = e.target.value;
            if (type === "number") {
              onChange(val === "" ? null : Number(val));
            } else {
              onChange(val);
            }
          }}
          onFocus={(e) => {
            // Select text on focus for easier editing of existing values
            if (type === "number") e.target.select();
          }}
          placeholder={placeholder}
          aria-invalid={shouldShowError}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          min={type === "number" ? 0 : undefined}
          className={cn(
            "h-12 rounded-sm text-[15px] transition-all duration-200 bg-muted/20 border-muted-foreground/10 focus:bg-background",
            icon ? "pl-11" : "px-4",
            isPassword && "pr-10",
            shouldShowError &&
              "border-destructive ring-0 focus-visible:ring-destructive/30",
            inputClassName,
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {shouldShowError && (
        <p className="text-sm text-destructive mt-0.5 text-left">{error}</p>
      )}
    </div>
  );
}
