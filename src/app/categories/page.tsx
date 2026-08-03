import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategoriesQuery } from "@/services/productDetailsApi";
import { CategoryHeader } from "@/modules/website/components/category/CategoryHeader";
import { CategoryGroup } from "@/modules/website/components/category/CategoryGroup";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useGetCategoriesQuery({
    page: 1,
    limit: 50,
  });

  /* ───────────────── DATA ───────────────── */
  const categories = useMemo(() => data?.data ?? [], [data]);

  /* ───────────────── SEARCH (FRONTEND ONLY) ───────────────── */
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;

    const q = search.toLowerCase();

    return categories
      .map((parent) => {
        const parentMatch = parent.name.toLowerCase().includes(q);
        const children = parent.children.filter((child) =>
          child.name.toLowerCase().includes(q),
        );

        if (parentMatch || children.length > 0) {
          return {
            ...parent,
            children: parentMatch ? parent.children : children,
          };
        }

        return null;
      })
      .filter((c): c is (typeof categories)[number] => c !== null);
  }, [categories, search]);

  /* ───────────────── LOADING STATE ───────────────── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
        <div className="bg-white dark:bg-neutral-900 border-b border-border/50">
          <div className="w-full mx-auto px-4 py-12 md:py-16 text-center space-y-10">
            <Skeleton className="h-4 w-32 mx-auto rounded-sm" />
            <div className="space-y-4">
              <Skeleton className="h-12 sm:h-16 w-full max-w-lg mx-auto rounded-sm" />
              <Skeleton className="h-6 w-full max-w-md mx-auto rounded-sm" />
            </div>
            <Skeleton className="h-16 w-full max-w-xl mx-auto rounded-sm" />
          </div>
        </div>
        <div className="w-full mx-auto px-4 py-8 md:py-16 space-y-20">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-2 border-primary/5 pb-4">
                <Skeleton className="h-10 w-48 rounded-sm" />
                <Skeleton className="h-8 w-32 rounded-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton
                    key={j}
                    className="h-32 rounded-sm border border-border/50"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ───────────────── ERROR STATE ───────────────── */
  if (isError) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 bg-white dark:bg-neutral-950 transition-colors duration-300">
        <div className="w-20 h-20 bg-destructive/5 dark:bg-destructive/10 rounded-sm flex items-center justify-center mb-6">
          <FolderTreeIcon className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-black text-foreground">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          We couldn't retrieve the categories. Please check your connection and
          try again.
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 mt-4 transition-colors duration-300">
      <CategoryHeader search={search} onSearchChange={setSearch} />
      <div className="w-full mx-auto px-4 py-8 md:py-16 space-y-16 md:space-y-24">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20 md:py-32 bg-white dark:bg-neutral-900 rounded-sm border-2 border-dashed border-border/60 dark:border-white/10 ">
            <div className="w-20 h-20 bg-primary/5 rounded-sm flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-primary/40" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight px-4">
              No collections match your search
            </h3>
            <p className="text-muted-foreground mt-2 font-medium text-sm md:text-base px-6">
              Try searching for a different keyword or category name.
            </p>
          </div>
        ) : (
          filteredCategories.map((parent, index) => (
            <CategoryGroup key={parent.id} category={parent} index={index} />
          ))
        )}
      </div>
    </section>
  );
}

function FolderTreeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A2 2 0 0 0 14.2 3h-4.4a2 2 0 0 0-1.6.8l-.9 1.2a1 1 0 0 1-.8.4H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h6.6" />
      <rect width="8" height="6" x="12" y="13" rx="1" />
      <path d="M12 19h1a1 1 0 0 1 1 1v1" />
      <path d="M12 8v5" />
    </svg>
  );
}
