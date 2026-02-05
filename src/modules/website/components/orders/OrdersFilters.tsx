import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface OrdersFiltersProps {
  searchValue: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  isLoading?: boolean;
}

export function OrdersFilters({
  searchValue,
  statusFilter,
  onSearchChange,
  onStatusChange,
  isLoading,
}: OrdersFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Order ID or Reference..."
          disabled={isLoading}
          className="pl-11 h-12 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white transition-colors font-medium placeholder:text-gray-400"
        />
      </div>

      {/* Status Filter */}
      <div className="relative sm:w-[200px]">
        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
        <Select
          value={statusFilter}
          onValueChange={onStatusChange}
          disabled={isLoading}
        >
          <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-gray-50 pl-11 font-medium">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="canceled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
