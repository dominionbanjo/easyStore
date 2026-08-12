import { useEffect, useRef, type MutableRefObject } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_PREFIX = "ez:scroll:";
const SAVE_THROTTLE_MS = 300;
const RESTORE_INTERVAL_MS = 150;
const RESTORE_TIMEOUT_MS = 12000;
const STALL_TICKS = 20; // ~3s of no height change before giving up
const WALK_STEP = 1500; // sweep step that activates each lazy section

// Anchor path: viewport-relative restore — we pin the element that was near
// the top of the viewport when the user left, so the total page height is
// never involved (lazy sections may still be growing below or above).
const ANCHOR_LINE = 200; // px from viewport top used to pick the anchor
const ANCHOR_INTERVAL_MS = 120;
const ANCHOR_STABLE_TICKS = 3; // consecutive ticks within tolerance
const ANCHOR_TOLERANCE = 2; // px
const ANCHOR_TIMEOUT_MS = 8000;
const ANCHOR_MISS_FALLBACK_MS = 3000; // wait for anchor element before falling back

interface SavedScroll {
  y: number;
  anchor?: string;
  anchorOffset?: number;
}

function readSavedScroll(pathname: string): SavedScroll | null {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${pathname}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedScroll | number;
    const record: SavedScroll =
      typeof parsed === "number"
        ? { y: parsed }
        : { y: Number(parsed?.y ?? 0), anchor: parsed?.anchor, anchorOffset: Number(parsed?.anchorOffset ?? 0) };
    if (!Number.isFinite(record.y) || record.y <= 0) return null;
    return record;
  } catch {
    return null;
  }
}

function writeSavedScroll(pathname: string, record: SavedScroll | null) {
  if (!record || record.y <= 0) return;
  try {
    sessionStorage.setItem(
      `${STORAGE_PREFIX}${pathname}`,
      JSON.stringify({
        y: Math.round(record.y),
        anchor: record.anchor,
        anchorOffset: Math.round(record.anchorOffset ?? 0),
      }),
    );
  } catch {
    // ignore (private mode / quota)
  }
}

/** Last anchored section whose top is at or above the anchor line. */
function computeAnchorRecord(): Pick<SavedScroll, "anchor" | "anchorOffset"> | null {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>("[data-scroll-anchor]"),
  );
  let chosen: HTMLElement | null = null;
  for (const el of elements) {
    if (el.getBoundingClientRect().top <= ANCHOR_LINE) chosen = el;
    else break; // elements are in document order; tops are monotonic
  }
  if (!chosen?.dataset.scrollAnchor) return null;
  return {
    anchor: chosen.dataset.scrollAnchor,
    anchorOffset: chosen.getBoundingClientRect().top,
  };
}

function saveCurrentScroll(pathname: string) {
  const anchor = computeAnchorRecord();
  writeSavedScroll(pathname, {
    y: window.scrollY,
    anchor: anchor?.anchor,
    anchorOffset: anchor?.anchorOffset,
  });
}

function clearRestoreTimer(timerRef: MutableRefObject<number | null>) {
  if (timerRef.current !== null) {
    window.clearInterval(timerRef.current);
    timerRef.current = null;
  }
}

function endRestore(
  timerRef: MutableRefObject<number | null>,
  restoringRef: React.MutableRefObject<boolean>,
  y: number,
) {
  restoringRef.current = false;
  clearRestoreTimer(timerRef);
  document.documentElement.classList.remove("ez-restoring");
  window.scrollTo(0, Math.max(0, y));
}

/**
 * Manual scroll restoration that tolerates lazily-loaded pages.
 *
 * Homepage sections mount short (useInView data fetching + content-visibility
 * intrinsic sizes) and only grow when the viewport activates them, so a
 * one-shot restore lands at the footer. Two strategies:
 *
 * 1. Anchor path (pages with `[data-scroll-anchor]` sections, e.g. the
 *    landing page): restore by pinning the section that was near the top of
 *    the viewport to the same viewport offset. The target is derived from the
 *    anchor element's own layout position — never from total document height —
 *    so sections still loading below (or growing above) don't matter.
 * 2. Fallback path (other pages): sweep down the page so every lazy section
 *    activates, settle until the page height stops changing, then land on the
 *    saved position.
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
  // retry loops below.
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

  // Continuously save the current scroll position (throttled), anchored to
  // the nearest section at the top of the viewport.
  useEffect(() => {
    let lastSaveAt = 0;
    const onScroll = () => {
      const now = Date.now();
      if (now - lastSaveAt < SAVE_THROTTLE_MS) return;
      lastSaveAt = now;
      saveCurrentScroll(lastPathRef.current);
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
    saveCurrentScroll(prevPath);

    lastPathRef.current = pathname;

    const saved = readSavedScroll(pathname);
    const shouldRestore =
      isPop || (isFirstMountRef.current && saved !== null);
    isFirstMountRef.current = false;

    if (!shouldRestore || !saved) {
      window.scrollTo(0, 0);
      return;
    }

    // Force-render content-visibility sections so the page can grow quickly
    // and inner content mounts during either restore path.
    document.documentElement.classList.add("ez-restoring");

    const finish = (y: number) => endRestore(restoreTimerRef, restoringRef, y);

    /* ─────────── ANCHOR PATH (viewport-relative) ─────────── */
    if (saved.anchor) {
      restoringRef.current = true;
      lastAutoYRef.current = null;
      let stableCount = 0;
      const startedAt = Date.now();

      restoreTimerRef.current = window.setInterval(() => {
        if (!restoringRef.current) return;

        const el = document.querySelector<HTMLElement>(
          `[data-scroll-anchor="${saved.anchor}"]`,
        );

        if (!el) {
          if (Date.now() - startedAt > ANCHOR_MISS_FALLBACK_MS) {
            finish(Math.min(saved.y, maxScrollY()));
          }
          return;
        }

        // Desired absolute scroll so the anchor sits at the saved viewport
        // offset: rect.top = offsetTop - scrollY, we want rect.top = offset.
        const desired = el.offsetTop - (saved.anchorOffset ?? 0);

        // A browser clamp always lands exactly at maxScroll; anything else
        // further from where we last put it is a real user scroll — leave them.
        if (lastAutoYRef.current !== null) {
          const atMax = Math.abs(window.scrollY - maxScrollY()) <= 2;
          const moved = Math.abs(window.scrollY - lastAutoYRef.current) > 30;
          if (moved && !atMax) {
            finish(window.scrollY);
            return;
          }
        }

        window.scrollTo(0, Math.max(0, desired));
        lastAutoYRef.current = window.scrollY;

        const drift = el.getBoundingClientRect().top - (saved.anchorOffset ?? 0);
        if (Math.abs(drift) <= ANCHOR_TOLERANCE) {
          stableCount += 1;
          if (stableCount >= ANCHOR_STABLE_TICKS) {
            finish(window.scrollY);
            return;
          }
        } else {
          stableCount = 0;
        }

        if (Date.now() - startedAt > ANCHOR_TIMEOUT_MS) {
          finish(window.scrollY);
        }
      }, ANCHOR_INTERVAL_MS);

      return () => {
        restoringRef.current = false;
        clearRestoreTimer(restoreTimerRef);
        document.documentElement.classList.remove("ez-restoring");
      };
    }

    /* ─────────── FALLBACK PATH (total-height walk) ─────────── */
    const target = saved.y;
    if (restoreTimerRef.current !== null) {
      window.clearInterval(restoreTimerRef.current);
      restoreTimerRef.current = null;
    }

    restoringRef.current = true;
    lastAutoYRef.current = null;

    const startedAt = Date.now();
    let walkY = 0;
    let settled = false;
    let lastMax = -1;
    let stallCount = 0;

    restoreTimerRef.current = window.setInterval(() => {
      if (!restoringRef.current) return;

      const maxScroll = maxScrollY();

      // A browser clamp always lands exactly at maxScroll; anything else
      // further from where we last put it is a real user scroll — leave them.
      if (lastAutoYRef.current !== null) {
        const atMax = Math.abs(window.scrollY - maxScroll) <= 2;
        const moved = Math.abs(window.scrollY - lastAutoYRef.current) > 30;
        if (moved && !atMax) {
          finish(window.scrollY);
          return;
        }
      }

      // Hard cap: land as close as the page allows.
      if (Date.now() - startedAt > RESTORE_TIMEOUT_MS) {
        finish(Math.min(target, maxScroll));
        return;
      }

      if (!settled) {
        // Sweep down so every lazy section activates and renders.
        walkY = Math.min(walkY + WALK_STEP, maxScroll);
        lastAutoYRef.current = walkY;
        window.scrollTo(0, walkY);
        if (walkY >= maxScroll) settled = true;
        return;
      }

      // Settle: keep pinned at the bottom while heights settle.
      if (maxScroll > walkY) {
        walkY = maxScroll;
        lastAutoYRef.current = walkY;
        window.scrollTo(0, walkY);
        lastMax = -1;
        stallCount = 0;
        return;
      }

      if (maxScroll === lastMax) {
        stallCount += 1;
        if (stallCount >= STALL_TICKS) {
          finish(Math.min(target, maxScroll));
          return;
        }
      } else {
        lastMax = maxScroll;
        stallCount = 0;
      }

      // Reachable and stable — land exactly where the user left off.
      if (maxScroll >= target - 4) {
        finish(target);
        return;
      }
    }, RESTORE_INTERVAL_MS);

    return () => {
      restoringRef.current = false;
      clearRestoreTimer(restoreTimerRef);
      document.documentElement.classList.remove("ez-restoring");
    };
  }, [pathname]);
}

function maxScrollY(): number {
  return Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    0,
  );
}
