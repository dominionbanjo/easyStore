import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, ShieldCheck, Wallet, ArrowRight } from "lucide-react";

interface PaymentPreferencesStepProps {
  onSave: () => void;
  isSaving: boolean;
}

export function PaymentPreferencesStep({
  onSave,
  isSaving,
}: PaymentPreferencesStepProps) {
  const { watch, setValue } = useFormContext();
  const escrow = watch("escrow_enabled") as boolean | undefined;
  const installments = watch("installments_enabled") as boolean | undefined;

  return (
    <div className="bg-card border border-border/40 rounded-sm p-6 sm:p-10 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
          Payment Preferences
        </h2>
        <p className="text-sm text-muted-foreground font-medium max-w-xl">
          Choose how buyers pay you. Both features are optional — you can turn
          them on or off anytime from your dashboard.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 p-5 rounded-sm border border-border/40 bg-muted/20">
          <div className="flex gap-4 min-w-0">
            <div className="p-2.5 rounded-sm bg-primary/10 text-primary shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-black uppercase tracking-tight text-foreground">
                Escrow Protection
              </p>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Buyer funds are held safely by EazyStore until delivery is
                confirmed, then released to you. Protects both sides and builds
                buyer trust — recommended for first-time sellers.
              </p>
            </div>
          </div>
          <div className="shrink-0 pt-1">
            <Switch
              checked={Boolean(escrow)}
              onCheckedChange={(val) =>
                setValue("escrow_enabled", val, { shouldDirty: true })
              }
            />
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 p-5 rounded-sm border border-border/40 bg-muted/20">
          <div className="flex gap-4 min-w-0">
            <div className="p-2.5 rounded-sm bg-primary/10 text-primary shrink-0">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-black uppercase tracking-tight text-foreground">
                Pay in Installments
              </p>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Let buyers pay for products in parts — a deposit now, then
                scheduled payments (auto-pay or manual with reminders). The
                product is reserved for the buyer and you ship only when fully
                paid. Boosts sales on high-value items. After enabling, turn on
                Installments on each product you want to offer it for.
              </p>
            </div>
          </div>
          <div className="shrink-0 pt-1">
            <Switch
              checked={Boolean(installments)}
              onCheckedChange={(val) =>
                setValue("installments_enabled", val, { shouldDirty: true })
              }
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="h-12 px-8 rounded-sm text-xs font-black uppercase tracking-widest"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <ArrowRight className="h-4 w-4 mr-2" />
          )}
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
