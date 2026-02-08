import { motion } from "framer-motion";
import { Store, Upload, Megaphone, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Store,
    title: "Create Your Store",
    description:
      "Register your business and get a customized storefront that represents your brand perfectly.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Upload,
    title: "Showcase Products",
    description:
      "Upload your inventory with high-quality images and detailed descriptions to attract customers.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Megaphone,
    title: "Reach Millions",
    description:
      "Your products become discoverable to thousands of monthly shoppers on the EasyStore marketplace.",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    icon: TrendingUp,
    title: "Scale & Grow",
    description:
      "Manage orders, track analytics, and grow your business with our powerful vendor tools.",
    color: "bg-emerald-500/10 text-emerald-500",
  },
];

export default function BusinessStorySection() {
  return (
    <section className="py-24 px-4 bg-background dark:bg-neutral-950 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text & Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                Our Mission
              </h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                Empowering the Next Generation of{" "}
                <span className="text-primary italic">
                  African Entrepreneurs
                </span>
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At EasyStore, we believe every business deserves a professional
                digital presence. We've built the simplest platform for small
                and medium-sized businesses to transition from offline to
                online, removing the barriers of cost and technical complexity.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-muted/30 dark:bg-neutral-900/50 border border-border/50 dark:border-white/5 hover:border-primary/20 transition-colors group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual Story */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] bg-gradient-to-tr from-primary/20 to-secondary/20 relative overflow-hidden flex items-center justify-center p-8">
              <img
                src="/images/progress.png"
                alt="Business Story"
                className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl"
              />

              {/* Overlay Badges */}
              <div className="absolute bottom-12 -left-6 sm:-left-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/5 flex items-center gap-5 animate-float group/badge">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner transform group-hover/badge:scale-110 transition-all duration-500">
                  📦
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    Orders Today
                  </p>
                  <p className="text-2xl font-black text-foreground tabular-nums tracking-tight">
                    128+
                  </p>
                </div>
                <div className="absolute -top-2 -right-2 bg-emerald-500 w-5 h-5 rounded-full border-4 border-white dark:border-neutral-900 animate-pulse" />
              </div>

              <div className="absolute top-12 -right-6 sm:-right-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/5 flex items-center gap-5 animate-float-delayed group/badge2">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 dark:from-emerald-500/30 dark:to-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner transform group-hover/badge2:scale-110 transition-all duration-500">
                  💰
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-black text-foreground tabular-nums tracking-tight">
                    ₦1.2M
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
