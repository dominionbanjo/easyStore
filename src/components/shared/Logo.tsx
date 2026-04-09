import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
}

export function Logo({ className, size = "md", showTagline = false }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  return (
    <div className={cn("flex flex-col items-start leading-none", className)}>
      <div className="flex items-center">
        <motion.div
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
           className={cn(
             "font-black tracking-tighter flex items-center font-outfit uppercase",
             sizeClasses[size]
           )}
        >
          <span className="text-foreground">EAZY</span>
          <span className="text-primary font-light ml-0.5">STORE</span>
        </motion.div>
      </div>
      
      {showTagline && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[10px] sm:text-[12px] font-bold text-muted-foreground uppercase tracking-[0.4em] mt-1.5 ml-1"
        >
          Simplified
        </motion.p>
      )}
    </div>
  );
}

// Minimal stylized icon variant
export function LogoIcon({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-sm bg-primary shadow-lg shadow-primary/20 relative overflow-hidden group/logo-icon",
        iconSizes[size],
        className
      )}
    >
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "font-black text-white leading-none tracking-tighter select-none font-outfit uppercase",
          size === "sm" ? "text-xs" : size === "md" ? "text-lg" : "text-2xl"
        )}
      >
        EZ
      </motion.span>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      <div className="absolute -inset-2 opacity-0 group-hover/logo-icon:opacity-20 transition-opacity duration-300 bg-white blur-xl" />
    </div>
  );
}
