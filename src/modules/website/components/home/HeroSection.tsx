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
  // 
  return (
    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-medium tracking-tight text-balance leading-[1.2]">
      Scale Your Small Business
      <br />
      <span className="relative inline-block">

        <span className="relative z-10 text-black">With a <span className="text-[#17c06e] font-bold">Big Brand</span> Experience.</span>

      </span>
    </h1>
  );
}

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden pb-10 sm:pb-20 px-4">
      <div className="flex justify-center w-full">
        <div className="w-full flex flex-col items-center lg:flex-row lg:items-center lg:justify-between gap-12">

          {/* LEFT SIDE */}
          <div className="flex-1 text-center lg:text-left">
            {/* Catchy TAG */}
            <motion.p
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              className="italic text-[#367e5c]">
              # Nigeria's easiest marketplace for discovering everyday essentials.
            </motion.p>

            <motion.h1
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-balance leading-tight"
            >

              <HeroTitle />
            </motion.h1>

            <motion.p
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl leading-relaxed text-foreground"
            >

              Create a beautiful portfolio to showcase your products, gain trust instantly, and make it easier for customers to shop fast, reliable, and stress-free

            </motion.p>

            <motion.div
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-col items-center lg:items-start gap-4"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground rounded-full px-8 py-7 hover:bg-[#17c06e]/90 transition-transform hover:scale-[1.03]"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <SocialProofBadge
                users={[
                  { src: "/images/fash4.png", alt: "@shadcn", fallback: "CN" },
                  { src: "/images/fash0.png", alt: "@maxleiter", fallback: "ML" },
                  { src: "/images/fash1.png", alt: "@evilrabbit", fallback: "ER" },
                ]}
                rating={4.9}
                totalUsers={100}
                maxAvatars={3}
              />
            </motion.div>




          </div>

          {/* RIGHT SIDE (unchanged) */}
          <motion.div
            variants={transitionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <div
              className="relative w-full max-w-lg aspect-[5/3] rounded-3xl overflow-hidden shadow-lg border border-border/20 lg:max-w-xl xl:max-w-2xl bg-transparent transition-all duration-500 ease-in-out"
            >
              <video
                className="w-full h-full object-cover"
                src="/videos/campaign0.mp4"
                poster="/vid/video-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Product showcase video placeholder"
              />

              <div className="absolute inset-0 flex items-end justify-end p-4 pointer-events-none">
                <div className="pointer-events-auto group relative flex items-center">
                  <button
                    type="button"
                    aria-label="Open message"
                    className="bg-black/60 text-white p-2 rounded-full backdrop-blur-md flex items-center justify-center shadow-sm"
                  >
                    <img
                      src="/logos/favicon-transparent.png"
                      alt="logo"
                      width={20}
                      height={20}
                    />
                  </button>

                  <div className="absolute right-full mr-3 flex items-center">
                    <div
                      role="tooltip"
                      className="transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 ease-out bg-black/80 text-white text-xs sm:text-sm font-medium rounded-md px-3 py-2 whitespace-nowrap shadow-lg"
                    >
                      EasyStore
                    </div>
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
