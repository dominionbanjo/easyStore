import { motion } from "framer-motion";
import { FolderTree, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WEBSITE_ROUTES } from "@/routes";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  products_count: number;
}

interface CategoryGroupProps {
  category: {
    id: string;
    name: string;
    products_count: number;
    children: SubCategory[];
  };
  index: number;
}

export function CategoryGroup({ category, index }: CategoryGroupProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      {/* Parent Category Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-primary/10 pb-6 mb-8 gap-4 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
            <FolderTree className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            {category.name}
          </h2>
        </div>

        <Badge className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/10 rounded-lg px-3 py-1.5 font-bold text-[10px] md:text-xs tracking-widest uppercase w-fit">
          {category.products_count} Collections Available
        </Badge>
      </div>

      {/* Subcategories Grid */}
      {category.children.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {category.children.map((child) => (
            <motion.div
              key={child.id}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Card
                onClick={() =>
                  navigate(`${WEBSITE_ROUTES.CATEGORIES}/${child.slug}`)
                }
                className="group h-full cursor-pointer rounded-3xl border border-neutral-200/60 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 md:p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-primary/30 transition-all duration-500 relative overflow-hidden"
              >
                {/* Hover decorative element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-[3] transition-transform duration-700 blur-2xl" />

                <div className="flex flex-col h-full justify-between relative z-10">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-white/5 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <ChevronRight className="h-5 w-5 text-neutral-400 dark:text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>

                    <h3 className="text-lg md:text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                      {child.name}
                    </h3>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
                    <p className="text-[10px] md:text-xs text-neutral-400 dark:text-neutral-500 font-black uppercase tracking-widest">
                      {child.products_count} Products
                    </p>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-neutral-100/50 dark:bg-neutral-900/50 rounded-3xl p-12 text-center border-2 border-dashed border-neutral-200 dark:border-white/10">
          <p className="text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest text-xs">
            No subcategories currently available.
          </p>
        </div>
      )}
    </motion.div>
  );
}
