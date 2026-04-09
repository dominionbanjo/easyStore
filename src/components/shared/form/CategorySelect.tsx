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
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { extractErrorMessage } from "@/utils/errorHandler";
import {
  useLazyGetCategoriesQuery,
  useCreateCategoryMutation,
} from "@/services/productDetailsApi";
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
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const error = (errors as any)?.[name]?.message as string | undefined;

  const [loadCategories, { data, isLoading }] = useLazyGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [lastUsed, setLastUsed] = useState<string | null>(null);

  // Quick Add State
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatParentId, setNewCatParentId] = useState<string | null>(null);

  const categories: ICategory[] = data?.data ?? [];

  /* ───────── LOAD ───────── */
  useEffect(() => {
    if (open) {
      loadCategories({});
    }
  }, [open, loadCategories]);

  useEffect(() => {
    setLastUsed(localStorage.getItem(STORAGE_KEY));
  }, []);

  function selectCategory(id: string) {
    setValue(name, id, { shouldValidate: true });
    localStorage.setItem(STORAGE_KEY, id);
    setLastUsed(id);
    setOpen(false);
  }

  /* ───────── HANDLE QUICK ADD ───────── */
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleQuickAdd() {
    if (!newCatName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await createCategory({
        name: newCatName.trim(),
        parent_id: newCatParentId,
      }).unwrap();

      if (res?.data?.id) {
        toast.success("Category created successfully!");
        selectCategory(res.data.id);
        setNewCatName("");
        setNewCatParentId(null);
        setShowQuickAdd(false);
        loadCategories({}); // Refresh list
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to create category"));
    } finally {
      setIsSubmitting(false);
    }
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
    if (!value) return "Select category";
    for (const c of categories) {
      if (c.id === value) return c.name;
      for (const ch of c.children) {
        if (ch.id === value) return `${c.name} / ${ch.name}`;
      }
    }
    return "Selected Category";
  }

  return (
    <div className={cn("flex flex-col gap-1.5 group", className)}>
      {label && (
        <Label
          htmlFor={name}
          className="text-sm font-medium text-foreground group-focus-within:text-primary transition-colors"
        >
          {label}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full h-12 rounded-sm border border-muted-foreground/10 bg-muted/20 px-3 py-[10px] text-[15px]  transition-colors focus:bg-background relative text-left",
                  !field.value && "text-muted-foreground",
                  icon ? "pl-11" : "px-4",
                  error &&
                    "border-destructive focus-visible:ring-destructive/20",
                )}
              >
                {icon && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    {icon}
                  </div>
                )}
                <span className="truncate">
                  {getSelectedLabel(field.value)}
                </span>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-5xl p-0 overflow-hidden sm:rounded-sm border-none  h-full sm:h-[85vh] sm:min-h-[600px] flex flex-col bg-background/95 backdrop-blur-xl">
              {/* Header */}
              <div className="p-5 sm:p-8 pb-4 shrink-0 flex flex-row items-center justify-between">
                <DialogTitle className="text-xl sm:text-3xl font-black uppercase tracking-tighter flex items-center gap-3 sm:gap-4">
                  <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-sm sm:rounded-sm bg-primary   flex items-center justify-center">
                    <FolderTree className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span>Choose Category</span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                      Organize your store products
                    </span>
                  </div>
                </DialogTitle>

                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-sm h-10 w-10 p-0 bg-muted hover:bg-muted-foreground/10 border-none transition-all group"
                  >
                    <X className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Button>
                </DialogClose>
              </div>

              {/* Search & Tabs */}
              <div className="px-8 pb-4 shrink-0 space-y-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search master categories or sub-categories..."
                    className="pl-12 h-12 sm:h-14 rounded-sm sm:rounded-sm bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-bold text-base sm:text-lg placeholder:text-muted-foreground/50 "
                  />
                  {search && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm h-10 w-10 hover:bg-muted"
                      onClick={() => setSearch("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Last Used / Recent */}
                <AnimatePresence>
                  {lastUsedLabel && !search && !showQuickAdd && (
                    <motion.button
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      type="button"
                      onClick={() => selectCategory(lastUsedLabel.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-sm bg-primary/[0.03] hover:bg-primary/[0.08] border border-primary/10 transition-all group"
                    >
                      <div className="h-8 w-8 rounded-sm bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <History className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                          Recently Used
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {lastUsedLabel.label}
                        </span>
                      </div>
                      <Plus className="ml-auto h-4 w-4 text-primary opacity-40 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Main Content Areas */}
              <div className="flex-1 overflow-hidden flex flex-col px-4 sm:px-8 pb-4 sm:pb-8">
                <div className="flex-1 bg-muted/20 rounded-sm sm:rounded-sm border border-border/40 overflow-hidden flex flex-col">
                  {/* Category List */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton
                            key={i}
                            className="h-20 w-full rounded-sm"
                          />
                        ))}
                      </div>
                    ) : filtered.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 h-full">
                        <div className="h-20 w-20 rounded-sm bg-muted/40 flex items-center justify-center">
                          <AlertCircle className="h-10 w-10 text-muted-foreground opacity-30" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-black uppercase tracking-widest text-sm text-foreground/60">
                            No categories found
                          </p>
                          <p className="text-xs font-medium text-muted-foreground max-w-[240px]">
                            We couldn&apos;t find any results for &quot;{search}
                            &quot;. Try a different term or add it below.
                          </p>
                        </div>
                      </div>
                    ) : (
                      filtered.map((cat) => {
                        const isExpanded =
                          expanded === cat.id || search.length > 0;
                        const hasChildren = cat.children.length > 0;
                        const hasSelectedChild = cat.children.some(
                          (ch) => ch.id === field.value,
                        );

                        return (
                          <div key={cat.id} className="group/cat">
                            <button
                              type="button"
                              onClick={() =>
                                setExpanded(isExpanded ? null : cat.id)
                              }
                              className={cn(
                                "w-full flex items-center justify-between p-5 rounded-sm border transition-all duration-300",
                                isExpanded
                                  ? "bg-background border-primary/30  -primary/[0.03]"
                                  : "bg-background/40 border-border group-hover/cat:bg-background group-hover/cat:border-primary/20",
                                hasSelectedChild && "border-primary/40",
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={cn(
                                    "h-10 w-10 rounded-sm flex items-center justify-center transition-all",
                                    isExpanded
                                      ? "bg-primary text-white  "
                                      : "bg-muted text-muted-foreground",
                                  )}
                                >
                                  <Folder className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                  <p className="font-bold text-foreground">
                                    {cat.name}
                                  </p>
                                  <p className="text-[10px] items-center gap-1 font-bold text-muted-foreground/60 uppercase tracking-widest inline-flex pt-0.5">
                                    {cat.children.length} Sub-Categories
                                  </p>
                                </div>
                              </div>
                              <ChevronRight
                                className={cn(
                                  "h-5 w-5 transition-all text-muted-foreground/40",
                                  isExpanded && "rotate-90 text-primary",
                                )}
                              />
                            </button>

                            <AnimatePresence>
                              {isExpanded && hasChildren && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-2 ml-7 pl-6 border-l-2 border-primary/20 flex flex-col gap-2 py-2">
                                    {cat.children.map((ch) => {
                                      const isSelected = field.value === ch.id;
                                      return (
                                        <button
                                          key={ch.id}
                                          type="button"
                                          onClick={() => selectCategory(ch.id)}
                                          className={cn(
                                            "w-full flex items-center gap-3 py-3.5 px-5 rounded-sm transition-all relative group/sub",
                                            isSelected
                                              ? "bg-primary text-white   font-bold"
                                              : "hover:bg-primary/[0.05] text-muted-foreground hover:text-primary",
                                          )}
                                        >
                                          <div
                                            className={cn(
                                              "h-2 w-2 rounded-sm",
                                              isSelected
                                                ? "bg-white"
                                                : "bg-muted-foreground/30 group-hover/sub:bg-primary/50",
                                            )}
                                          />
                                          <span className="text-sm font-semibold">
                                            {ch.name}
                                          </span>
                                          {isSelected && (
                                            <Check className="ml-auto h-4 w-4 stroke-[3]" />
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Quick Add Bar */}
                  <div className="shrink-0 p-6 bg-background/50 border-t border-border/40 backdrop-blur-md">
                    <AnimatePresence mode="wait">
                      {showQuickAdd ? (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="space-y-5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-[0.25em] text-primary">
                              Add Custom Category
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 rounded-sm text-muted-foreground hover:text-foreground"
                              onClick={() => setShowQuickAdd(false)}
                            >
                              Cancel
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">
                                Category Name
                              </label>
                              <Input
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                placeholder="e.g. Vintage Apparel"
                                className="h-12 rounded-sm bg-background border-border"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">
                                Parent (Optional)
                              </label>
                              <select
                                className="w-full h-12 rounded-sm border border-border bg-background px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/10"
                                value={newCatParentId || ""}
                                onChange={(e) =>
                                  setNewCatParentId(e.target.value || null)
                                }
                              >
                                <option value="">None (Top Level)</option>
                                {categories.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <Button
                            type="button"
                            className="w-full h-12 rounded-sm bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs gap-3  "
                            onClick={handleQuickAdd}
                            disabled={isCreating || !newCatName.trim()}
                          >
                            {isCreating ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                            Save Category
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="trigger"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col sm:flex-row items-center justify-between gap-6"
                        >
                          <div className="flex flex-col text-center sm:text-left">
                            <span className="text-xs font-bold text-foreground/80">
                              Don&apos;t see what you need?
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium">
                              Add a custom category to specifically fit your
                              products.
                            </span>
                          </div>
                          <Button
                            type="button"
                            onClick={() => setShowQuickAdd(true)}
                            className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 rounded-sm h-12 px-6 font-black uppercase tracking-widest text-[10px] gap-2  -foreground/5 shrink-0"
                          >
                            <Plus className="h-4 w-4" />
                            Quick Add
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
