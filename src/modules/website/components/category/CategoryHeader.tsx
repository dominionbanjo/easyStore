import { Search, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CategoryHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function CategoryHeader({
  search,
  onSearchChange,
}: CategoryHeaderProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 border-b border-border/60 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-5 md:py-7 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary flex-shrink-0" />
            Browse Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore categories with live product previews.
          </p>
        </div>

        <div className="relative w-full md:w-72 flex-shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 bg-background rounded-sm border-border/60 dark:border-white/10 focus-visible:ring-primary/20"
          />
        </div>
      </div>
    </div>
  );
}
