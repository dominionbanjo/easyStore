import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface SettingsHeaderProps {
  progress: number;
  isValidated: boolean;
}

export function SettingsHeader({ progress, isValidated }: SettingsHeaderProps) {
  return (
    <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-card to-muted/30">
      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Store Settings
            </h1>
            {isValidated ? (
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 rounded-full gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Validated
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-orange-500 border-orange-500/30 px-3 py-1 rounded-full gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" /> Pending Validation
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground max-w-md">
            Complete your store setup to start receiving online payments and
            reach more customers.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Setup Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[200px]">
          {isValidated ? (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2xl flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-700 dark:text-emerald-400">
                  Ready for Business
                </h4>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-500/60">
                  Your store is online and active.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 p-4 rounded-2xl flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/20">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h4 className="font-bold text-orange-700 dark:text-orange-400">
                  Action Required
                </h4>
                <p className="text-xs text-orange-600/80 dark:text-orange-500/60">
                  Complete all steps to go online.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
