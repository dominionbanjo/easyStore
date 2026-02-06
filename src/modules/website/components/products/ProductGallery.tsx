import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const active = images[activeIndex];

  // 🔒 Lock scroll when full screen
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFullScreen]);

  if (!images?.length) return null;

  const isVideo = (src: string) => src.endsWith(".mp4");

  const paginate = useCallback(
    (newDirection: number) => {
      const nextIndex = activeIndex + newDirection;
      if (nextIndex >= 0 && nextIndex < images.length) {
        setActiveIndex(nextIndex);
      }
    },
    [activeIndex, images.length],
  );

  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-10 h-fit w-full max-w-[650px]">
      {/* ─── Main Display ─── */}
      <div className="group relative w-full aspect-square md:aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-muted/50 border border-border/60 shadow-2xl shadow-primary/5 touch-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const swipe = info.offset.x;
              if (swipe < -50) paginate(1);
              else if (swipe > 50) paginate(-1);
            }}
            className="w-full h-full"
          >
            {isVideo(active) ? (
              <video
                src={active}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover cursor-grab active:cursor-grabbing rounded-2xl md:rounded-3xl shadow-lg border border-white/20"
              />
            ) : (
              <img
                src={active}
                alt="Product View"
                className="w-full h-full object-cover select-none cursor-grab active:cursor-grabbing transition-transform duration-500 hover:scale-105 rounded-2xl md:rounded-3xl shadow-lg border border-white/20"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (Desktop) */}
        <div className="hidden md:block">
          {activeIndex > 0 && (
            <button
              onClick={() => paginate(-1)}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl text-zinc-900 hover:bg-white hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 border border-white/50 ring-1 ring-black/5"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
            </button>
          )}
          {activeIndex < images.length - 1 && (
            <button
              onClick={() => paginate(1)}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl text-zinc-900 hover:bg-white hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 border border-white/50 ring-1 ring-black/5"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5px]" />
            </button>
          )}
        </div>

        {/* Overlay Tools */}
        <div className="absolute top-6 right-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={() => setIsFullScreen(true)}
            className="p-3 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl text-zinc-900 hover:bg-white hover:scale-110 active:scale-95 transition-all border border-white/50 ring-1 ring-black/5"
          >
            <Maximize2 className="w-4 h-4 stroke-[2.5px]" />
          </button>
        </div>

        {/* Progress Dots (Mobile) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 p-2 rounded-full bg-black/40 backdrop-blur-md md:hidden border border-white/10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                i === activeIndex
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/40 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      </div>

      {/* ─── Thumbnails ─── */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar px-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300",
              i === activeIndex
                ? "border-primary shadow-lg shadow-primary/10 scale-95"
                : "border-border/40 bg-muted/50 hover:border-primary/30",
            )}
          >
            {isVideo(img) ? (
              <video src={img} className="w-full h-full object-cover" />
            ) : (
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover select-none"
              />
            )}
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-300 bg-primary/10",
                i === activeIndex ? "opacity-0" : "opacity-0 hover:opacity-100",
              )}
            />
          </button>
        ))}
      </div>

      {/* ─── Full Screen Overlay ─── */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/98 flex items-center justify-center p-0 md:p-10 h-[100dvh] w-screen overflow-hidden touch-none"
          >
            <button
              onClick={() => setIsFullScreen(false)}
              className="absolute top-6 right-6 p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 active:scale-95 transition-all z-[110] border border-white/10 shadow-2xl"
            >
              <X className="w-7 h-7" />
            </button>

            <motion.div
              key={`fullscreen-${activeIndex}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                const swipe = info.offset.x;
                if (swipe < -70) paginate(1);
                else if (swipe > 70) paginate(-1);
              }}
              className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              {isVideo(active) ? (
                <video
                  src={active}
                  controls
                  autoPlay
                  className="max-w-full max-h-[90vh] md:rounded-xl shadow-2xl"
                />
              ) : (
                <img
                  src={active}
                  alt="Full view"
                  className="max-w-full max-h-screen md:max-h-[85vh] object-contain md:rounded-xl shadow-2xl select-none"
                />
              )}
            </motion.div>

            {/* Overlay Navigation (High contrast refined icons) */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-10 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(-1);
                }}
                disabled={activeIndex === 0}
                className={cn(
                  "p-4 md:p-5 rounded-full bg-white/15 backdrop-blur-xl text-white shadow-2xl transition-all pointer-events-auto border border-white/20 active:scale-90",
                  activeIndex === 0
                    ? "opacity-0 cursor-not-allowed"
                    : "hover:bg-white/25 hover:scale-110 shadow-white/5",
                )}
              >
                <ChevronLeft className="w-8 h-8 md:w-9 md:h-9 stroke-[2.2px]" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(1);
                }}
                disabled={activeIndex === images.length - 1}
                className={cn(
                  "p-4 md:p-5 rounded-full bg-white/15 backdrop-blur-xl text-white shadow-2xl transition-all pointer-events-auto border border-white/20 active:scale-90",
                  activeIndex === images.length - 1
                    ? "opacity-0 cursor-not-allowed"
                    : "hover:bg-white/25 hover:scale-110 shadow-white/5",
                )}
              >
                <ChevronRight className="w-8 h-8 md:w-9 md:h-9 stroke-[2.2px]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
