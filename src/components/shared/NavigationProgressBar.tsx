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
    setIsNavigating(true);
    setProgress(30); // Immediate jump to 30%

    // Smoothly progress towards 90%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + Math.random() * 10;
      });
    }, 200);

    // Navigation "finishes" when the new component actually renders
    // and this effect cleanup or next trigger happens.
    // In React Router + Lazy, the trigger is actually the URL change.
    // The "finish" is once the component mounts.
    // Since this is a global component, we'll manually timeout or
    // use a more direct approach if we were using a data router.
    // For now, a short delay mimics the chunk loading.

    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsNavigating(false), 300);
    }, 400); // Mimic average chunk load

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
          className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none"
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
