import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon?: React.ElementType;
}

interface SearchParamTabsProps {
  tabs: Tab[];
  paramName?: string;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
}

export function SearchParamTabs({
  tabs,
  paramName = "tab",
  className,
  tabClassName,
  activeTabClassName,
}: SearchParamTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get(paramName) || tabs[0]?.id;

  const handleTabChange = (id: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(paramName, id);
    setSearchParams(newParams);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2 bg-muted/20 p-2 rounded-sm border border-border/40", className)}>
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-[0.15em] transition-all relative overflow-hidden",
              "transition-all duration-300",
              isActive 
                ? cn("bg-primary text-white shadow-lg shadow-primary/20 scale-[1.05]", activeTabClassName) 
                : cn("text-muted-foreground/60 hover:text-foreground hover:bg-muted/50", tabClassName)
            )}
          >
            {isActive && (
              <motion.div
                layoutId={`active-bg-${paramName}`}
                className="absolute inset-0 bg-primary -z-10"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            {Icon && (
              <Icon 
                className={cn("w-4 h-4 transition-transform duration-300", isActive ? "scale-110" : "opacity-70 scale-90")} 
                variant={isActive ? "Bold" : "Outline"} 
                color="currentColor" 
              />
            )}
            <span className={cn("relative z-10", isActive ? "opacity-100" : "opacity-80")}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
