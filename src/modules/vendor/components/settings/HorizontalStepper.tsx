import { motion } from "framer-motion";
import { Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
}

interface HorizontalStepperProps {
  steps: Step[];
  activeStep: number;
  onStepClick?: (stepId: number) => void;
}

export function HorizontalStepper({ steps, activeStep, onStepClick }: HorizontalStepperProps) {
  return (
    <div className="w-full pt-4 pb-12 px-2">
      <div className="relative flex justify-between items-center max-w-2xl mx-auto">
        {/* Background Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-muted z-0" />
        
        {/* Progress Line */}
        <motion.div 
          className="absolute top-5 left-0 h-0.5 bg-primary z-0 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (activeStep - 1) / (steps.length - 1) }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ width: "100%" }}
        />

        {steps.map((step, index) => {
          const isActive = activeStep === step.id;
          const isCompleted = activeStep > step.id;
          const StepIcon = step.icon;
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <button
                onClick={() => (isCompleted || isActive) && onStepClick?.(step.id)}
                disabled={!isCompleted && !isActive}
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  isActive 
                    ? "bg-background border-primary text-primary ring-4 ring-primary/10" 
                    : isCompleted 
                      ? "bg-primary border-primary text-white" 
                      : "bg-background border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                   <Check className="w-5 h-5" />
                ) : (
                  <StepIcon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                )}
              </button>
              
              {/* Labels - with strategic positioning to prevent overflow */}
              <div className={cn(
                "absolute top-12 whitespace-nowrap flex flex-col",
                isFirst ? "items-start left-0" : isLast ? "items-end right-0" : "items-center left-1/2 -translate-x-1/2"
              )}>
                <span className={cn(
                  "text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors duration-300",
                  isActive ? "text-primary" : isCompleted ? "text-muted-foreground" : "text-muted-foreground/50",
                  "hidden sm:block"
                )}>
                  {step.title}
                </span>
                {/* Mobile active label only */}
                {isActive && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary block sm:hidden">
                    {step.title}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
