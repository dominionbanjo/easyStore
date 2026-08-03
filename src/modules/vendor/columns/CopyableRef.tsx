import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function CopyableRef({ value }: { value: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    toast.success("Reference copied");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5 group/id">
      <span className="font-semibold text-xs sm:text-sm">
        #{value.slice(0, 8).toUpperCase()}
      </span>
      <button
        onClick={handleCopy}
        className="p-1 opacity-0 group-hover/id:opacity-100 hover:bg-muted rounded-sm transition-all text-muted-foreground hover:text-foreground"
      >
        {isCopied ? (
          <Check className="h-3 w-3 text-emerald-600" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </button>
    </div>
  );
}
