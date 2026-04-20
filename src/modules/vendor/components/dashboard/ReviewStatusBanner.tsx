import { motion } from "framer-motion";
import { CheckCircle2, Rocket, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getAppPath } from "@/utils/subdomain";

export function ReviewStatusBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-sm border border-emerald-500/20 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-500/5 dark:to-background p-5 sm:p-6 mt-4 mb-8"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <Rocket className="w-24 h-24 rotate-12" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-5">
        {/* Left: icon + text */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Icon — hidden on very small screens to save space */}
          <div className="h-12 w-12 rounded-sm bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0 hidden sm:flex">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="min-w-0">
            {/* Badge + title row */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                Setup Complete
              </span>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-foreground leading-tight">
                Your store is under review 🚀
              </h3>
            </div>
            <p className="text-muted-foreground font-medium text-sm">
              Great job! Our team is verifying your details. While you wait, start
              adding products so you&apos;re ready to launch the moment you&apos;re approved.
            </p>
          </div>
        </div>

        {/* Right: CTA button only */}
        <div className="shrink-0 w-full lg:w-auto">
          <Button
            asChild
            className="h-11 w-full lg:w-auto px-6 rounded-sm font-black uppercase tracking-widest text-xs bg-primary  "
          >
            <Link to={getAppPath("/products/new")} className="flex items-center justify-center gap-2">
              <Package className="w-4 h-4" />
              Add First Product
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
