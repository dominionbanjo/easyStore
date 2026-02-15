import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

import { createPortal } from "react-dom";

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

  const fullScreenContent = (
    <AnimatePresence>
      {isFullScreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000000] flex flex-col items-center justify-center h-[100dvh] w-screen overflow-hidden touch-none bg-black"
          onClick={() => setIsFullScreen(false)}
        >
          {/* Close Button - Centered at top */}
          <div className="absolute top-0 left-0 w-full p-8 flex justify-center z-[1000001] pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullScreen(false);
              }}
              className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 shadow-2xl backdrop-blur-md active:scale-95 group pointer-events-auto"
            >
              <X className="w-8 h-8 transition-transform group-hover:rotate-90" />
            </button>
          </div>

          {/* Media Container */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12">
            <motion.div
              key={`fullscreen-${activeIndex}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={(_, info) => {
                const swipe = info.offset.x;
                if (swipe < -60) paginate(1);
                else if (swipe > 60) paginate(-1);
              }}
              className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideo(active) ? (
                <video
                  src={active}
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/5"
                />
              ) : (
                <img
                  src={active}
                  alt="Full view"
                  className="max-w-full max-h-full object-contain rounded-xl md:rounded-3xl shadow-2xl select-none"
                />
              )}
            </motion.div>

            {/* Navigation Arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-10 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(-1);
                }}
                disabled={activeIndex === 0}
                className={cn(
                  "p-4 md:p-6 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md text-white shadow-2xl transition-all pointer-events-auto border border-white/10 active:scale-90",
                  activeIndex === 0 &&
                    "opacity-0 invisible pointer-events-none",
                )}
              >
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 stroke-[2.5px]" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(1);
                }}
                disabled={activeIndex === images.length - 1}
                className={cn(
                  "p-4 md:p-6 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md text-white shadow-2xl transition-all pointer-events-auto border border-white/10 active:scale-90",
                  activeIndex === images.length - 1 &&
                    "opacity-0 invisible pointer-events-none",
                )}
              >
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10 stroke-[2.5px]" />
              </button>
            </div>
          </div>

          {/* Pagination / Status */}
          <div className="absolute bottom-10 flex flex-col items-center gap-4">
            <div className="flex gap-2.5 p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(i);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === activeIndex
                      ? "w-8 bg-white"
                      : "w-1.5 bg-white/20 hover:bg-white/40",
                  )}
                />
              ))}
            </div>
            <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em]">
              {activeIndex + 1} / {images.length}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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

      {/* ─── Full Screen Overlay Rendering via Portal ─── */}
      {createPortal(fullScreenContent, document.body)}
    </div>
  );
}
