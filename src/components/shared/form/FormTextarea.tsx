import { useFormContext } from "react-hook-form";
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
}

export function FormTextarea({
  label,
  name,
  placeholder,
  rows = 4,
  className,
  icon,
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
          <div className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <Textarea
          id={name}
          rows={rows}
          placeholder={placeholder}
          aria-invalid={!!shouldShowError}
          {...register(name)}
          className={cn(
            "rounded-xl text-sm transition-all duration-200 bg-muted/20 border-muted-foreground/10 focus:bg-background resize-none",
            icon ? "pl-11" : "px-4",
            shouldShowError &&
              "border-destructive ring-0 focus-visible:ring-destructive/30",
          )}
        />
      </div>

      {shouldShowError && (
        <p className="text-sm text-destructive mt-0.5 text-left">{error}</p>
      )}
    </div>
  );
}
