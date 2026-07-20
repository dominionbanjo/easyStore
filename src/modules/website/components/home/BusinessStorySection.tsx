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
      "Your products become discoverable to thousands of monthly shoppers on the EazyStore marketplace.",
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
    <section className="pt-12 md:pt-24 pb-12 md:pb-24 px-4 bg-background dark:bg-neutral-950 overflow-hidden transition-colors duration-300">
      <div className="w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text & Story */}
          <div
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
                At EazyStore, we believe every business deserves a professional
                digital presence. We've built the simplest platform for small
                and medium-sized businesses to transition from offline to
                online, removing the barriers of cost and technical complexity.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="p-6 rounded-sm bg-muted/30 dark:bg-neutral-900/50 border border-border/50 dark:border-white/5 hover:border-primary/20 transition-colors group"
                >
                  <div
                    className={`w-12 h-12 rounded-sm ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual Story */}
          <div
            className="relative"
          >
            <div className="aspect-square rounded-sm bg-gradient-to-tr from-primary/20 to-secondary/20 relative flex items-center justify-center p-8">
              <img
                src="/images/progress.png"
                alt="Business Story"
                className="w-full h-full object-cover rounded-sm "
              />

              {/* Overlay Badges */}
              <div className="absolute bottom-6 sm:bottom-12 left-2 sm:left-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-3 sm:p-5 rounded-sm shadow-xl border border-white/20 dark:border-white/5 flex items-center gap-3 sm:gap-5 animate-float group/badge transition-all">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 rounded-sm flex items-center justify-center text-xl sm:text-2xl transform group-hover/badge:scale-110 transition-all duration-500">
                  📦
                </div>
                <div>
                  <p className="text-[8px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5 sm:mb-1">
                    Orders Today
                  </p>
                  <p className="text-lg sm:text-2xl font-black text-foreground tabular-nums tracking-tight">
                    128+
                  </p>
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-emerald-500 w-3 h-3 sm:w-5 sm:h-5 rounded-sm border-2 sm:border-4 border-white dark:border-neutral-900 animate-pulse" />
              </div>

              <div className="absolute top-6 sm:top-12 right-2 sm:right-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-3 sm:p-5 rounded-sm shadow-xl border border-white/20 dark:border-white/5 flex items-center gap-3 sm:gap-5 animate-float-delayed group/badge2 transition-all">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 dark:from-emerald-500/30 dark:to-emerald-500/10 rounded-sm flex items-center justify-center text-xl sm:text-2xl transform group-hover/badge2:scale-110 transition-all duration-500">
                  💰
                </div>
                <div>
                  <p className="text-[8px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5 sm:mb-1">
                    Total Earnings
                  </p>
                  <p className="text-lg sm:text-2xl font-black text-foreground tabular-nums tracking-tight">
                    ₦1.2M
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
