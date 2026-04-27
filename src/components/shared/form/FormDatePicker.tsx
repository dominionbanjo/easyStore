import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormDatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  rules?: object;
  maxDate?: Date;
  minDate?: Date;
  className?: string;
}

export function FormDatePicker({
  name,
  label,
  placeholder = "Pick a date",
  rules,
  maxDate,
  minDate,
  className,
}: FormDatePickerProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn("space-y-1 w-full", className)}>
      {label && (
        <label className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1.5">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full h-10 px-3 justify-start text-left font-normal rounded-md border border-input bg-background outline-none hover:bg-background shadow-none transition-colors",
                  !field.value && "text-muted-foreground",
                  error && "border-red-500 bg-red-50/10 focus:ring-red-500/20"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? format(new Date(field.value), "PPP") : <span>{placeholder}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date?.toISOString())}
                initialFocus
                disabled={(date) => 
                  (maxDate ? date > maxDate : false) || (minDate ? date < minDate : false)
                }
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {error && (
        <p className="text-[11px] font-medium text-red-500">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
