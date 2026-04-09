import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface WelcomeProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: () => void;
}

export function WelcomeProductModal({
  open,
  onOpenChange,
  onAddProduct,
}: WelcomeProductModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] p-0 overflow-hidden rounded-sm sm:rounded-sm border-none shadow-2xl flex flex-col md:flex-row">
        <DialogHeader className="sr-only">
          <DialogTitle>Store Setup Complete</DialogTitle>
          <DialogDescription>
            Your store is ready! Start adding products to begin selling.
          </DialogDescription>
        </DialogHeader>

        {/* Left Side - Success Visual */}
        <div className="w-full md:w-[40%] bg-gradient-to-br from-emerald-500 to-teal-700 p-8 text-white relative flex flex-col justify-center items-center overflow-hidden shrink-0 min-h-[220px]">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Sparkles className="w-48 h-48 rotate-12 translate-x-12 translate-y-12" />
          </div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="relative z-10 h-20 w-20 rounded-sm bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-xl"
          >
            <Zap className="h-10 w-10 text-white fill-current" />
          </motion.div>

          <h2 className="relative z-10 text-3xl font-black uppercase tracking-tight leading-none text-center">
            You're <br /> All Set!
          </h2>
        </div>

        {/* Right Side - Call to Action */}
        <div className="w-full md:w-[60%] p-8 bg-background flex flex-col justify-center">
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 text-emerald-500">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] uppercase font-black tracking-[0.2em]">
                Setup Complete
              </span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-foreground leading-tight">
              Ready to start <br /> your journey?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your store profile and payout settings are verified. The only
              thing missing to start making money is your first product!
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={onAddProduct}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm h-14 font-black uppercase tracking-widest text-xs  shadow-xl shadow-emerald-500/20"
            >
              Add My First Product
              <Package className="h-4 w-4 ml-2" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full text-muted-foreground font-bold text-[10px] uppercase tracking-widest h-10 hover:bg-muted/50"
            >
              Explore Dashboard First
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
