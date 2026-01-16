import { useSearchParams } from "react-router-dom";

interface SearchResultsHeaderProps {
  totalResults?: number;
  categoryName?: string;
}

export function SearchResultsHeader({
  totalResults,
  categoryName,
}: SearchResultsHeaderProps) {
  const [params] = useSearchParams();
  const query = params.get("q");

  return (
    <div className="space-y-1">
      {/* Main heading */}
      <h1 className="text-2xl font-semibold text-gray-900">
        {query ? (
          <>
            Search results for <span className="text-primary">“{query}”</span>
          </>
        ) : (
          "Search results"
        )}
      </h1>

      {/* Sub meta */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        {typeof totalResults === "number" && (
          <span>{totalResults.toLocaleString()} items found</span>
        )}

        {categoryName && (
          <>
            <span>•</span>
            <span>Category: {categoryName}</span>
          </>
        )}
      </div>
    </div>
  );
}
