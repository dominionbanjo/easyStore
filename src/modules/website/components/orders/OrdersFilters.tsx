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
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground z-10" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="SEARCH BY ORDER ID OR REFERENCE..."
          disabled={isLoading}
          className="pl-10 h-10 rounded-sm border-border/40 bg-muted/20 focus:bg-background transition-all font-black text-[10px] uppercase tracking-widest placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Status Filter */}
      <div className="relative sm:w-[180px]">
        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground z-10 pointer-events-none" />
        <Select
          value={statusFilter}
          onValueChange={onStatusChange}
          disabled={isLoading}
        >
          <SelectTrigger className="h-10 rounded-sm border-border/40 bg-muted/20 pl-10 text-[10px] font-black uppercase tracking-widest focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="STATUS" />
          </SelectTrigger>
          <SelectContent className="rounded-sm border-border/40">
            <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Orders</SelectItem>
            <SelectItem value="pending" className="text-[10px] font-black uppercase tracking-widest">Pending</SelectItem>
            <SelectItem value="paid" className="text-[10px] font-black uppercase tracking-widest">Paid</SelectItem>
            <SelectItem value="processing" className="text-[10px] font-black uppercase tracking-widest">Processing</SelectItem>
            <SelectItem value="shipped" className="text-[10px] font-black uppercase tracking-widest">Shipped</SelectItem>
            <SelectItem value="delivered" className="text-[10px] font-black uppercase tracking-widest">Delivered</SelectItem>
            <SelectItem value="canceled" className="text-[10px] font-black uppercase tracking-widest">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

  );
}
