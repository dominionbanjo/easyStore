import { useSearchParams } from "react-router-dom";
import type { IProduct } from "@/types/product/productTypes";

interface SearchResultsHeaderProps {
  totalResults?: number;
  categoryName?: string;
  products?: IProduct[];
  filters?: Record<string, string[]>;
}

export function SearchResultsHeader({
  totalResults,
  categoryName,
}: SearchResultsHeaderProps) {
  const [params] = useSearchParams();
  const query = params.get("q");

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between border-b border-zinc-200 dark:border-white/10 pb-8 transition-colors duration-300">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[1.1]">
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

      <div className="flex items-center w-full md:w-auto mt-6 md:mt-0 p-1 md:p-0 bg-zinc-100/50 dark:bg-white/5 md:bg-transparent rounded-full md:rounded-none">
        {/* Actions or filters can go here in the future if needed */}
      </div>
    </div>
  );
}
