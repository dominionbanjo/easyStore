import { useSearchParams } from "react-router-dom";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import type { IProduct } from "@/types/product/productTypes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MobileSearchFilters } from "./Sidebar";

interface SearchResultsHeaderProps {
  totalResults?: number;
  categoryName?: string;
  products?: IProduct[];
}

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating_desc" },
  { label: "Newest Arrivals", value: "date_desc" },
];

export function SearchResultsHeader({
  totalResults,
  categoryName,
  products = [],
}: SearchResultsHeaderProps) {
  const [params, setParams] = useSearchParams();
  const query = params.get("q");
  const currentSort = params.get("sort") || "relevance";

  const handleSort = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === "relevance") next.delete("sort");
    else next.set("sort", value);
    setParams(next);
  };

  const activeSortLabel = SORT_OPTIONS.find(
    (o) => o.value === currentSort,
  )?.label;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between border-b pb-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {categoryName ? (
            categoryName
          ) : query ? (
            <>
              Results for <span className="text-primary italic">"{query}"</span>
            </>
          ) : (
            "All Products"
          )}
        </h1>
        <p className="text-sm text-muted-foreground">
          {typeof totalResults === "number" ? (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">
                {totalResults}
              </span>{" "}
              results
            </>
          ) : (
            "Loading results..."
          )}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Mobile Filters Trigger */}
        <MobileSearchFilters products={products} />

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 min-w-[140px] justify-between"
            >
              <span className="flex items-center gap-2 truncate">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">{activeSortLabel}</span>
              </span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Sort by
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSort(option.value)}
                className="justify-between"
              >
                {option.label}
                {currentSort === option.value && (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
