import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Zap, ArrowRight, Search } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { WEBSITE_ROUTES } from "@/routes";
import {
  useGetFeaturedProductsQuery,
  useGetAllProductsQuery,
} from "@/services/productApi";
import ProductGridCard from "@/components/shared/ProductGridCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function DiscoveryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: featuredProducts, isLoading: isFeaturedLoading } =
    useGetFeaturedProductsQuery(
      { limit: 4 },
      { refetchOnMountOrArgChange: true },
    );
  const { data: trendingProducts, isLoading: isTrendingLoading } =
    useGetAllProductsQuery({
      limit: 4,
      sort: "rating",
    } as any);
  const { data: newArrivals, isLoading: isNewArrivalsLoading } =
    useGetAllProductsQuery({
      limit: 4,
      sort: "newest",
    } as any);

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-36 pb-20 px-4 mb-12">
        <div className="absolute top-0 center w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent dark:from-emerald-900/20" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 dark:bg-emerald-500/10 text-primary dark:text-emerald-400 font-bold text-sm mb-8 border border-primary/10 dark:border-emerald-500/20">
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
                className="w-full h-14 pl-6 pr-14 rounded-full bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-white/10 shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:placeholder:text-zinc-600"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-2 h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 mb-24">
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
            <Link
              to={link.href}
              key={link.title}
              className="group relative overflow-hidden h-32 rounded-3xl bg-zinc-50 dark:bg-neutral-900 border border-zinc-200 dark:border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-white dark:hover:bg-neutral-800 transition-colors shadow-sm hover:shadow-md"
            >
              <div
                className={`p-3 rounded-full ${link.color}/10 text-${link.color.split("-")[1]}-500 group-hover:scale-110 transition-transform`}
              >
                <link.icon className="w-6 h-6" />
              </div>
              <span className="font-bold text-foreground">{link.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Featured
          </h2>
          <Link to={WEBSITE_ROUTES.FEATURED}>
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <motion.div
          key={isFeaturedLoading ? "loading" : "loaded"}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {isFeaturedLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[300px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            : featuredProducts?.data?.items?.map((product) => (
                <motion.div key={product.id} variants={item}>
                  <ProductGridCard data={product} />
                </motion.div>
              ))}
        </motion.div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            Trending Now
          </h2>
          <Link to={WEBSITE_ROUTES.TRENDING}>
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <motion.div
          key={isTrendingLoading ? "loading" : "loaded"}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {isTrendingLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[300px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            : trendingProducts?.data?.items?.map((product) => (
                <motion.div key={product.id} variants={item}>
                  <ProductGridCard data={product} />
                </motion.div>
              ))}
        </motion.div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-500" />
            New Arrivals
          </h2>
          <Link to={WEBSITE_ROUTES.NEW_ARRIVALS}>
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <motion.div
          key={isNewArrivalsLoading ? "loading" : "loaded"}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {isNewArrivalsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[300px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            : newArrivals?.data?.items?.map((product) => (
                <motion.div key={product.id} variants={item}>
                  <ProductGridCard data={product} />
                </motion.div>
              ))}
        </motion.div>
      </section>
    </div>
  );
}
