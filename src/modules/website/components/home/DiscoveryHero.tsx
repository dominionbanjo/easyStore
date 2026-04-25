import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Zap, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SmartLink from "@/components/shared/SmartLink";
import { WEBSITE_ROUTES } from "@/routes";

export default function DiscoveryHero() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`${WEBSITE_ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="pb-12 bg-transparent relative overflow-hidden transition-colors duration-300">
      {/* Local lighting effect */}
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 pb-12 px-4">
        <div className="absolute top-0 center w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent dark:from-emerald-900/20" />

        <div className="w-full mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/5 dark:bg-emerald-500/10 text-primary dark:text-emerald-400 font-bold text-sm mb-8 border border-primary/10 dark:border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
              <span>Curated Selection</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-foreground">
              Discover <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 dark:from-emerald-400 dark:to-teal-500">
                Something New
              </span>
            </h1>

            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-14 pl-6 pr-14 rounded-sm bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-white/10  text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:placeholder:text-zinc-600"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-2 h-10 w-10 bg-primary rounded-sm flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <div className="w-full mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: "Trending",
              icon: TrendingUp,
              href: WEBSITE_ROUTES.TRENDING,
              color: "bg-orange-500",
            },
            {
              title: "New Arrivals",
              icon: Zap,
              href: WEBSITE_ROUTES.NEW_ARRIVALS,
              color: "bg-blue-500",
            },
            {
              title: "Featured",
              icon: Sparkles,
              href: WEBSITE_ROUTES.FEATURED,
              color: "bg-purple-500",
            },
            {
              title: "Top Stores",
              icon: Sparkles,
              href: WEBSITE_ROUTES.STORES,
              color: "bg-emerald-500",
            },
          ].map((link) => (
            <SmartLink
              to={link.href}
              key={link.title}
              className="group relative overflow-hidden h-32 rounded-sm bg-zinc-50 dark:bg-neutral-900 border border-zinc-200 dark:border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-white dark:hover:bg-neutral-800 transition-colors  hover:"
            >
              <div
                className={`p-3 rounded-sm ${link.color}/10 text-${link.color.split("-")[1]}-500 group-hover:scale-110 transition-transform`}
              >
                <link.icon className="w-6 h-6" />
              </div>
              <span className="font-bold text-foreground">{link.title}</span>
            </SmartLink>
          ))}
        </div>
      </div>
    </div>
  );
}
