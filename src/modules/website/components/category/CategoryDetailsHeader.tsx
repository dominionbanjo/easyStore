import { motion } from "framer-motion";
import { ArrowLeft, Tag } from "lucide-react";
import SmartLink from "@/components/shared/SmartLink";
import { WEBSITE_ROUTES } from "@/routes";

interface CategoryDetailsHeaderProps {
  name: string;
  count: number;
}

export function CategoryDetailsHeader({
  name,
  count,
}: CategoryDetailsHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-neutral-950 border-b border-zinc-200 dark:border-white/10 transition-colors duration-300">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/5 dark:bg-emerald-500/10 rounded-sm blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-72 h-72 bg-primary/5 dark:bg-emerald-500/10 rounded-sm blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
        <SmartLink to={WEBSITE_ROUTES.CATEGORIES} className="block mb-12">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Collections
          </motion.div>
        </SmartLink>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-primary dark:text-emerald-400 font-black uppercase tracking-[0.2em] text-xs">
              <Tag className="w-3.5 h-3.5" />
              Category Collection
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter leading-none capitalize italic">
              {name.replace(/-/g, " ")}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
              Discover our handpicked selection of top-quality items in{" "}
              <span className="text-foreground font-black border-b-2 border-primary/20 dark:border-emerald-500/20 pb-0.5">
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
            <div className="bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl border border-zinc-200 dark:border-emerald-500/20 rounded-sm px-10 py-8 flex flex-col items-center justify-center   dark:-emerald-500/5 group hover:scale-105 transition-transform duration-500">
              <span className="text-5xl font-black text-primary dark:text-emerald-400 leading-none mb-2 tabular-nums">
                {count}
              </span>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">
                Found
                <br />
                Products
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
