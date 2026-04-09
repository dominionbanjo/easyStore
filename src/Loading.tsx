import { motion, type Variants } from "framer-motion";

export default function LoadingScreen({
  fullPage = true,
}: {
  fullPage?: boolean;
}) {

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
      className={`${fullPage ? "fixed inset-0 z-[9999]" : "relative h-[70vh] w-full rounded-sm mt-10"} flex flex-col items-center justify-center bg-background overflow-hidden`}
    >
      {/* ─── Premium Background Ambient Glow ─── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-sm blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-sm blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-primary/5 rounded-sm blur-[100px] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-16">
        {/* ─── Central Animated Logo Component ─── */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Main Spinning Border */}
          <motion.div
            variants={ringVariants}
            animate="rotate"
            className="absolute inset-0 border-[3px] border-t-primary border-r-primary/20 border-b-transparent border-l-transparent rounded-sm -[0_0_40px_rgba(23,192,110,0.2)]"
          />

          {/* Reverse Secondary Spin */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 border-[2px] border-b-primary/40 border-l-transparent border-t-transparent border-r-transparent rounded-sm"
          />

          {/* Pulsing Core Glow */}
          <motion.div
            variants={ringVariants}
            animate="pulse"
            className="absolute inset-6 bg-primary/10 rounded-sm"
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
            <span className="text-primary font-black text-5xl tracking-tighter drop-">
              EZ
            </span>
            {/* Dot Accent */}
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -right-2 bottom-2 w-2.5 h-2.5 bg-primary rounded-sm -[0_0_10px_#17c06e]"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
