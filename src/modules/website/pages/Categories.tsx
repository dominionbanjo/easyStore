import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, FolderTree, ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useGetCategoriesQuery } from "@/services/productDetailsApi";
import { USER_ROUTES } from "@/routes/temp";

/* ───────────────── COMPONENT ───────────────── */

export default function CategoriesPage() {
  const navigate = useNavigate();
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

  /* ───────────────── STATES ───────────────── */

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-5">
            <Skeleton className="h-7 w-72" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-24 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-24 text-center text-muted-foreground">
        Failed to load categories.
      </section>
    );
  }

  /* ───────────────── RENDER ───────────────── */

  return (
    <section className="min-h-screen bg-muted/30">
      {/* ─── HEADER ─── */}
      <div className="border-b bg-background">
        <div className="max-w-4xl mx-auto px-4 py-14 space-y-6 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Shop by Category
          </h1>
          <p className="text-muted-foreground">
            Explore our product categories and quickly find what you’re looking
            for.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories or subcategories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11"
            />
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No categories match your search.</p>
          </div>
        ) : (
          filteredCategories.map((parent, index) => (
            <motion.section
              key={parent.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-6"
            >
              {/* Parent Category Header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <FolderTree className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-foreground">
                    {parent.name}
                  </h2>
                </div>

                <Badge variant="secondary">
                  {parent.products_count} products
                </Badge>
              </div>

              {/* Subcategories */}
              {parent.children.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {parent.children.map((child) => (
                    <Card
                      key={child.id}
                      onClick={() =>
                        navigate(`${USER_ROUTES.CATEGORIES}/${child.slug}`)
                      }
                      className="group cursor-pointer rounded-xl border bg-background p-5 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            {child.name}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {child.products_count} products
                          </p>
                        </div>

                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground pl-9">
                  No subcategories available.
                </p>
              )}
            </motion.section>
          ))
        )}
      </div>
    </section>
  );
}
