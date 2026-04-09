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
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between border-b border-zinc-200 dark:border-white/10 pb-8 transition-colors duration-300">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground">
          {categoryName ? (
            categoryName
          ) : query ? (
            <>
              Results for{" "}
              <span className="text-primary dark:text-emerald-400 italic">
                "{query}"
              </span>
            </>
          ) : (
            "All Products"
          )}
        </h1>
        <p className="text-sm md:text-base font-medium text-muted-foreground/60">
          {typeof totalResults === "number" ? (
            <>
              Discovered{" "}
              <span className="text-foreground font-black">{totalResults}</span>{" "}
              products
            </>
          ) : (
            "Scanning marketplace..."
          )}
        </p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
        {/* Mobile Filters Trigger */}
        <div className="flex-1 md:flex-initial">
          <MobileSearchFilters products={products} />
        </div>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 md:flex-none h-12 md:h-11 px-6 rounded-sm border-zinc-200 dark:border-emerald-500/20 bg-white dark:bg-neutral-900 backdrop-blur-xl hover:bg-zinc-50 dark:hover:bg-neutral-800 transition-all font-black text-xs  justify-between gap-4 min-w-[160px] text-zinc-900 dark:text-white relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="flex items-center gap-2.5 truncate relative z-10">
                <ArrowUpDown className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                <span className="truncate uppercase tracking-[0.15em]">
                  {activeSortLabel}
                </span>
              </span>
              <ChevronDown className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[220px] rounded-sm  border-zinc-200 dark:border-emerald-500/10 p-2 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl"
          >
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 px-3 py-3">
              Order by
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-white/5 mx-1" />
            <div className="space-y-1 mt-1">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSort(option.value)}
                  className={cn(
                    "flex items-center justify-between rounded-sm px-3 py-3 text-xs font-bold transition-all cursor-pointer",
                    currentSort === option.value
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  {option.label}
                  {currentSort === option.value && (
                    <div className="h-1.5 w-1.5 rounded-sm bg-emerald-500 -[0_0_8px_rgba(16,185,129,0.6)]" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
