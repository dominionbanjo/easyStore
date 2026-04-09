import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function HelpHeader() {
  return (
    <div className="relative overflow-hidden rounded-sm bg-emerald-600 dark:bg-emerald-950 p-8 md:p-16 text-center  -emerald-500/20">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-sm blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white rounded-sm blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 space-y-6 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-sm text-white/90 text-xs font-black uppercase tracking-widest border border-white/20">
          <Sparkles className="w-3.5 h-3.5" />
          EazyStore Solution Center
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          How can we help you <br /> grow today?
        </h1>

        <p className="text-emerald-50/70 text-sm md:text-base font-medium">
          Search our knowledge base for instant answers or explore our
          specialized vendor resources.
        </p>

        <div className="relative group max-w-xl mx-auto pt-4">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600 transition-colors group-hover:text-emerald-500" />
          <Input
            placeholder="Search for articles, guides, or keywords..."
            className="h-14 pl-14 pr-6 rounded-sm border-none bg-white text-emerald-950 placeholder:text-emerald-950/40  focus-visible:ring-4 focus-visible:ring-white/20 transition-all font-medium"
          />
        </div>
      </motion.div>
    </div>
  );
}
