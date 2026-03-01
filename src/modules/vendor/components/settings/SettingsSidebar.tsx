import { motion } from "framer-motion";
import { ChevronRight, AlertCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
}

interface SettingsSidebarProps {
  steps: Step[];
  activeStep: number;
}

export function SettingsSidebar({ steps, activeStep }: SettingsSidebarProps) {
  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="p-2 space-y-1">
        {steps.map((step) => {
          const StepIcon = step.icon;
          const isActive = activeStep === step.id;
          const isCompleted = activeStep > step.id;

          return (
            <div
              key={step.id}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left relative overflow-hidden group border border-transparent",
                isActive
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-emerald-400/20"
                  : isCompleted
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                    : "bg-muted/30 text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                  isActive
                    ? "bg-white/20"
                    : isCompleted
                      ? "bg-emerald-100 dark:bg-emerald-900/40"
                      : "bg-muted",
                )}
              >
                <StepIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{step.title}</p>
                <p
                  className={cn(
                    "text-xs opacity-70",
                    isActive ? "text-white/80" : "text-muted-foreground",
                  )}
                >
                  Step {step.id} of 3
                </p>
              </div>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute right-4 text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              )}
              {isCompleted && (
                <div className="absolute right-4 text-emerald-600 dark:text-emerald-400">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Card className="bg-primary/5 border-primary/10 p-4 rounded-2xl">
        <h4 className="text-sm font-bold flex items-center gap-2 text-primary">
          <AlertCircle className="w-4 h-4" /> Need Help?
        </h4>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          If you have trouble validating your store, please contact our support
          team or check our{" "}
          <a href="#" className="text-primary hover:underline ml-1">
            Merchant Guide
          </a>
          .
        </p>
      </Card>
    </div>
  );
}
