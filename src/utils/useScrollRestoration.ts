import { useEffect, useRef, type MutableRefObject } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_PREFIX = "ez:scroll:";
const SAVE_THROTTLE_MS = 300;
const RESTORE_INTERVAL_MS = 150;
const RESTORE_TIMEOUT_MS = 12000;
const STALL_TICKS = 20; // ~3s of no height change before giving up
const WALK_STEP = 1500; // sweep step that activates each lazy section
const UNREACHABLE_STALL_FALLBACK_MS = 6000; // keep waiting for a slow page before landing lower

// Anchor path: viewport-relative restore — we pin the element that was near
// the top of the viewport when the user left, so the total page height is
// never involved (lazy sections may still be growing below or above).
const ANCHOR_LINE = 200; // px from viewport top used to pick the anchor
const ANCHOR_INTERVAL_MS = 120;
const ANCHOR_STABLE_TICKS = 3; // consecutive ticks within tolerance
const ANCHOR_TOLERANCE = 2; // px
const ANCHOR_TIMEOUT_MS = 8000;
const ANCHOR_MISS_FALLBACK_MS = 3000; // wait for anchor element before falling back

// Watchdog: after an anchor restore, keep re-pinning for a short window so
// sections that finish rendering after the restore don't shift the viewport.
const WATCHDOG_INTERVAL_MS = 500;
const WATCHDOG_CHECKS = 3;
const WATCHDOG_TOLERANCE = 6; // px

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

function clearWatchdogTimer(timerRef: MutableRefObject<number | null>) {
  if (timerRef.current !== null) {
    window.clearInterval(timerRef.current);
    timerRef.current = null;
  }
}

function endRestore(
  restoreTimerRef: MutableRefObject<number | null>,
  watchdogTimerRef: MutableRefObject<number | null>,
  restoringRef: MutableRefObject<boolean>,
  y: number,
) {
  restoringRef.current = false;
  clearRestoreTimer(restoreTimerRef);
  clearWatchdogTimer(watchdogTimerRef);
  window.scrollTo(0, Math.max(0, y));
  document.documentElement.classList.remove("ez-restoring");
}

/**
 * Manual scroll restoration that tolerates lazily-loaded pages.
 *
 * Homepage sections mount short (useInView data fetching + content-visibility
 * intrinsic sizes) and only grow when the viewport activates them, so a
 * one-shot restore lands at the footer. Restore happens in phases:
 *
 * 1. Activate: sweep the viewport down the page in steps so every lazy
 *    section above the target activates and renders its final height.
 * 2. Land:
 *    - Anchor pages (`[data-scroll-anchor]` sections, e.g. the landing
 *      page): pin the section that was near the top of the viewport back to
 *      the saved viewport offset, once its absolute position has settled.
 *    - Other pages: land on the saved absolute position once reachable and
 *      the page height stops changing.
 * 3. Watchdog (anchor pages): keep re-pinning for a short window so sections
 *    that finish rendering after the restore don't shift the viewport.
 */
export function useScrollRestoration() {
  const { pathname } = useLocation();
  const lastPathRef = useRef(pathname);
  const isPopRef = useRef(false);
  const isFirstMountRef = useRef(true);
  const restoreTimerRef = useRef<number | null>(null);
  const watchdogTimerRef = useRef<number | null>(null);
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
  // the nearest section at the top of the viewport. Skipped while a restore
  // is running so the restore's own programmatic scrolls never overwrite the
  // saved record with mid-restore positions.
  useEffect(() => {
    let lastSaveAt = 0;
    const onScroll = () => {
      if (restoringRef.current) return;
      const now = Date.now();
      if (now - lastSaveAt < SAVE_THROTTLE_MS) return;
      lastSaveAt = now;
      saveCurrentScroll(lastPathRef.current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep re-pinning the anchor for a short window after the restore finishes,
  // so sections still growing above it can't shift the viewport afterwards.
  function startAnchorWatchdog(anchorName: string, anchorOffset: number) {
    let checks = 0;
    watchdogTimerRef.current = window.setInterval(() => {
      const el = document.querySelector<HTMLElement>(
        `[data-scroll-anchor="${anchorName}"]`,
      );
      checks += 1;
      if (!el || checks > WATCHDOG_CHECKS) {
        clearWatchdogTimer(watchdogTimerRef);
        document.documentElement.classList.remove("ez-restoring");
        return;
      }
      const drift = el.getBoundingClientRect().top - anchorOffset;
      if (Math.abs(drift) > WATCHDOG_TOLERANCE) {
        const desired = el.offsetTop - anchorOffset;
        window.scrollTo(0, Math.max(0, desired));
      }
    }, WATCHDOG_INTERVAL_MS);
  }

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

    const finish = (y: number) =>
      endRestore(restoreTimerRef, watchdogTimerRef, restoringRef, y);

    /* ─────────── ANCHOR PATH (viewport-relative) ─────────── */
    if (saved.anchor) {
      const anchorName = saved.anchor;
      const anchorOffset = saved.anchorOffset ?? 0;

      const finishAnchor = (y: number) => {
        restoringRef.current = false;
        clearRestoreTimer(restoreTimerRef);
        window.scrollTo(0, Math.max(0, y));
        startAnchorWatchdog(anchorName, anchorOffset);
      };

      restoringRef.current = true;
      lastAutoYRef.current = null;
      const startedAt = Date.now();
      let walkY = 0;
      let lastOffsetTop = -1;
      let offsetStableTicks = 0;
      let pinStableTicks = 0;
      let walking = true;

      window.scrollTo(0, 0);
      walkY = window.scrollY;

      restoreTimerRef.current = window.setInterval(() => {
        if (!restoringRef.current) return;

        const el = document.querySelector<HTMLElement>(
          `[data-scroll-anchor="${anchorName}"]`,
        );

        if (!el) {
          if (Date.now() - startedAt > ANCHOR_MISS_FALLBACK_MS) {
            finish(Math.min(saved.y, maxScrollY()));
          }
          return;
        }

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

        if (Date.now() - startedAt > ANCHOR_TIMEOUT_MS) {
          finishAnchor(window.scrollY);
          return;
        }

        if (walking) {
          // Walk down until the viewport has passed the anchor's position so
          // every lazy section above it activates and renders its final
          // height — the anchor's absolute position only settles afterwards.
          const anchorPos = el.offsetTop - anchorOffset;
          if (walkY < anchorPos) {
            const step = Math.min(walkY + WALK_STEP, maxScrollY());
            window.scrollTo(0, step);
            walkY = window.scrollY;
            lastAutoYRef.current = walkY;
            return;
          }

          if (el.offsetTop === lastOffsetTop) {
            offsetStableTicks += 1;
          } else {
            lastOffsetTop = el.offsetTop;
            offsetStableTicks = 0;
          }
          if (offsetStableTicks >= ANCHOR_STABLE_TICKS) walking = false;
          return;
        }

        // Pin the anchor back to its saved viewport offset.
        const desired = el.offsetTop - anchorOffset;
        window.scrollTo(0, Math.max(0, desired));
        lastAutoYRef.current = window.scrollY;

        const drift = el.getBoundingClientRect().top - anchorOffset;
        if (Math.abs(drift) <= ANCHOR_TOLERANCE) {
          pinStableTicks += 1;
          if (pinStableTicks >= ANCHOR_STABLE_TICKS) {
            finishAnchor(window.scrollY);
            return;
          }
        } else {
          pinStableTicks = 0;
        }
      }, ANCHOR_INTERVAL_MS);

      return () => {
        restoringRef.current = false;
        clearRestoreTimer(restoreTimerRef);
        clearWatchdogTimer(watchdogTimerRef);
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
    let lastMax = -1;
    let stallCount = 0;
    let landed = false;

    window.scrollTo(0, 0);
    walkY = window.scrollY;

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

      if (!landed) {
        // Walk down until the viewport has passed the saved position so every
        // lazy section above it has activated and rendered.
        if (walkY < target && walkY < maxScroll) {
          const step = Math.min(walkY + WALK_STEP, maxScroll);
          window.scrollTo(0, step);
          walkY = window.scrollY;
          lastAutoYRef.current = walkY;
          return;
        }

        // Target is reachable — land on it, then wait for the page to settle.
        if (maxScroll >= target - 4) {
          landed = true;
          stallCount = 0;
          lastMax = maxScroll;
          window.scrollTo(0, Math.min(target, maxScroll));
          lastAutoYRef.current = window.scrollY;
          return;
        }

        // Page stopped growing below the target (lazy chunk not mounted yet,
        // slow API): keep waiting a while before landing lower so we don't
        // dump the user at the top of a page that is still loading.
        if (maxScroll === lastMax) {
          stallCount += 1;
          if (
            stallCount >= STALL_TICKS &&
            Date.now() - startedAt > UNREACHABLE_STALL_FALLBACK_MS
          ) {
            finish(Math.min(target, maxScroll));
            return;
          }
        } else {
          lastMax = maxScroll;
          stallCount = 0;
        }
        return;
      }

      // Landed: finish once the page height stops changing.
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
    }, RESTORE_INTERVAL_MS);

    return () => {
      restoringRef.current = false;
      clearRestoreTimer(restoreTimerRef);
      clearWatchdogTimer(watchdogTimerRef);
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
