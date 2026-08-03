import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import { useEffect, useRef } from "react";

interface PreloadLinkProps extends LinkProps {
  preload?: () => Promise<unknown>;
}

/**
 * 🚀 PreloadLink Component
 * Implements Rule 5 — Viewport-Based Preloading.
 * Automatically triggers dynamic import when link enters viewport.
 */
export default function PreloadLink({ preload, ...props }: PreloadLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // 🛡️ Guard: No preload function or no IntersectionObserver support
    if (
      !preload ||
      typeof window === "undefined" ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    // 🛡️ Rule 5: Mandatory Network Protection (Data Saver / 2G)
    const connection = (
      navigator as { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (connection) {
      if (
        connection.saveData === true ||
        (connection.effectiveType && connection.effectiveType.includes("2g"))
      ) {
        return;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 🚀 Trigger Preload
            preload().catch(() => {}); // Quietly fail if import fails
            observer.disconnect(); // Only preload once
          }
        });
      },
      { rootMargin: "200px" }, // Preload when within 200px of viewport
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [preload]);

  return <Link ref={ref} {...props} />;
}
