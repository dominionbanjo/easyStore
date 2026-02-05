import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategoriesQuery } from "@/services/productDetailsApi";
import { CategoryHeader } from "../components/category/CategoryHeader";
import { CategoryGroup } from "../components/category/CategoryGroup";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useGetCategoriesQuery({
    page: 1,
    limit: 50,
  });

  /* ───────────────── DATA ───────────────── */
  const categories = data?.data ?? [];

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
      <div className="min-h-screen bg-neutral-50/50">
        <div className="bg-white border-b border-border/50">
          <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-8">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-[500px] mx-auto" />
            <Skeleton className="h-16 w-full max-w-xl mx-auto rounded-[2rem]" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-8">
              <Skeleton className="h-12 w-64" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-32 rounded-[2rem]" />
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
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <div className="w-20 h-20 bg-destructive/5 rounded-full flex items-center justify-center mb-6">
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
    <section className="min-h-screen bg-neutral-50/50">
      <CategoryHeader search={search} onSearchChange={setSearch} />

      <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 space-y-24">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-border/50">
            <Search className="h-16 w-16 mx-auto mb-6 text-primary/20" />
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              No collections match your search
            </h3>
            <p className="text-muted-foreground mt-2 font-medium">
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

function FolderTreeIcon(props: any) {
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
