import { motion } from "framer-motion";
import { SearchX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrdersNoResultsProps {
  searchTerm: string;
  statusFilter: string;
  onClearFilters: () => void;
}

export function OrdersNoResults({
  searchTerm,
  statusFilter,
  onClearFilters,
}: OrdersNoResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* No Results Icon */}
      <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-sm flex items-center justify-center mb-6">
        <SearchX className="h-10 w-10 text-gray-400 dark:text-neutral-500" />
      </div>

      {/* No Results Message */}
      <h2 className="text-2xl font-black text-foreground mb-2">
        No orders found
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find any orders matching your search criteria.
      </p>

      {/* Active Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {searchTerm && (
          <Badge
            variant="secondary"
            className="px-3 py-1.5 text-sm font-semibold rounded-sm bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300"
          >
            Search: "{searchTerm}"
          </Badge>
        )}
        {statusFilter !== "all" && (
          <Badge
            variant="secondary"
            className="px-3 py-1.5 text-sm font-semibold rounded-sm bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 capitalize"
          >
            Status: {statusFilter}
          </Badge>
        )}
      </div>

      {/* Clear Filters Button */}
      <Button
        onClick={onClearFilters}
        variant="outline"
        className="rounded-sm h-12 px-8 text-base font-bold border-2 flex items-center gap-2"
      >
        <X className="h-4 w-4" />
        Clear Filters
      </Button>
    </motion.div>
  );
}
