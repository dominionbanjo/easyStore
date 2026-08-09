import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface VerticalScrollViewProps {
  children: ReactNode;
  /** Applied to the outer wrapper (height constraints: flex-1, max-h-..., min-h-0) */
  className?: string;
  /** Applied to the scrollable content area */
  contentClassName?: string;
  showTrack?: boolean;
}

/**
 * Vertical scroll container with a visible, draggable scroll strip.
 *
 * - Native touch swipe + mouse wheel scrolling still work.
 * - The right-side track + thumb reflect scroll progress and can be
 *   dragged/clicked to scrub — on mobile and desktop alike.
 * - The content itself can be grabbed and dragged with the mouse.
 */
export default function VerticalScrollView({
  children,
  className,
  contentClassName,
  showTrack = true,
}: VerticalScrollViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [thumbPercent, setThumbPercent] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{ y: number; scrollTop: number } | null>(null);
  const draggedRef = useRef(false);

  const updateProgress = useCallback(() => {
    const el = containerRef.current;
    const track = trackRef.current;
    if (!el) return;

    const max = el.scrollHeight - el.clientHeight;
    setCanScroll(max > 1);
    setProgress(max > 1 ? el.scrollTop / max : 0);

    if (track) {
      const ratio = el.clientHeight / Math.max(el.scrollHeight, 1);
      setThumbPercent(Math.max(ratio * 100, 6));
    }
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

    dragStartRef.current = { y: e.clientY, scrollTop: el.scrollTop };
    draggedRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    const el = containerRef.current;
    if (!start || !el) return;

    const dy = e.clientY - start.y;
    if (Math.abs(dy) > 5) draggedRef.current = true;
    el.scrollTop = start.scrollTop - dy;
  };

  const endDrag = () => {
    dragStartRef.current = null;
    setIsDragging(false);
  };

  /* Suppress clicks on controls after a drag gesture */
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false;
    }
  };

  /* ── Scrub via the visible strip ── */
  const scrubFromClientY = (clientY: number) => {
    const el = containerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const rect = track.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (clientY - rect.top) / Math.max(rect.height, 1)),
    );
    const max = el.scrollHeight - el.clientHeight;
    el.scrollTop = ratio * max;
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    scrubFromClientY(e.clientY);

    const move = (ev: PointerEvent) => scrubFromClientY(ev.clientY);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const thumbOffset = Math.max(
    0,
    progress * (100 - thumbPercent),
  );

  return (
    <div className={cn("flex min-h-0 overflow-hidden", className)}>
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={handleClickCapture}
        className={cn(
          "flex-1 overflow-y-auto no-scrollbar",
          isDragging &&
            "cursor-grabbing select-none [&_*]:pointer-events-none",
          !isDragging && "cursor-grab",
          contentClassName,
        )}
      >
        {children}
      </div>

      {showTrack && canScroll && (
        <div
          ref={trackRef}
          role="scrollbar"
          aria-label="Scroll content"
          onPointerDown={handleTrackPointerDown}
          className="relative w-1.5 ml-1.5 rounded-full bg-muted/60 dark:bg-white/10 cursor-pointer touch-pan-y flex-shrink-0"
        >
          <div
            className="absolute left-0 w-full rounded-full bg-primary"
            style={{
              height: `${thumbPercent}%`,
              top: `${thumbOffset}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
