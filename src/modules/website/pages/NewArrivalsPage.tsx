import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useGetAllProductsQuery } from "@/services/productApi";
import ProductGridCard from "@/components/shared/ProductGridCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewArrivalsPage() {
  const { data: products, isLoading } = useGetAllProductsQuery({
    sort: "newest",
    limit: 12,
  } as any);

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
        <div className="absolute top-0 center w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent dark:from-blue-900/10" />

        <div className="max-w-7xl mx-auto text-center relative z-10 transition-colors">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 font-bold text-sm mb-8 border border-blue-500/20">
            <Zap className="w-4 h-4" />
            <span>Just Landed</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-foreground">
            Fresh <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
              Drops
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Be the first to cop the latest gear. Updated daily with the hottest
            new products.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-3xl" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products?.data?.items?.map((product) => (
              <motion.div key={product.id} variants={item}>
                <ProductGridCard data={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
