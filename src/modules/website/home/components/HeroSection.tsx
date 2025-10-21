
// "use client";

// import { motion, type Variants } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";

// const transitionVariants: Variants = {
//     hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
//     visible: {
//         opacity: 1,
//         y: 0,
//         filter: "blur(0px)",
//         transition: {
//             type: "spring",
//             bounce: 0.3,
//             duration: 1.4,
//         },
//     },
// };

// export default function HeroSection() {
//     return (
//         <section className="relative isolate overflow-hidden  pt-32 pb-28 sm:pt-40 sm:pb-32">

//             <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
//                 <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.emerald.100),transparent_70%)] opacity-40 blur-3xl" />
//                 <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_0%_0%,rgba(0,0,0,0.02)_0%,transparent_70%)]" />
//             </div>


//             <div className="flex justify-center w-full">
//                 <div className="max-w-[1800px] w-full px-7 sm:px-8 flex flex-col items-center lg:flex-row lg:items-center lg:justify-between gap-12">

//                     <div className="flex-1 text-center lg:text-left">
//                         <motion.h1
//                             variants={transitionVariants}
//                             initial="hidden"
//                             animate="visible"
//                             className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-balance leading-tight"
//                         >
//                             Discover products <br/>you’ll{" "}
//                             <span className="text-primary">love</span>
//                         </motion.h1>

//                         <motion.p
//                             variants={transitionVariants}
//                             initial="hidden"
//                             animate="visible"
//                             transition={{ delay: 0.2 }}
//                             className="mt-6 max-w-xl mx-auto lg:mx-0  text-lg sm:text-xl leading-relaxed"
//                         >
//                             Shop the best deals in fashion, electronics, home decor, and more 
//                             all curated for your lifestyle.
//                         </motion.p>

//                         <motion.div
//                             variants={transitionVariants}
//                             initial="hidden"
//                             animate="visible"
//                             transition={{ delay: 0.4 }}
//                             className="mt-10 flex justify-center lg:justify-start"
//                         >
//                             <Button
//                                 size="lg"
//                                 className="bg-primary text-primary-foreground rounded-full px-8 hover:bg-primary/90 transition-transform hover:scale-[1.03]"
//                             >
//                                 Start Shopping
//                                 <ArrowRight className="ml-2 h-5 w-5" />
//                             </Button>
//                         </motion.div>
//                     </div>


//                     <motion.div
//                         variants={transitionVariants}
//                         initial="hidden"
//                         animate="visible"
//                         transition={{ delay: 0.5 }}
//                         className="flex-1 flex justify-center lg:justify-end"
//                     >
//                         <div
//                             className="
//       relative w-full max-w-lg       
//       aspect-[5/3]                 
//       rounded-3xl overflow-hidden
//       bg-muted shadow-lg border border-border/20
//       lg:max-w-xl xl:max-w-2xl       
//       transition-all duration-500 ease-in-out
//     "
//                         >
//                             <video
//                                 className="w-full h-full object-cover"
//                                 src="/videos/promotion.mp4"
//                                 poster="/vid/video-poster.jpg"
//                                 autoPlay
//                                 muted
//                                 loop
//                                 playsInline
//                                 aria-label="Product showcase video placeholder"
//                             />
//                             <div className="absolute inset-0 flex items-end justify-end p-4 pointer-events-none">
//                                 <div className="pointer-events-auto group relative flex items-center">
//                                     <button
//                                         type="button"
//                                         aria-label="Open message"
//                                         className="bg-black/60 text-white p-2 rounded-full backdrop-blur-md flex items-center justify-center shadow-sm"
//                                     >
//                                         <img src="/logos/favicon-transparent.png" alt="logo" width={20} height={20} />
//                                     </button>


//                                     <div className="absolute right-full mr-3 flex items-center">
//                                         <div
//                                             role="tooltip"
//                                             className="transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 ease-out bg-black/80 text-white text-xs sm:text-sm font-medium rounded-md px-3 py-2 whitespace-nowrap shadow-lg"
//                                         >
//                                             EasyStore
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </motion.div>

//                 </div>
//             </div>
//         </section>
//     );
// }








"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden  pt-32 pb-28 sm:pt-40 sm:pb-32">
      {/* ───────────── Background Layer (kept for layout, no color) ───────────── */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden " />

      {/* ───────────── Main Container ───────────── */}
      <div className="flex justify-center w-full">
        <div className="max-w-[1950px] w-full px-7 sm:px-8 flex flex-col items-center lg:flex-row lg:items-center lg:justify-between gap-12">
          {/* ───────────── Left: Text Section ───────────── */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-balance leading-tight"
            >
              Discover products <br /> you’ll{" "}
              <span className="text-primary">love</span>
            </motion.h1>

            <motion.p
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl leading-relaxed text-foreground"
            >
              Shop the best deals in fashion, electronics, home decor, and more —
              all curated for your lifestyle.
            </motion.p>

            <motion.div
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="mt-10 flex justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground rounded-full px-8 hover:bg-primary/90 transition-transform hover:scale-[1.03]"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          {/* ───────────── Right: Video Showcase ───────────── */}
          <motion.div
            variants={transitionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <div
              className="
                relative w-full max-w-lg
                aspect-[5/3]
                rounded-3xl overflow-hidden
                shadow-lg border border-border/20
                lg:max-w-xl xl:max-w-2xl
                bg-transparent
                transition-all duration-500 ease-in-out
              "
            >
              <video
                className="w-full h-full object-cover"
                src="/videos/promotion.mp4"
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
