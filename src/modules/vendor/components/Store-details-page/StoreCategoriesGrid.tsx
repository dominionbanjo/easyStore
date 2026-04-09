import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
  isLoading: boolean;
  onSelect: (category: Category) => void;
};

export function StoreCategoriesGrid({
  categories,
  isLoading,
  onSelect,
}: Props) {
  /* ─── LOADING STATE ─── */
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-sm" />
        ))}
      </div>
    );
  }

  /* ─── EMPTY STATE ─── */
  if (!categories.length) {
    return (
      <div className="text-center py-24 bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl rounded-sm border border-zinc-200 dark:border-white/5 max-w-7xl mx-auto px-4 ">
        <div className="w-20 h-20 bg-primary/10 dark:bg-emerald-500/10 rounded-sm flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5 dark:ring-emerald-500/5">
          <Layers className="w-10 h-10 text-primary dark:text-emerald-400" />
        </div>
        <h3 className="text-2xl font-black text-foreground tracking-tight">
          No Categories Found
        </h3>
        <p className="text-muted-foreground mt-3 max-w-sm mx-auto font-medium text-sm md:text-base leading-relaxed">
          This store hasn't organized their products into categories yet.
        </p>
      </div>
    );
  }

  /* ─── CONTENT ─── */
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto h-full">
      {categories.map((cat, index) => (
        <motion.button
          key={cat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(cat)}
          className="group relative h-32 flex flex-col items-center justify-center p-6 bg-white dark:bg-neutral-900 border border-border/50 dark:border-white/5 rounded-sm  hover: hover:border-primary/20 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-sm" />
          <div className="w-12 h-12 bg-primary/5 dark:bg-emerald-500/10 rounded-sm flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
            <Layers className="w-6 h-6 text-primary dark:text-emerald-400" />
          </div>
          <p className="font-bold text-foreground group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors text-sm text-center line-clamp-1">
            {cat.name}
          </p>
        </motion.button>
      ))}
    </div>
  );
}
