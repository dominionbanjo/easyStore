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
    <div
      className={`flex flex-col items-center justify-center py-20 text-center bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl rounded-sm border border-zinc-200 dark:border-white/5  ${className}`}
    >
      <div className="w-24 h-24 bg-primary/10 dark:bg-emerald-500/10 rounded-sm flex items-center justify-center mb-8 ring-8 ring-primary/5 dark:ring-emerald-500/5">
        <Icon className="w-12 h-12 text-primary dark:text-emerald-400" />
      </div>
      <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
