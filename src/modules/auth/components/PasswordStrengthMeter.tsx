import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password?: string;
}

export function PasswordStrengthMeter({
  password = "",
}: PasswordStrengthMeterProps) {
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    {
      label: "Contains a special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
    { label: "Contains an uppercase letter", met: /[A-Z]/.test(password) },
  ];

  const strength = criteria.filter((c) => c.met).length;
  const strengthPercentage = (strength / criteria.length) * 100;

  const strengthColor =
    strength === 0
      ? "bg-slate-200"
      : strength <= 2
        ? "bg-red-500"
        : strength === 3
          ? "bg-yellow-500"
          : "bg-green-500";

  if (!password) return null;

  return (
    <div className="space-y-3 mt-3 animate-in fade-in slide-in-from-top-1">
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 rounded-sm overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            strengthColor,
          )}
          style={{ width: `${strengthPercentage}%` }}
        />
      </div>

      {/* Criteria List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {criteria.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors duration-300",
              item.met ? "text-green-600 font-medium" : "text-muted-foreground",
            )}
          >
            {item.met ? (
              <Check className="h-3 w-3 shrink-0" />
            ) : (
              <X className="h-3 w-3 shrink-0 text-muted-foreground/50" />
            )}
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
