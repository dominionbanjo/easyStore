import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Zap, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SmartLink from "@/components/shared/SmartLink";
import { WEBSITE_ROUTES } from "@/routes";
import {
  useGetFeaturedProductsQuery,
  useGetAllProductsQuery,
} from "@/services/productApi";
import ProductGridCard from "@/components/shared/ProductGridCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutGrid } from "lucide-react";
import { Modal } from "@/components/shared/Modal";

export default function DiscoveryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);

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
      <section className="relative overflow-hidden pt-0 md:pt-8 pb-8 md:pb-16 px-4 mb-8">
        <div className="absolute top-0 center w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent dark:from-emerald-900/20" />

        <div className="w-full mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/5 dark:bg-emerald-500/10 text-primary dark:text-emerald-400 font-bold text-sm mb-8 border border-primary/10 dark:border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
              <span>Curated Selection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter mb-8 text-foreground leading-[0.9]">
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

      {/* Quick Navigation Trigger */}
      <div className="w-full mx-auto px-4 mb-20 flex justify-center">
        <div className="relative group max-w-sm w-full">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-emerald-500/50 rounded-sm blur opacity-25 group-hover:opacity-50 transition duration-300" />
          <Button
            variant="outline"
            onClick={() => setIsDiscoveryOpen(true)}
            className="relative w-full h-16 px-6 bg-white dark:bg-neutral-900 border-zinc-200 dark:border-white/10 rounded-sm flex items-center justify-between group hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="p-2.5 rounded-sm bg-primary/10 text-primary">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
                  Explore Path
                </div>
                <div className="text-xl font-black text-foreground">
                  Choose Discovery
                </div>
              </div>
            </div>
            <div className="p-1 rounded-sm bg-zinc-100 dark:bg-neutral-800 text-muted-foreground group-hover:text-primary transition-colors">
              <ArrowRight className="w-5 h-5 rotate-90" />
            </div>
          </Button>

          <Modal
            open={isDiscoveryOpen}
            onOpenChange={setIsDiscoveryOpen}
            title="Choose Discovery Path"
            description="Select your preferred way to explore our collections."
            className="sm:max-w-md p-0"
          >
            <div className="p-2 space-y-1">
              {[
                {
                  title: "Trending",
                  subtext: "Popular items this week",
                  icon: TrendingUp,
                  href: WEBSITE_ROUTES.TRENDING,
                  color: "text-orange-500 bg-orange-500/10",
                },
                {
                  title: "New Arrivals",
                  subtext: "Freshly added products",
                  icon: Zap,
                  href: WEBSITE_ROUTES.NEW_ARRIVALS,
                  color: "text-blue-500 bg-blue-500/10",
                },
                {
                  title: "Featured",
                  subtext: "Editor's top picks",
                  icon: Sparkles,
                  href: WEBSITE_ROUTES.FEATURED,
                  color: "text-purple-500 bg-purple-500/10",
                },
                {
                  title: "Top Stores",
                  subtext: "Best sellers in Nigeria",
                  icon: Sparkles,
                  href: WEBSITE_ROUTES.STORES,
                  color: "text-emerald-500 bg-emerald-500/10",
                },
              ].map((link) => (
                <button
                  key={link.title}
                  onClick={() => {
                    navigate(link.href);
                    setIsDiscoveryOpen(false);
                  }}
                  className="w-full p-4 rounded-sm flex items-center gap-4 cursor-pointer hover:bg-primary/5 transition-all group text-left border border-transparent hover:border-primary/20"
                >
                  <div className={cn("p-3 rounded-sm scale-110 transition-transform group-hover:scale-125", link.color)}>
                    <link.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-lg group-hover:text-primary transition-colors tracking-tight">
                      {link.title}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {link.subtext}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                </button>
              ))}
            </div>
          </Modal>
        </div>
      </div>

      {/* Featured Section */}
      <section className="w-full mx-auto px-4 mb-16 md:mb-24">
        <div className="flex flex-col px-1 gap-3 mb-8">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            Featured
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            Our top handpicked premium selections across all categories, updated
            daily.
          </p>
          <SmartLink to={WEBSITE_ROUTES.FEATURED}>
            <Button
              variant="ghost"
              className="p-0 h-auto gap-1 text-primary hover:text-primary font-bold hover:bg-transparent"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </SmartLink>
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
                  <Skeleton className="h-[300px] w-full rounded-sm" />
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
      <section className="w-full mx-auto px-4 mb-16 md:mb-24">
        <div className="flex flex-col px-1 gap-3 mb-8">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            Trending Now
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            See what everyone is talking about. These are the most popular
            products right now.
          </p>
          <SmartLink to={WEBSITE_ROUTES.TRENDING}>
            <Button
              variant="ghost"
              className="p-0 h-auto gap-1 text-primary hover:text-primary font-bold hover:bg-transparent"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </SmartLink>
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
                  <Skeleton className="h-[300px] w-full rounded-sm" />
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
      <section className="w-full mx-auto px-4 mb-16 md:mb-24">
        <div className="flex flex-col px-1 gap-3 mb-8">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            New Arrivals
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            Fresh from our vendors. Be the first to discover and own the latest
            additions.
          </p>
          <SmartLink to={WEBSITE_ROUTES.NEW_ARRIVALS}>
            <Button
              variant="ghost"
              className="p-0 h-auto gap-1 text-primary hover:text-primary font-bold hover:bg-transparent"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </SmartLink>
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
                  <Skeleton className="h-[300px] w-full rounded-sm" />
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
