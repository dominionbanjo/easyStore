import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderTree,
  Search,
  Check,
  History,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

import { useLazyGetCategoriesQuery } from "@/services/productDetailsApi";
import type { ICategory } from "@/types/category/categoryTypes";

const STORAGE_KEY = "last_selected_category";

interface CategorySelectProps {
  name: string;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function CategorySelect({
  name,
  label = "Category",
  className,
  icon,
}: CategorySelectProps) {
  const { control, setValue } = useFormContext();

  const [loadCategories, { data, isLoading }] = useLazyGetCategoriesQuery();

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [lastUsed, setLastUsed] = useState<string | null>(null);

  const categories: ICategory[] = data?.data ?? [];

  /* ───────── LOAD ───────── */
  useEffect(() => {
    loadCategories({});
    setLastUsed(localStorage.getItem(STORAGE_KEY));
  }, [loadCategories]);

  function selectCategory(id: string) {
    setValue(name, id, { shouldValidate: true });
    localStorage.setItem(STORAGE_KEY, id);
    setLastUsed(id);
    setOpen(false);
  }

  /* ───────── FIND LAST USED CATEGORY ───────── */
  const lastUsedLabel = useMemo(() => {
    if (!lastUsed) return null;

    for (const c of categories) {
      if (c.id === lastUsed) {
        return { id: c.id, label: c.name };
      }
      for (const ch of c.children) {
        if (ch.id === lastUsed) {
          return {
            id: ch.id,
            label: `${c.name} / ${ch.name}`,
          };
        }
      }
    }
    return null;
  }, [categories, lastUsed]);

  /* ───────── FILTER ───────── */
  const filtered = useMemo(() => {
    if (!search) return categories;

    const q = search.toLowerCase();

    return categories
      .map((c) => {
        const childMatches = c.children.filter((ch) =>
          ch.name.toLowerCase().includes(q),
        );

        if (c.name.toLowerCase().includes(q) || childMatches.length) {
          return { ...c, children: childMatches };
        }

        return null;
      })
      .filter(Boolean) as ICategory[];
  }, [categories, search]);

  function getSelectedLabel(value?: string) {
    for (const c of categories) {
      if (c.id === value) return c.name;
      for (const ch of c.children) {
        if (ch.id === value) return `${c.name} / ${ch.name}`;
      }
    }
    return "Select category";
  }

  return (
    <div className={cn("space-y-1.5 relative", className)}>
      <Label className="font-medium text-[15px]">{label}</Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            {/* Trigger */}
            <div className="relative group">
              {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  {icon}
                </div>
              )}
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={cn(
                  "w-full h-12 rounded-xl border px-3 flex items-center justify-between text-left text-[15px] transition-all duration-200 bg-muted/20 border-muted-foreground/10 focus:bg-background",
                  icon ? "pl-11" : "px-4",
                  !field.value && "text-muted-foreground",
                )}
              >
                <span className="truncate">
                  {getSelectedLabel(field.value)}
                </span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </button>
            </div>

            {/* Dropdown */}
            {open && (
              <div className="absolute z-50 mt-2 w-full rounded-lg border bg-background shadow-lg overflow-hidden">
                {/* Search */}
                <div className="p-2 border-b space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search categories..."
                      className="pl-8 h-9"
                    />
                  </div>

                  {/* Last Used */}
                  {lastUsedLabel && !search && (
                    <button
                      type="button"
                      onClick={() => selectCategory(lastUsedLabel.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 hover:bg-muted text-sm"
                    >
                      <History className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{lastUsedLabel.label}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        Last used
                      </span>
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="max-h-72 overflow-y-auto custom-scrollbar">
                  {isLoading && (
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  )}

                  {!isLoading && filtered.length === 0 && (
                    <p className="p-4 text-sm text-muted-foreground">
                      No categories found
                    </p>
                  )}

                  {!isLoading &&
                    filtered.map((cat) => {
                      const isOpen = expanded === cat.id;
                      const hasChildren = cat.children.length > 0;

                      return (
                        <div key={cat.id}>
                          {/* Parent */}
                          <button
                            type="button"
                            onClick={() =>
                              hasChildren
                                ? setExpanded(isOpen ? null : cat.id)
                                : selectCategory(cat.id)
                            }
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-2 hover:bg-muted",
                              field.value === cat.id &&
                                "bg-primary/10 text-primary",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Folder className="h-4 w-4" />
                              <span>{cat.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {field.value === cat.id && (
                                <Check className="h-4 w-4" />
                              )}
                              {hasChildren && (
                                <ChevronRight
                                  className={cn(
                                    "h-4 w-4 transition-transform",
                                    isOpen && "rotate-90",
                                  )}
                                />
                              )}
                            </div>
                          </button>

                          {/* Children */}
                          {isOpen &&
                            cat.children.map((ch) => (
                              <button
                                key={ch.id}
                                type="button"
                                onClick={() => selectCategory(ch.id)}
                                className={cn(
                                  "w-full flex items-center gap-2 px-8 py-2 text-sm hover:bg-muted",
                                  field.value === ch.id &&
                                    "bg-primary/15 text-primary",
                                )}
                              >
                                <FolderTree className="h-4 w-4" />
                                <span>{ch.name}</span>
                                {field.value === ch.id && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </button>
                            ))}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </>
        )}
      />
    </div>
  );
}
