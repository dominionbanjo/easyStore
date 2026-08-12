import { useFormContext, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Wallet, Sparkles, ShieldAlert, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESETS = [
  { id: "fifty-fifty-2wk", name: "50/50 · 2 weeks", count: 2, interval: "7 days" },
  { id: "thirds-3wk", name: "33/33/34 · 3 weeks", count: 3, interval: "7 days" },
  { id: "quarters-4wk", name: "25% × 4 · 4 weeks", count: 4, interval: "7 days" },
  { id: "half-2mo", name: "50/50 · 2 months", count: 2, interval: "30 days" },
  { id: "thirds-3mo", name: "33/33/34 · 3 months", count: 3, interval: "30 days" },
  { id: "quarters-4mo", name: "25% × 4 · 4 months", count: 4, interval: "30 days" },
];

const DEFAULT_PRESETS = ["fifty-fifty-2wk"];

interface InstallmentSectionProps {
  /** Store-wide opt-in — installments must be enabled in Settings first. */
  storeInstallmentsEnabled?: boolean;
}

export function InstallmentSection({
  storeInstallmentsEnabled = true,
}: InstallmentSectionProps) {
  const { setValue } = useFormContext();

  const enabled = useWatch({ name: "installment_enabled" }) as
    | boolean
    | undefined;
  const presets = useWatch({ name: "installment_presets" }) as
    | string[]
    | undefined;

  const handleToggle = (checked: boolean) => {
    setValue("installment_enabled", checked, { shouldDirty: true });
    if (checked && (!presets || presets.length === 0)) {
      setValue("installment_presets", DEFAULT_PRESETS, {
        shouldDirty: true,
      });
    }
  };

  const togglePreset = (presetId: string) => {
    const current = presets ?? [];
    const next = current.includes(presetId)
      ? current.filter((id) => id !== presetId)
      : [...current, presetId];
    if (next.length === 0) return; // keep at least one plan selectable
    setValue("installment_presets", next, { shouldDirty: true });
  };

  return (
    <div className="space-y-5">
      {!storeInstallmentsEnabled && (
        <div className="flex items-start gap-3 p-4 rounded-sm bg-amber-500/10 border border-amber-500/20">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-black text-amber-700 uppercase tracking-wide">
              Installments are turned off for your store
            </p>
            <p className="text-[11px] text-amber-700/80 font-medium leading-relaxed">
              Go to <span className="font-bold">Settings → Payment Preferences</span> and
              enable “Installments” before you can offer plans on this product. This
              product-level toggle will stay locked until then.
            </p>
          </div>
        </div>
      )}

      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-3 rounded-sm border ${
          storeInstallmentsEnabled
            ? "bg-muted/20 border-border/40"
            : "bg-muted/10 border-border/20 opacity-70"
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <Label className="text-base sm:text-lg font-black uppercase tracking-tight">
              Pay in Installments
            </Label>
            <Badge
              variant="secondary"
              className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary"
            >
              Optional
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-medium max-w-[460px]">
            Let buyers pay for this product in parts — a deposit now, then
            scheduled payments. The product is reserved for them and ships only
            when fully paid. This enables the option for this product only.
          </p>
        </div>
        <div className="flex items-center justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-none border-border/10">
          <Switch
            checked={Boolean(enabled)}
            onCheckedChange={handleToggle}
            disabled={!storeInstallmentsEnabled}
          />
        </div>
      </div>

      {enabled && storeInstallmentsEnabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Choose which payment plans buyers can pick
            </p>
            <span className="text-[10px] font-bold text-muted-foreground/60">
              {(presets ?? []).length} selected
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {PRESETS.map((preset) => {
              const isSelected = (presets ?? []).includes(preset.id);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => togglePreset(preset.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex items-center justify-between gap-2 p-3 rounded-sm border text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border/40 bg-card hover:border-primary/40",
                  )}
                >
                  <div className="flex flex-col items-start gap-1 min-w-0">
                    <span
                      className={cn(
                        "text-xs font-black uppercase tracking-tight",
                        isSelected ? "text-primary" : "text-foreground",
                      )}
                    >
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {preset.count} payments · {preset.interval} apart
                    </span>
                  </div>
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-all",
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-border/50",
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/70">
            <Sparkles className="h-3 w-3 text-primary" />
            Buyers will only see the plans you select here — pick up to all six.
          </p>
        </div>
      )}
    </div>
  );
}
