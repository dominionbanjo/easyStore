import { RefreshCw } from "lucide-react";

interface InfiniteListRetryProps {
  onRetry: () => void;
  label?: string;
}

export function InfiniteListRetry({
  onRetry,
  label = "Couldn't load more products",
}: InfiniteListRetryProps) {
  return (
    <div className="w-full flex justify-center py-6">
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border border-border/60 bg-muted/30 text-sm font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        {label} — Tap to retry
      </button>
    </div>
  );
}
