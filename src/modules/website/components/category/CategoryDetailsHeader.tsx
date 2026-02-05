import { motion } from "framer-motion";
import { ArrowLeft, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WEBSITE_ROUTES } from "@/routes";

interface CategoryDetailsHeaderProps {
  name: string;
  count: number;
}

export function CategoryDetailsHeader({
  name,
  count,
}: CategoryDetailsHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-white border-b border-border/50">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(WEBSITE_ROUTES.CATEGORIES)}
          className="group flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Collections
        </motion.button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
              <Tag className="w-3.5 h-3.5" />
              Category Collection
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight capitalize italic">
              {name.replace(/-/g, " ")}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
              Discover our handpicked selection of top-quality items in{" "}
              <span className="text-foreground font-bold">
                {name.replace(/-/g, " ")}
              </span>
              .
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0"
          >
            <div className="bg-primary/5 backdrop-blur-md border border-primary/10 rounded-[2rem] px-8 py-6 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-primary leading-none">
                {count}
              </span>
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest mt-1">
                Found Products
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
