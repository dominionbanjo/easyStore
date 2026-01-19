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
}

export function FormTextarea({
  label,
  name,
  placeholder,
  rows = 4,
  className,
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

      <Textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={!!shouldShowError}
        {...register(name)}
        className={cn(
          "rounded-md text-[15px] px-3 py-2 resize-none",
          shouldShowError &&
            "border-destructive ring-0 focus-visible:ring-destructive/30",
        )}
      />

      {shouldShowError && (
        <p className="text-sm text-destructive mt-0.5 text-left">{error}</p>
      )}
    </div>
  );
}
