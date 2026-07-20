import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldAlert, Rocket, ArrowRight } from "lucide-react";
import { useStoreSetup } from "../../hooks/useStoreSetup";
interface SetupEnforcementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SetupEnforcementModal({
  open,
  onOpenChange,
}: SetupEnforcementModalProps) {
  const { missingSteps, progress } = useStoreSetup();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] h-auto max-h-[95vh] p-0 overflow-y-auto md:overflow-hidden rounded-sm sm:rounded-sm border-none  flex flex-col md:flex-row custom-scrollbar">
        <DialogHeader className="sr-only">
          <DialogTitle>Store Setup Required</DialogTitle>
          <DialogDescription>
            You need to complete your store setup to activate all vendor features.
          </DialogDescription>
        </DialogHeader>
        {/* Left Side - Visual */}
        <div className="w-full md:w-[38%] bg-gradient-to-br from-orange-500 to-red-600 p-5 sm:p-8 text-white relative flex flex-col justify-between overflow-hidden shrink-0 min-h-[180px] md:min-h-[220px]">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Rocket className="w-48 h-48 rotate-12 translate-x-12 translate-y-12" />
          </div>

          <div className="relative z-10">
            <div className="h-14 w-14 rounded-sm bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
              <ShieldAlert className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none mb-3 sm:mb-4">
              Almost There!
            </h2>
            <p className="text-orange-100 font-medium text-sm">
              Your store is currently in "Draft Mode". Complete the setup to
              unlock all features.
            </p>
          </div>

          <div className="relative z-10 mt-8 md:mt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/80">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-sm overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Tasks */}
        <div className="w-full md:w-[62%] p-5 sm:p-8 bg-background flex flex-col min-h-0 overflow-hidden">
          <div className="flex justify-between items-start mb-6 shrink-0">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground">
                Required Actions
              </h3>
              <p className="text-sm text-muted-foreground">
                The following details are still missing:
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3 mb-6 overflow-y-auto custom-scrollbar pr-2 min-h-0">
            {missingSteps.map((step) => (
              <div
                className="flex items-start gap-4 p-4 rounded-sm bg-muted/30 border border-muted-foreground/5 hover:bg-muted/50 transition-colors"
              >
                <div className="mt-1 h-5 w-5 rounded-sm border-2 border-orange-500/30 flex items-center justify-center shrink-0">
                  <div className="h-1.5 w-1.5 rounded-sm bg-orange-500" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-foreground">
                    {step.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 shrink-0 pt-4 border-t border-border/40">
            <Button
              asChild
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-sm h-14 font-black uppercase tracking-widest text-xs  -orange-500/20"
            >
              <Link to="/settings">
                Go to Settings
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground font-bold text-xs uppercase tracking-widest h-10"
              >
                Maybe Later
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
