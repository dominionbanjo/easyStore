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
    <div className={cn(
      "flex items-center justify-center rounded-sm bg-primary shadow-md relative overflow-hidden",
      iconSizes[size],
      className
    )}>
       <div className="absolute inset-x-1.5 top-2.5 h-1 bg-white rounded-full opacity-40" />
       <div className="absolute inset-x-1.5 top-5 h-1 bg-white rounded-full opacity-70" />
       <div className="absolute inset-x-1.5 top-7.5 h-1 bg-white rounded-full opacity-100" />
       <div className="absolute left-1.5 top-2.5 bottom-2.5 w-1 bg-white rounded-full opacity-90" />
    </div>
  );
}
