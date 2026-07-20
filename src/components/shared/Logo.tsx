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
        <div
           className={cn(
             "font-black tracking-tighter flex items-center font-outfit uppercase",
             sizeClasses[size]
           )}
        >
          <span className="text-foreground">EAZY</span>
          <span className="text-primary font-light ml-0.5">STORE</span>
        </div>
      </div>
      
      {showTagline && (
        <p
          className="text-[10px] sm:text-[12px] font-bold text-muted-foreground uppercase tracking-[0.4em] mt-1.5 ml-1"
        >
          Simplified
        </p>
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
      <span
        className={cn(
          "font-black text-white leading-none tracking-tighter select-none font-outfit uppercase",
          size === "sm" ? "text-xs" : size === "md" ? "text-lg" : "text-2xl"
        )}
      >
        EZ
      </span>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      <div className="absolute -inset-2 opacity-0 group-hover/logo-icon:opacity-20 transition-opacity duration-300 bg-white blur-xl" />
    </div>
  );
}
