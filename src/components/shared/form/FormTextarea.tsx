import { useFormContext, type RegisterOptions } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormTextareaProps {
  label?: string;
  name: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  icon?: React.ReactNode;
  rules?: RegisterOptions;
}

export function FormTextarea({
  label,
  name,
  placeholder,
  rows = 4,
  className,
  icon,
  rules,
}: FormTextareaProps) {
  const {
    register,
    formState: { errors, touchedFields, submitCount },
  } = useFormContext();

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
          <div className="absolute left-3.5 top-3.5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300">
            {icon}
          </div>
        )}
        <Textarea
          id={name}
          rows={rows}
          placeholder={placeholder}
          aria-invalid={!!shouldShowError}
          {...register(name, rules)}
          className={cn(
            "rounded-sm text-sm transition-all duration-300 bg-muted/30 border-muted-foreground/10 focus:bg-background/80 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 resize-none  group-hover:bg-muted/40",
            icon ? "pl-11" : "px-4",
            shouldShowError &&
              "border-destructive/50 ring-4 ring-destructive/10 focus-visible:ring-destructive/20",
          )}
        />
        <div className="absolute inset-0 rounded-sm border border-primary/0 pointer-events-none group-focus-within:border-primary/10 transition-colors duration-500" />
      </div>

      {shouldShowError && (
        <p className="text-sm text-destructive mt-0.5 text-left">{error}</p>
      )}
    </div>
  );
}
