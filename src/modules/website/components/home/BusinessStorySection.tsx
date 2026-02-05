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
    <section className="py-24 px-4 bg-background overflow-hidden">
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
                  className="p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors group"
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
              <div className="absolute bottom-12 -left-4 bg-white p-4 rounded-2xl shadow-2xl border border-border flex items-center gap-4 animate-float">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  📦
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground">
                    Orders Today
                  </p>
                  <p className="text-xl font-black text-foreground">128+</p>
                </div>
              </div>

              <div className="absolute top-12 -right-4 bg-white p-4 rounded-2xl shadow-2xl border border-border flex items-center gap-4 animate-float-delayed">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                  💰
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground">
                    Earnings
                  </p>
                  <p className="text-xl font-black text-foreground">₦1.2M</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
