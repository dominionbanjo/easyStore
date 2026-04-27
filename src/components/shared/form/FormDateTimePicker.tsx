import { format, setHours, setMinutes, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerInput } from "./FormTimePicker";

interface FormDateTimePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  rules?: object;
  maxDate?: Date;
  minDate?: Date;
  className?: string;
}

export function FormDateTimePicker({
  name,
  label,
  placeholder = "Pick date & time",
  rules,
  maxDate,
  minDate,
  className,
}: FormDateTimePickerProps) {
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
        render={({ field }) => {
          const value = field.value ? new Date(field.value) : undefined;
          
          const handleDateSelect = (date: Date | undefined) => {
            if (!date) return;
            let newDate = date;
            if (value) {
              newDate = setHours(newDate, value.getHours());
              newDate = setMinutes(newDate, value.getMinutes());
            } else {
              newDate = setHours(newDate, 12);
              newDate = setMinutes(newDate, 0);
            }
            field.onChange(newDate.toISOString());
          };

          const handleTimeChange = (time: string) => {
            if (!time) return;
            const [hours, minutes] = time.split(":").map(Number);
            const newDate = setMinutes(setHours(value || new Date(), hours), minutes);
            field.onChange(newDate.toISOString());
          };

          return (
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
                  {field.value ? format(new Date(field.value), "PPp") : <span>{placeholder}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={(date) => 
                    (maxDate ? date > maxDate : false) || (minDate ? date < startOfDay(minDate) : false)
                  }
                />
                <div className="p-3 border-t flex flex-col gap-2 bg-muted/10">
                   <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">Adjust Time</span>
                   </div>
                   <TimePickerInput
                     value={value ? format(value, "HH:mm") : ""}
                     onChange={(time) => handleTimeChange(time)}
                   />
                </div>
              </PopoverContent>
            </Popover>
          );
        }}
      />
      {error && (
        <p className="text-[11px] font-medium text-red-500">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
