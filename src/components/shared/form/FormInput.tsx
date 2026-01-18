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
}

export function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  className,
}: FormFieldProps) {
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
            shouldShowError && "text-destructive"
          )}
        >
          {label}
        </Label>
      )}

      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!shouldShowError}
        {...register(name)}
        className={cn(
          "h-11 rounded-md text-[15px] px-3 py-2", // taller input
          shouldShowError &&
            "border-destructive ring-0 focus-visible:ring-destructive/30"
        )}
      />

      {shouldShowError && (
        <p className="text-sm text-destructive mt-0.5 text-left">{error}</p>
      )}
    </div>
  );
}
