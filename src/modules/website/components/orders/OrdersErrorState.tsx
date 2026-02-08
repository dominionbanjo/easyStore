import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrdersErrorStateProps {
  onRetry: () => void;
}

export function OrdersErrorState({ onRetry }: OrdersErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Error Icon */}
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>

      {/* Error Message */}
      <h2 className="text-2xl font-black text-foreground mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        We couldn't load your orders. This might be a temporary issue. Please
        try again.
      </p>

      {/* Retry Button */}
      <Button
        onClick={onRetry}
        className="rounded-full h-12 px-8 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </motion.div>
  );
}
