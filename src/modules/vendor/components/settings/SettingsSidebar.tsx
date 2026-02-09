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
  setActiveStep: (step: number) => void;
}

export function SettingsSidebar({
  steps,
  activeStep,
  setActiveStep,
}: SettingsSidebarProps) {
  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="p-2 space-y-1">
        {steps.map((step) => {
          const StepIcon = step.icon;
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left relative overflow-hidden group",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
              )}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                  isActive
                    ? "bg-white/20"
                    : "bg-muted group-hover:bg-primary/10",
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
                <motion.div layoutId="active-pill" className="absolute right-4">
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              )}
            </button>
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
