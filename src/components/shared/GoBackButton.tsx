import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GoBackButtonProps {
  className?: string;
  variant?: "ghost" | "outline" | "default" | "secondary";
}

export function GoBackButton({ className, variant = "ghost" }: GoBackButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={() => navigate(-1)}
      className={cn(
        "group flex items-center gap-2 px-0 hover:bg-transparent -[var(--theme-primary)] hover:text-[var(--theme-primary)] transition-all duration-300 font-bold uppercase tracking-widest text-[10px]",
        className
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-muted/50 dark:bg-zinc-800 group-hover:bg-primary group-hover:text-white transition-all ring-1 ring-border shadow-sm">
        <ArrowLeft className="w-4 h-4" />
      </div>
      <span>Go Back</span>
    </Button>
  );
}
