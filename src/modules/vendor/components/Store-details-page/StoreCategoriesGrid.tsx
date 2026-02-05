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
          <Skeleton key={i} className="h-32 rounded-[2rem]" />
        ))}
      </div>
    );
  }

  /* ─── EMPTY STATE ─── */
  if (!categories.length) {
    return (
      <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-border/50 max-w-7xl mx-auto px-4">
        <Layers className="w-12 h-12 text-primary/20 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground">
          No Categories Found
        </h3>
        <p className="text-muted-foreground mt-2">
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
          className="group relative h-32 flex flex-col items-center justify-center p-6 bg-white border border-border/50 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
          <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
            <Layers className="w-6 h-6 text-primary" />
          </div>
          <p className="font-bold text-foreground group-hover:text-primary transition-colors text-sm text-center line-clamp-1">
            {cat.name}
          </p>
        </motion.button>
      ))}
    </div>
  );
}
