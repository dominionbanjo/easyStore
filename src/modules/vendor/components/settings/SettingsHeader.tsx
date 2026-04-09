import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsHeaderProps {
  progress: number;
  isValidated: boolean;
}

export function SettingsHeader({ progress, isValidated }: SettingsHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight">Store Setup</h1>
            {isValidated ? (
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0 h-5 rounded-sm gap-1 text-[10px] font-black uppercase">
                <ShieldCheck className="w-3 h-3" /> Validated
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-orange-500 border-orange-500/30 px-2 py-0 h-5 rounded-sm gap-1 text-[10px] font-black uppercase"
              >
                <AlertCircle className="w-3 h-3" /> Pending
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Complete high-impact steps to launch your store.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-muted/30 p-2 pr-4 rounded-sm border border-border/40 min-w-[240px]">
          <div
            className={cn(
              "h-10 w-10 rounded-sm flex items-center justify-center shrink-0 shadow-sm",
              isValidated
                ? "bg-emerald-500 text-white"
                : "bg-orange-500 text-white",
            )}
          >
            {isValidated ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Loader2 className="w-6 h-6 animate-spin" />
            )}
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
              <span
                className={isValidated ? "text-emerald-600" : "text-orange-600"}
              >
                {isValidated ? "Active" : "Action Required"}
              </span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
