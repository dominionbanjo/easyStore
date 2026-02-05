import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface CategoryHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function CategoryHeader({
  search,
  onSearchChange,
}: CategoryHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-white border-b border-border/50">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 py-20 md:py-28 relative z-10 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <span className="text-primary font-black uppercase tracking-widest text-sm">
            Organized Collections
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
            Explore <span className="text-primary italic">Every Category</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover thousands of handpicked products organized for your
            convenience. Quickly find exactly what you need.
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-xl mx-auto group"
        >
          <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-full" />
          <div className="relative bg-white border-2 border-border group-focus-within:border-primary/40 rounded-[2rem] shadow-xl group-focus-within:shadow-primary/10 transition-all duration-300">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search categories or subcategories..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-14 h-16 bg-transparent border-0 focus-visible:ring-0 text-lg rounded-[2rem]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
