import { motion } from "framer-motion";
import {
  Rocket,
  ChevronRight,
  Circle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useStoreSetup } from "../../hooks/useStoreSetup";
import { cn } from "@/lib/utils";

interface StoreSetupTrackerProps {
  variant?: "card" | "compact" | "minimal";
  className?: string;
}

export function StoreSetupTracker({
  variant = "card",
  className,
}: StoreSetupTrackerProps) {
  const { progress, missingSteps, isLoading, isReady } = useStoreSetup();

  if (isLoading || isReady) return null;

  if (variant === "minimal") {
    return (
      <Link
        to="/vendor/settings"
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 transition-all group",
          className,
        )}
      >
        <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">
              Complete Store Setup
            </p>
            <span className="text-[10px] font-black text-orange-600">
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-1 bg-orange-500/10" />
        </div>
        <ChevronRight className="h-4 w-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border-none shadow-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8",
        className,
      )}
    >
      {/* Background patterns */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Rocket className="w-40 h-40 rotate-12" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                Your Store is not ready
              </h3>
              <p className="text-orange-100 text-sm font-medium">
                Complete your profile to start selling and reaching customers.
              </p>
            </div>
          </div>

          <div className="space-y-2 max-w-md">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-white/80">
              <span>Overall Progress</span>
              <span>{progress}% Complete</span>
            </div>
            <div className="relative h-3 w-full bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="absolute inset-y-0 left-0 bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]"
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto h-full flex flex-col gap-3">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 border-b border-white/5 pb-2">
              Remaining Tasks ({missingSteps.length})
            </p>
            <div className="space-y-2">
              {missingSteps.slice(0, 2).map((step) => (
                <div
                  key={step.id}
                  className="flex items-center gap-2 text-xs font-bold"
                >
                  <Circle className="h-3 w-3 text-white/40" />
                  {step.title}
                </div>
              ))}
              {missingSteps.length > 2 && (
                <div className="text-[10px] font-black text-white/60 pl-5">
                  + {missingSteps.length - 2} more tasks
                </div>
              )}
            </div>
          </div>

          <Button
            asChild
            className="bg-white text-orange-600 hover:bg-orange-50 rounded-xl font-black uppercase tracking-widest text-xs h-11 shadow-xl"
          >
            <Link to="/vendor/settings">
              Finish Setup
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
