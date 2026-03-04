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
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

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
        const parentMatches = c.name.toLowerCase().includes(q);
        const childMatches = c.children.filter((ch) =>
          ch.name.toLowerCase().includes(q),
        );

        if (parentMatches || childMatches.length) {
          // If parent matches, show all its children so they can be selected.
          // If only children match, only show matching children.
          return {
            ...c,
            children: parentMatches ? c.children : childMatches,
          };
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div className="relative group cursor-pointer">
                {icon && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    {icon}
                  </div>
                )}
                <button
                  type="button"
                  className={cn(
                    "w-full h-12 rounded-xl border px-3 flex items-center justify-between text-left text-[15px] transition-all duration-200 bg-muted/20 border-muted-foreground/10 hover:border-primary/30",
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
            </DialogTrigger>

            <DialogContent
              showCloseButton={false}
              className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl h-[85vh] min-h-[600px] flex flex-col"
            >
              <DialogHeader className="p-8 pb-4 shrink-0 flex flex-row items-center justify-between space-y-0">
                <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <FolderTree className="h-5 w-5 text-primary" />
                  </div>
                  Choose Category
                </DialogTitle>

                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl h-9 px-4 font-black uppercase tracking-widest text-[10px] bg-muted/30 hover:bg-muted/50 border border-muted-foreground/10 flex items-center gap-2 group transition-all"
                  >
                    <X className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    Close
                  </Button>
                </DialogClose>
              </DialogHeader>

              <div className="px-8 pb-3 shrink-0">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search categories..."
                    className="pl-11 h-12 rounded-2xl bg-muted/20 border-muted-foreground/10 focus-visible:ring-primary/20 transition-all font-medium"
                  />
                </div>

                {lastUsedLabel && !search && (
                  <button
                    type="button"
                    onClick={() => selectCategory(lastUsedLabel.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 mt-3 rounded-2xl bg-primary/5 hover:bg-primary/10 border border-primary/10 text-sm transition-all"
                  >
                    <History className="h-4 w-4 text-primary" />
                    <span className="truncate font-bold uppercase tracking-widest text-[10px]">
                      {lastUsedLabel.label}
                    </span>
                    <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-primary opacity-60">
                      Recent
                    </span>
                  </button>
                )}
              </div>

              <div className="px-8 flex-1 overflow-y-auto custom-scrollbar min-h-0 py-4">
                {isLoading && (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full rounded-2xl" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                  </div>
                )}

                {!isLoading && filtered.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      No categories found
                    </p>
                  </div>
                )}

                {!isLoading &&
                  filtered.map((cat) => {
                    const isOpen = expanded === cat.id || search.length > 0;
                    const hasChildren = cat.children.length > 0;
                    const hasSelectedChild = cat.children.some(
                      (ch) => ch.id === field.value,
                    );

                    return (
                      <div key={cat.id} className="mb-2">
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : cat.id)}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                            hasSelectedChild
                              ? "bg-primary/5 border-primary/40 shadow-sm"
                              : "bg-muted/5 border-muted-foreground/10 hover:border-primary/30",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "h-8 w-8 rounded-xl flex items-center justify-center transition-colors",
                                hasSelectedChild
                                  ? "bg-primary/20"
                                  : "bg-muted/20",
                              )}
                            >
                              <Folder
                                className={cn(
                                  "h-4 w-4",
                                  hasSelectedChild
                                    ? "text-primary"
                                    : "text-muted-foreground",
                                )}
                              />
                            </div>
                            <span
                              className={cn(
                                "text-sm font-bold",
                                hasSelectedChild
                                  ? "text-primary uppercase tracking-tight"
                                  : "text-foreground",
                              )}
                            >
                              {cat.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {hasSelectedChild && (
                              <Check className="h-4 w-4 text-primary opacity-40" />
                            )}
                            {hasChildren && (
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 transition-transform opacity-40",
                                  isOpen && "rotate-90",
                                )}
                              />
                            )}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="mt-2 ml-4 pl-4 border-l-2 border-primary/10 flex flex-col gap-2">
                            {cat.children.map((ch) => {
                              const isChildSelected = field.value === ch.id;
                              return (
                                <button
                                  key={ch.id}
                                  type="button"
                                  onClick={() => selectCategory(ch.id)}
                                  className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                                    isChildSelected
                                      ? "bg-primary/5 text-primary font-bold"
                                      : "hover:bg-muted text-muted-foreground",
                                  )}
                                >
                                  <FolderTree className="h-3.5 w-3.5 opacity-40" />
                                  <span className="text-sm">{ch.name}</span>
                                  {isChildSelected && (
                                    <Check className="ml-auto h-3.5 w-3.5 stroke-[3]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              <div className="p-8 border-t border-border/40 shrink-0 flex justify-end">
                <Button
                  variant="outline"
                  className="rounded-xl px-8 font-black uppercase tracking-widest text-xs h-11"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      />
    </div>
  );
}
