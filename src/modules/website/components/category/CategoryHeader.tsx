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
    <div className="relative overflow-hidden bg-neutral-900 border-b border-white/5">
      {/* Dynamic background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping" />
      <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:1s]" />

      <div className="max-w-4xl mx-auto px-4 py-24 md:py-36 relative z-10 text-center space-y-10 md:space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">
              Organized Collections
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Explore{" "}
            <span className="text-primary italic relative">
              Every Category
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-primary/30"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="text-neutral-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Discover thousands of handpicked products organized for your
            convenience.{" "}
            <span className="text-neutral-200">
              Quickly find exactly what you need
            </span>{" "}
            in our curated ecosystem.
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative max-w-xl mx-auto group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-emerald-500/50 blur opacity-25 group-focus-within:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-neutral-800/80 backdrop-blur-xl border border-white/10 group-focus-within:border-primary/50 rounded-2xl shadow-2xl transition-all duration-300">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search categories or subcategories..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-14 h-14 md:h-16 bg-transparent border-0 focus-visible:ring-0 text-white text-base md:text-lg rounded-2xl placeholder:text-neutral-500"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
