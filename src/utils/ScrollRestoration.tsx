import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_PREFIX = "ez:scroll:";
const SAVE_THROTTLE_MS = 300;
const MAX_RESTORE_ATTEMPTS = 40;

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
 * The critical insight: React Router v7.9.4 wraps every setState in
 * startTransition, which defers the DOM commit. This means useLayoutEffect
 * fires AFTER the browser paints — too late to prevent a flash at scrollY=0.
 *
 * Fix: Restore scroll directly in the popstate listener via setTimeout(0),
 * which fires as a macrotask BEFORE the browser paints the deferred commit.
 *
 * - Forward navigation (push): scroll to top via useLayoutEffect
 * - Back / forward (popstate): restore saved position via popstate listener
 */
export default function ScrollRestoration() {
  const { pathname } = useLocation();
  const lastPathRef = useRef(pathname);
  const restoreIdRef = useRef(0);

  // Disable the browser's native scroll restoration — it fights with SPA routing.
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Throttled scroll save — keeps the latest position for the current route.
  // Skips saving when body overflow is locked (e.g. fullscreen gallery).
  useEffect(() => {
    let lastSave = 0;
    const onScroll = () => {
      const now = Date.now();
      if (now - lastSave < SAVE_THROTTLE_MS) return;
      lastSave = now;
      if (document.body.style.overflow === "hidden") return;
      saveScroll(lastPathRef.current, window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Restore scroll on popstate (browser back / forward).
  // Uses setTimeout(0) to fire BEFORE the browser paints the startTransition-
  // deferred commit from React Router. The scroll is restored in the same
  // event loop tick as the popstate, before React even processes the update.
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let currentRestoreId = 0;

    const onPop = () => {
      // Save current position before restoring the destination.
      if (document.body.style.overflow !== "hidden") {
        saveScroll(lastPathRef.current, window.scrollY);
      }

      // Cancel any in-progress restore from a previous popstate.
      currentRestoreId++;
      restoreIdRef.current = currentRestoreId;

      // Schedule restore as a macrotask — fires before browser paints the
      // startTransition-deferred commit from React Router.
      timeout = setTimeout(() => {
        const targetPath = window.location.pathname;
        lastPathRef.current = targetPath;
        const saved = readSaved(targetPath);

        if (saved !== null) {
          document.documentElement.classList.add("ez-restoring");
          const myId = currentRestoreId;

          // Sweep-and-settle: keep restoring while page grows (lazy sections
          // loading, Suspense resolving, content-visibility expanding).
          let attempts = 0;
          const restore = () => {
            // Abort if a newer popstate has started.
            if (restoreIdRef.current !== myId) {
              document.documentElement.classList.remove("ez-restoring");
              return;
            }

            window.scrollTo(0, saved);
            attempts++;

            if (attempts < MAX_RESTORE_ATTEMPTS) {
              requestAnimationFrame(restore);
            } else {
              window.scrollTo(0, saved);
              document.documentElement.classList.remove("ez-restoring");
            }
          };
          requestAnimationFrame(restore);
        }
      }, 0);
    };

    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      clearTimeout(timeout);
    };
  }, []);

  // On every route change via push/replace (not popstate): scroll to top.
  // This handles forward navigation (clicking links, programmatic navigate).
  // Popstate-triggered route changes are handled by the listener above.
  const lastPathnameRef = useRef(pathname);
  useLayoutEffect(() => {
    const prevPath = lastPathnameRef.current;
    lastPathnameRef.current = pathname;

    // Skip if this is the first render (pathname hasn't changed from init).
    if (prevPath === pathname) return;

    // If a popstate restore is in progress, don't interfere.
    if (restoreIdRef.current !== 0) return;

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
