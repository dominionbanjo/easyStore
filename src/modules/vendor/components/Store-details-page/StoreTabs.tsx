import { motion } from "framer-motion";

type Props = {
  activeTab: "products" | "categories";
  onChange: (tab: "products" | "categories") => void;
};

export function StoreTabs({ activeTab, onChange }: Props) {
  return (
    <div className="flex justify-center mt-12">
      <div className="inline-flex p-1.5 bg-white/50 backdrop-blur-md border border-border/50 rounded-full shadow-sm">
        <button
          onClick={() => onChange("products")}
          className={`relative px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
            activeTab === "products"
              ? "text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {activeTab === "products" && (
            <motion.div
              layoutId="store-tab"
              className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">All Products</span>
        </button>

        <button
          onClick={() => onChange("categories")}
          className={`relative px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
            activeTab === "categories"
              ? "text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {activeTab === "categories" && (
            <motion.div
              layoutId="store-tab"
              className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">Categories</span>
        </button>
      </div>
    </div>
  );
}
