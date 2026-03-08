import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Linkedin,
  Globe,
  ShoppingBag,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 text-foreground selection:bg-primary/20 transition-colors duration-300">
      {/* ──────────────── HERO ──────────────── */}
      <section className="relative overflow-hidden border-b border-border/50 dark:border-white/10 bg-white dark:bg-neutral-900">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="w-full mx-auto px-4 sm:px-6 py-16 md:py-32 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            <Badge
              variant="secondary"
              className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-primary/10 text-primary border-0 mb-2 sm:mb-4"
            >
              Redefining Digital Commerce
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
              The Future of <br className="hidden sm:block" />
              <span className="text-primary italic">Global Marketplaces</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2">
              EasyStore is more than a platform; it's a bridge connecting
              visionary sellers with customers worldwide. We are building the
              infrastructure for a seamless, transparent, and connected digital
              economy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ──────────────── VISION & VALUES ──────────────── */}
      <section className="w-full mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />,
              title: "Commerce for Everyone",
              desc: "Democratizing access to global markets. We empower businesses of all sizes to scale without barriers.",
            },
            {
              icon: <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />,
              title: "Unwavering Trust",
              desc: "Safety and transparency are at our core. We build systems that ensure every transaction is secure and reliable.",
            },
            {
              icon: <Zap className="w-5 h-5 md:w-6 md:h-6" />,
              title: "Driven by Innovation",
              desc: "Leveraging cutting-edge technology to create shopping experiences that are faster, smarter, and more intuitive.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-neutral-900 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-border/50 dark:border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-5 md:mb-6">
                {item.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-xs md:text-sm">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──────────────── LEADERSHIP ──────────────── */}
      <section className="bg-white dark:bg-neutral-900 border-y border-border/50 dark:border-white/10">
        <div className="w-full mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 md:order-1"
            >
              <div className="aspect-square sm:aspect-[4/5] md:aspect-square bg-muted rounded-[2rem] md:rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                {/* Placeholder for an actual CEO image, stylized abstractly for now */}
                <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center text-white">
                  <div className="text-center p-6 md:p-8">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 mx-auto mb-4 md:mb-6 flex items-center justify-center text-2xl md:text-3xl font-black text-primary border-4 border-white/10">
                      DA
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">
                      Dominion Joshua Adebanjo
                    </h3>
                    <p className="text-neutral-400 text-sm md:text-base font-medium tracking-wide mt-2">
                      Founder & CEO
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="hidden sm:block absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />
              <div className="hidden sm:block absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />
            </motion.div>

            <div className="space-y-6 md:space-y-8 order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                  <span className="w-6 sm:w-8 h-[2px] bg-primary"></span>
                  Our Leadership
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  Visionary Leadership
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  "At EasyStore, we aren't just building software; we are
                  cultivating an ecosystem. My goal is to bridge the gap between
                  complex engineering and intuitive human experiences, creating
                  a platform that empowers users to thrive in the digital age."
                </p>
                <div className="pt-2 sm:pt-4">
                  <p className="font-bold text-foreground text-base sm:text-lg">
                    Dominion Joshua Adebanjo
                  </p>
                  <p className="text-primary text-sm sm:text-base font-medium">
                    Founder & CEO
                  </p>
                </div>
              </motion.div>

              <div className="pt-6 sm:pt-8 border-t border-border/50">
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 sm:mb-6">
                  Get in Touch
                </h4>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                  <Button
                    variant="outline"
                    className="rounded-full h-10 sm:h-12 px-4 sm:px-6 gap-2 border-border/50 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-primary transition-colors text-xs sm:text-sm overflow-hidden"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    <a
                      href="mailto:dominionbanjo@gmail.com"
                      className="truncate"
                    >
                      dominionbanjo@gmail.com
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full h-10 sm:h-12 px-4 sm:px-6 gap-2 border-border/50 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-primary transition-colors text-xs sm:text-sm"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <a href="tel:+2347063442580">+234 706 344 2580</a>
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full w-10 sm:w-12 h-10 sm:h-12 hover:bg-primary/10 hover:text-primary"
                      asChild
                    >
                      <a
                        href="https://linkedin.com/in/dominionbanjo"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full w-10 sm:w-12 h-10 sm:h-12 hover:bg-primary/10 hover:text-primary"
                      asChild
                    >
                      <a
                        href="https://dominionbanjo.netlify.app"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── STATISTICS & CTA ──────────────── */}
      <section className="w-full mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="rounded-[2rem] sm:rounded-[3rem] bg-neutral-900 overflow-hidden relative">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.05),transparent)]" />

          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 sm:p-12 md:p-20 space-y-6 sm:space-y-8 relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                Ready to Scale Your Business?
              </h2>
              <p className="text-neutral-400 text-base sm:text-lg max-w-md leading-relaxed">
                Join thousands of merchants who are transforming their digital
                presence with EasyStore's premium infrastructure.
              </p>
              <Button className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full bg-white text-black hover:bg-neutral-200 font-bold text-base sm:text-lg gap-2 group">
                Start Your Journey
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="bg-primary/5 h-full min-h-[350px] md:min-h-[auto] flex items-center justify-center relative p-8 sm:p-12 border-t md:border-t-0 md:border-l border-white/5">
              <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-sm relative z-10">
                {[
                  { label: "Active Users", value: "10K+" },
                  { label: "Transactions", value: "$2M+" },
                  { label: "Countries", value: "15+" },
                  { label: "Uptime", value: "99.9%" },
                ].map((stat, i) => (
                  <Card
                    key={i}
                    className="bg-neutral-800/50 backdrop-blur-sm border-white/5 border text-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl"
                  >
                    <h4 className="text-2xl sm:text-3xl font-black text-white mb-1">
                      {stat.value}
                    </h4>
                    <p className="text-neutral-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </Card>
                ))}
              </div>

              {/* Decorative Gradients */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-primary/20 rounded-full blur-[60px] sm:blur-[80px]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
