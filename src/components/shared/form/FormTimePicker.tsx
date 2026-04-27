import * as React from "react";
import { Clock } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


interface FormTimePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  rules?: object;
  className?: string;
}

export function FormTimePicker({
  name,
  label,
  placeholder = "Select time",
  rules,
  className,
}: FormTimePickerProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn("space-y-1 w-full", className)}>
      {label && (
        <label className="text-[11px] font-bold uppercase text-muted-foreground px-0.5">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <TimePickerInput
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            error={!!error}
          />
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

interface TimePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

export function TimePickerInput({ value, onChange, placeholder, error }: TimePickerInputProps) {
  const [open, setOpen] = React.useState(false);

  // Parse current value or default to 12:00
  const [hours, minutes] = (value || "12:00").split(":").map(Number);

  const setHours = (h: number) => {
    const min = value ? value.split(":")[1] : "00";
    onChange(`${h.toString().padStart(2, "0")}:${min}`);
  };

  const setMinutes = (m: number) => {
    const hr = value ? value.split(":")[0] : "12";
    onChange(`${hr}:${m.toString().padStart(2, "0")}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-10 px-3 justify-start text-left font-normal rounded-sm border border-muted-foreground/10 bg-muted/20 outline-none hover:bg-background shadow-none transition-colors",
            !value && "text-muted-foreground",
            error && "border-red-500 bg-red-50/10"
          )}
        >
          <Clock className="mr-2 h-4 w-4 opacity-50" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0 border-border/50 shadow-xl" align="start">
        <div className="flex h-[250px] divide-x divide-border/40">
          <div className="flex-1 overflow-y-auto ez-slim-scrollbar">
            <div className="p-1 pb-4">
              <div className="text-[10px] uppercase font-bold text-muted-foreground/60 px-2 py-2 sticky top-0 bg-popover z-10">Hr</div>
              {Array.from({ length: 24 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={cn(
                    "w-full text-center py-2 text-sm rounded-sm transition-colors",
                    hours === i 
                      ? "bg-primary text-white font-bold" 
                      : "hover:bg-muted text-foreground/80"
                  )}
                  onClick={() => setHours(i)}
                >
                  {i.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto ez-slim-scrollbar">
            <div className="p-1 pb-4">
              <div className="text-[10px] uppercase font-bold text-muted-foreground/60 px-2 py-2 sticky top-0 bg-popover z-10">Min</div>
              {Array.from({ length: 12 }).map((_, i) => {
                const m = i * 5;
                return (
                  <button
                    key={m}
                    type="button"
                    className={cn(
                      "w-full text-center py-2 text-sm rounded-sm transition-colors",
                      minutes === m 
                        ? "bg-primary text-white font-bold" 
                        : "hover:bg-muted text-foreground/80"
                    )}
                    onClick={() => setMinutes(m)}
                  >
                    {m.toString().padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="p-2 border-t bg-muted/10 flex justify-end">
             <Button size="sm" className="h-7 text-[11px]" onClick={() => setOpen(false)}>Done</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
