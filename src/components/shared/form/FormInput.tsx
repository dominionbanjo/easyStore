import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  className,
  icon,
}: FormFieldProps) {
  const {
    register,
    formState: { errors, touchedFields, submitCount },
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const error = errors[name]?.message as string | undefined;
  const shouldShowError = !!error && (touchedFields[name] || submitCount > 0);

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
          type={inputType}
          placeholder={placeholder}
          aria-invalid={shouldShowError}
          min={type === "number" ? 0 : undefined}
          {...register(name, {
            setValueAs:
              type === "number"
                ? (v) => {
                    if (v === "" || v === null) return undefined;
                    const n = Number(v);
                    return Number.isNaN(n) ? undefined : Math.max(0, n);
                  }
                : undefined,
          })}
          className={cn(
            "h-12 rounded-xl text-[15px] transition-all duration-200 bg-muted/20 border-muted-foreground/10 focus:bg-background",
            icon ? "pl-11" : "px-4",
            isPassword && "pr-10",
            shouldShowError &&
              "border-destructive ring-0 focus-visible:ring-destructive/30",
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
