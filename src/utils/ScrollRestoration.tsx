import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_PREFIX = "ez:scroll:";
const SAVE_THROTTLE_MS = 300;

function readSaved(pathname: string): number | null {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${pathname}`);
    if (!raw) return null;
    const y = Number(JSON.parse(raw));
    return Number.isFinite(y) && y > 0 ? y : null;
  } catch {
    return null;
  }
}

function saveScroll(pathname: string, y: number) {
  if (y <= 0) return;
  try {
    sessionStorage.setItem(
      `${STORAGE_PREFIX}${pathname}`,
      JSON.stringify(Math.round(y)),
    );
  } catch {
    // private mode / quota
  }
}

/**
 * Minimal scroll restoration for BrowserRouter.
 *
 * - Forward navigation (push): scroll to top
 * - Back / forward (popstate): restore saved position from sessionStorage
 */
export default function ScrollRestoration() {
  const { pathname } = useLocation();
  const lastPathRef = useRef(pathname);
  const isPopRef = useRef(false);

  // Disable the browser's native scroll restoration — it fights with SPA routing.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Detect popstate (browser back / forward).
  useEffect(() => {
    const onPop = () => {
      isPopRef.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Throttled scroll save — keeps the latest position for the current route.
  useEffect(() => {
    let lastSave = 0;
    const onScroll = () => {
      const now = Date.now();
      if (now - lastSave < SAVE_THROTTLE_MS) return;
      lastSave = now;
      saveScroll(lastPathRef.current, window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On every route change: save old page position, then restore or scroll to top.
  useEffect(() => {
    const prevPath = lastPathRef.current;
    const isPop = isPopRef.current;
    isPopRef.current = false;

    saveScroll(prevPath, window.scrollY);
    lastPathRef.current = pathname;

    if (isPop) {
      const saved = readSaved(pathname);
      if (saved !== null) {
        window.scrollTo(0, saved);
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
