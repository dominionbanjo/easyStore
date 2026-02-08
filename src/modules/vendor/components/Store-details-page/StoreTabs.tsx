import { motion } from "framer-motion";

type Props = {
  activeTab: "products" | "categories";
  onChange: (tab: "products" | "categories") => void;
};

export function StoreTabs({ activeTab, onChange }: Props) {
  return (
    <div className="flex justify-center mt-12">
      <div className="inline-flex p-1.5 bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full shadow-sm transition-colors duration-300">
        <button
          onClick={() => onChange("products")}
          className={`relative px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
            activeTab === "products"
              ? "text-white dark:text-neutral-900"
              : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/5"
          }`}
        >
          {activeTab === "products" && (
            <motion.div
              layoutId="store-tab"
              className="absolute inset-0 bg-primary dark:bg-emerald-400 rounded-full shadow-lg shadow-primary/20 dark:shadow-emerald-500/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">All Products</span>
        </button>

        <button
          onClick={() => onChange("categories")}
          className={`relative px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
            activeTab === "categories"
              ? "text-white dark:text-neutral-900"
              : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/5"
          }`}
        >
          {activeTab === "categories" && (
            <motion.div
              layoutId="store-tab"
              className="absolute inset-0 bg-primary dark:bg-emerald-400 rounded-full shadow-lg shadow-primary/20 dark:shadow-emerald-500/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">Categories</span>
        </button>
      </div>
    </div>
  );
}
