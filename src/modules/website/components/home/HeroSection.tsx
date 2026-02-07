import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SocialProofBadge from "./SocialProofBadge";

// Hero main fade-in animation
const transitionVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 1.4,
    },
  },
};

export function HeroTitle() {
  return (
    <>
      Transform Your Business with a
      <br />
      <span className="relative inline-block mt-2">
        <span className="relative z-10 text-primary">
          Professional{" "}
          <span className="text-[#17c06e] font-bold underline decoration-dotted underline-offset-8">
            Online Storefront
          </span>
        </span>
      </span>
    </>
  );
}

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden py-12 sm:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* LEFT SIDE */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            {/* Catchy TAG */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Empowering 40,000+ Nigerian Businesses
            </motion.div>

            <motion.h1
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-balance leading-[1.1]"
            >
              <HeroTitle />
            </motion.h1>

            <motion.p
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl leading-relaxed text-muted-foreground"
            >
              EasyStore gives you everything you need to sell online. Create
              your professional storefront in minutes, showcase your products to
              millions, and manage your entire business from one simple
              dashboard.
            </motion.p>

            <motion.div
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row items-center lg:items-start gap-6"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground rounded-xl h-14 px-10 text-lg font-semibold hover:scale-[1.05] active:scale-95 transition-all shadow-lg hover:shadow-primary/20"
              >
                Start Selling Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <SocialProofBadge
                users={[
                  { src: "/images/fash4.png", alt: "@user1", fallback: "U1" },
                  { src: "/images/fash0.png", alt: "@user2", fallback: "U2" },
                  { src: "/images/fash1.png", alt: "@user3", fallback: "U3" },
                ]}
                rating={4.9}
                totalUsers={100}
                maxAvatars={3}
              />
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <motion.div
            variants={transitionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="flex-1 w-full max-w-2xl"
          >
            <div className="relative group p-2 bg-white rounded-[2.5rem] shadow-2xl border border-border/50 overflow-hidden transform hover:-rotate-1 transition-transform duration-700">
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-muted">
                <video
                  className="w-full h-full object-cover"
                  src="/videos/campaign5.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />

                {/* Floating Elements for "Story" feel */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      New Sale
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      ₦45,000 received
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
