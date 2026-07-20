import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
    <>
      {isNavigating && (
        <div className="absolute top-full left-0 right-0 z-[10000] pointer-events-none">
          {/* Main Progress Bar */}
          <div
            className="h-[3px] bg-primary transition-all duration-700"
            style={{ width: `${progress}%` }}
          />

          {/* Subtle Pulse Glow */}
          <div
            className="absolute top-0 right-0 h-[3px] bg-emerald-300 blur-sm"
            style={{
              width: `${Math.min(progress, 15)}%`,
              left: `${progress - 15}%`,
              opacity: 0.6,
            }}
          />
        </div>
      )}
    </>
  );
}
