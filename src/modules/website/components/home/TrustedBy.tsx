import { motion } from "framer-motion";

const brands = [
  { name: "Urban Threads", icon: "👕" },
  { name: "Luxe Essentials", icon: "✨" },
  { name: "FreshMart", icon: "🍎" },
  { name: "Glow Beauty", icon: "💄" },
  { name: "Style Hub", icon: "🕶️" },
  { name: "Nova Wear", icon: "👟" },
];

export default function FeaturedBrands() {
  return (
    <section className="py-16 bg-muted/30 dark:bg-neutral-900/50 border-y border-border/50 transition-colors duration-300">
      <div className="w-full mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-foreground">
            Powering 40,000+ Stores & Growing Brands
          </h3>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            From fashion and beauty to food and lifestyle, these businesses
            trust EazyStore to scale their digital presence.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 px-6 py-3 bg-card dark:bg-neutral-900 border border-border/60 dark:border-white/5 rounded-sm  hover: hover:border-primary/30 transition-all group"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform">
                {brand.icon}
              </span>
              <span className="font-semibold text-foreground/80 group-hover:text-primary transition-colors italic">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
