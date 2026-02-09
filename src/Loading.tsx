import { motion, type Variants } from "framer-motion";

export default function LoadingScreen({
  fullPage = true,
}: {
  fullPage?: boolean;
}) {
  const brandName = "EasyStore";

  // Animation variants
  const letterVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1], // Custom cubic-bezier for premium feel
      },
    }),
  };

  const ringVariants: Variants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className={`${fullPage ? "fixed inset-0 z-[9999]" : "relative h-[70vh] w-full rounded-[3rem] mt-10"} flex flex-col items-center justify-center bg-background overflow-hidden`}
    >
      {/* ─── Premium Background Ambient Glow ─── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-16">
        {/* ─── Central Animated Logo Component ─── */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Main Spinning Border */}
          <motion.div
            variants={ringVariants}
            animate="rotate"
            className="absolute inset-0 border-[3px] border-t-primary border-r-primary/20 border-b-transparent border-l-transparent rounded-full shadow-[0_0_40px_rgba(23,192,110,0.2)]"
          />

          {/* Reverse Secondary Spin */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 border-[2px] border-b-primary/40 border-l-transparent border-t-transparent border-r-transparent rounded-full"
          />

          {/* Pulsing Core Glow */}
          <motion.div
            variants={ringVariants}
            animate="pulse"
            className="absolute inset-6 bg-primary/10 rounded-full"
          />

          {/* ES Brand Symbol */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="relative z-10 flex items-center justify-center"
          >
            <span className="text-primary font-black text-5xl tracking-tighter drop-shadow-sm">
              ES
            </span>
            {/* Dot Accent */}
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -right-2 bottom-2 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_#17c06e]"
            />
          </motion.div>
        </div>

        {/* ─── Brand Display ─── */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex">
            {brandName.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="initial"
                animate="animate"
                className="text-5xl md:text-6xl font-black text-foreground tracking-tight"
              >
                {char}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-muted-foreground text-xs font-bold tracking-[0.3em] uppercase opacity-70">
              Modern Commerce Simplified
            </p>

            {/* Loading Indicator Dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -6, 0],
                    backgroundColor: [
                      "rgba(23,192,110,0.2)",
                      "rgba(23,192,110,1)",
                      "rgba(23,192,110,0.2)",
                    ],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="w-2 h-2 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Bottom Status Label ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.4em]"
      >
        Initializing Secure Connection
      </motion.div>
    </div>
  );
}
