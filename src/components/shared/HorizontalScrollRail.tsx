import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface HorizontalScrollRailProps {
  children: ReactNode;
  className?: string;
  showTrack?: boolean;
}

/**
 * Horizontal scroll rail with a visible, draggable scroll strip.
 *
 * - Native touch swipe + mouse wheel scrolling still work.
 * - The track + thumb reflect scroll progress and can be dragged/clicked
 *   to scrub — on mobile and desktop alike.
 * - The content itself can be grabbed and dragged with the mouse.
 */
export default function HorizontalScrollRail({
  children,
  className,
  showTrack = true,
}: HorizontalScrollRailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [isDraggingContent, setIsDraggingContent] = useState(false);

  const dragStartRef = useRef<{ x: number; scrollLeft: number } | null>(null);
  const draggedRef = useRef(false);

  const updateProgress = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setCanScroll(max > 1);
    setProgress(max > 1 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    updateProgress();
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => updateProgress();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [updateProgress]);

  /* ── Drag the content itself (desktop mouse) ── */
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    if (e.button !== 0) return;

    const el = containerRef.current;
    if (!el) return;

    dragStartRef.current = { x: e.clientX, scrollLeft: el.scrollLeft };
    draggedRef.current = false;
    setIsDraggingContent(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    const el = containerRef.current;
    if (!start || !el) return;

    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 5) draggedRef.current = true;
    el.scrollLeft = start.scrollLeft - dx;
  };

  const endDrag = () => {
    dragStartRef.current = null;
    setIsDraggingContent(false);
  };

  /* Suppress clicks on cards after a drag gesture */
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false;
    }
  };

  /* ── Scrub via the visible strip ── */
  const scrubFromClientX = (clientX: number) => {
    const el = containerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const rect = track.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (clientX - rect.left) / Math.max(rect.width, 1)),
    );
    const max = el.scrollWidth - el.clientWidth;
    el.scrollLeft = ratio * max;
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    scrubFromClientX(e.clientX);

    const move = (ev: PointerEvent) => scrubFromClientX(ev.clientX);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const thumbWidth = progress * 100;

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={handleClickCapture}
        className={cn(
          "flex overflow-x-auto no-scrollbar snap-x",
          isDraggingContent &&
            "cursor-grabbing select-none [&_*]:pointer-events-none",
          !isDraggingContent && "cursor-grab",
          className,
        )}
      >
        {children}
      </div>

      {showTrack && canScroll && (
        <div
          ref={trackRef}
          role="scrollbar"
          aria-label="Scroll products"
          onPointerDown={handleTrackPointerDown}
          className="mt-3 h-1.5 w-full rounded-full bg-muted/60 dark:bg-white/10 cursor-pointer touch-pan-y"
        >
          <div
            className="h-full min-w-6 rounded-full bg-primary transition-[width] duration-150"
            style={{ width: `${Math.max(thumbWidth, 4)}%` }}
          />
        </div>
      )}
    </div>
  );
}
