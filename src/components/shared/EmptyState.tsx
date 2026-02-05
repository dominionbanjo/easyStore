import { motion } from "framer-motion";
import { PackageOpen, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  className = "",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-20 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6 ring-8 ring-muted/20">
        <Icon className="w-10 h-10 text-muted-foreground/60" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-sm mx-auto">{description}</p>
      )}
    </motion.div>
  );
}
