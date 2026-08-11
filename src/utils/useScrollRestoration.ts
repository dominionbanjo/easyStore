import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_PREFIX = "ez:scroll:";
const SAVE_THROTTLE_MS = 300;
const RESTORE_INTERVAL_MS = 120;
const RESTORE_TIMEOUT_MS = 5000;
const STALL_TICKS = 6;

function readSavedScroll(pathname: string): number {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${pathname}`);
    const value = raw ? Number(raw) : 0;
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

function writeSavedScroll(pathname: string, y: number) {
  if (y <= 0) return;
  try {
    sessionStorage.setItem(
      `${STORAGE_PREFIX}${pathname}`,
      String(Math.round(y)),
    );
  } catch {
    // ignore (private mode / quota)
  }
}

/**
 * Manual scroll restoration that tolerates lazily-loaded pages.
 *
 * Homepage sections mount short (useInView data fetching + content-visibility
 * intrinsic sizes) and grow as they render, so a one-shot restore lands at the
 * footer. On back navigation we restore progressively: scroll to the current
 * maximum (activating lazy sections so they render and grow the page), wait
 * for the page to catch up, then land on the saved position.
 */
export function useScrollRestoration() {
  const { pathname } = useLocation();
  const lastPathRef = useRef(pathname);
  const isPopRef = useRef(false);
  const isFirstMountRef = useRef(true);
  const restoreTimerRef = useRef<number | null>(null);
  const restoringRef = useRef(false);
  const lastAutoYRef = useRef<number | null>(null);

  // Disable the browser's native restoration — it fires asynchronously after
  // layout against a page that is still short (lazy sections), racing the
  // retry loop below.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Mark back/forward navigations (popstate) so the location effect restores
  // instead of scrolling to top.
  useEffect(() => {
    const handlePop = () => {
      isPopRef.current = true;
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  // Continuously save the current scroll position (throttled).
  useEffect(() => {
    let lastSaveAt = 0;
    const onScroll = () => {
      const now = Date.now();
      if (now - lastSaveAt < SAVE_THROTTLE_MS) return;
      lastSaveAt = now;
      writeSavedScroll(lastPathRef.current, window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const prevPath = lastPathRef.current;
    const isPop = isPopRef.current;
    isPopRef.current = false;

    // Save the position of the page we're leaving — window.scrollY still
    // holds the old page's value at this point.
    writeSavedScroll(prevPath, window.scrollY);

    lastPathRef.current = pathname;

    const shouldRestore =
      isPop || (isFirstMountRef.current && readSavedScroll(pathname) > 0);
    isFirstMountRef.current = false;

    if (!shouldRestore) {
      window.scrollTo(0, 0);
      return;
    }

    const target = readSavedScroll(pathname);
    if (target <= 0) {
      window.scrollTo(0, 0);
      return;
    }

    if (restoreTimerRef.current !== null) {
      window.clearInterval(restoreTimerRef.current);
      restoreTimerRef.current = null;
    }

    restoringRef.current = true;
    lastAutoYRef.current = null;

    const startedAt = Date.now();
    let lastMax = -1;
    let stallCount = 0;

    const finish = (y: number) => {
      restoringRef.current = false;
      if (restoreTimerRef.current !== null) {
        window.clearInterval(restoreTimerRef.current);
        restoreTimerRef.current = null;
      }
      window.scrollTo(0, y);
    };

    restoreTimerRef.current = window.setInterval(() => {
      if (!restoringRef.current) return;

      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      );

      if (lastAutoYRef.current !== null) {
        const clamped =
          window.scrollY > maxScroll + 2; // browser clamped us (layout shrank)
        const moved = Math.abs(window.scrollY - lastAutoYRef.current) > 4;
        if (moved && !clamped) {
          // The user grabbed the scrollbar mid-restore — leave them alone.
          finish(window.scrollY);
          return;
        }
      }

      if (maxScroll >= target - 4) {
        finish(target);
        return;
      }

      if (maxScroll === lastMax) {
        stallCount += 1;
        if (
          stallCount >= STALL_TICKS ||
          Date.now() - startedAt > RESTORE_TIMEOUT_MS
        ) {
          finish(maxScroll);
          return;
        }
      } else {
        lastMax = maxScroll;
        stallCount = 0;
      }

      // Scroll to the current bottom — activates lazy sections (useInView +
      // content-visibility), which render and grow the page.
      lastAutoYRef.current = maxScroll;
      window.scrollTo(0, maxScroll);
    }, RESTORE_INTERVAL_MS);

    return () => {
      restoringRef.current = false;
      if (restoreTimerRef.current !== null) {
        window.clearInterval(restoreTimerRef.current);
        restoreTimerRef.current = null;
      }
    };
  }, [pathname]);
}
