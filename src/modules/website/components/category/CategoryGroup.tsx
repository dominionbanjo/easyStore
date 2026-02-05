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
      <div className="flex items-end justify-between border-b-2 border-primary/10 pb-4 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
              <FolderTree className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tight italic">
              {category.name}
            </h2>
          </div>
        </div>

        <Badge className="bg-primary/5 text-primary hover:bg-primary/10 border-0 rounded-full px-4 py-1 font-bold text-sm tracking-wide">
          {category.products_count} COLLECTIONS
        </Badge>
      </div>

      {/* Subcategories Grid */}
      {category.children.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {category.children.map((child) => (
            <motion.div
              key={child.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() =>
                  navigate(`${WEBSITE_ROUTES.CATEGORIES}/${child.slug}`)
                }
                className="group cursor-pointer rounded-[2rem] border-2 border-border/50 bg-white p-6 md:p-8 hover:shadow-2xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                      {child.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
                        {child.products_count} Available
                      </p>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-[2rem] p-8 text-center border-2 border-dashed border-border/50">
          <p className="text-muted-foreground font-medium">
            No subcategories currently available in this collection.
          </p>
        </div>
      )}
    </motion.div>
  );
}
