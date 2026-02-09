import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 🚀 NavigationProgressBar
 * A slim, premium progress bar that appears at the top of the viewport
 * during navigation transitions. It helps eliminate "silent" waits
 * during lazy component fetching.
 */
export default function NavigationProgressBar() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Trigger progress bar on location change
  useEffect(() => {
    // Reset and start immediately
    setIsNavigating(true);
    setProgress(40); // Higher initial jump for instant feel

    // Smoothly progress towards 90%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + Math.random() * 8; // Faster random increments
      });
    }, 150); // Faster interval

    // Minimum display time for premium feel, but faster resolution
    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsNavigating(false), 300); // Faster fade out
    }, 500); // Shorter baseline

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [location.pathname, location.search]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-full left-0 right-0 z-[10000] pointer-events-none"
        >
          {/* Main Progress Bar */}
          <motion.div
            className="h-[3px] bg-primary shadow-[0_0_10px_rgba(23,192,110,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{
              width: { type: "spring", stiffness: 50, damping: 20 },
              duration: 0.2,
            }}
          />

          {/* Subtle Pulse Glow */}
          <motion.div
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scaleX: [1, 1.05, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute top-0 right-0 w-24 h-[3px] bg-emerald-300 blur-sm"
            style={{
              width: `${Math.min(progress, 15)}%`,
              left: `${progress - 15}%`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
