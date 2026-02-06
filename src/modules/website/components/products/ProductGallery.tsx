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
            className="w-full h-full flex items-center justify-center p-3 md:p-6"
          >
            {isVideo(active) ? (
              <video
                src={active}
                autoPlay
                muted
                loop
                playsInline
                className="max-w-full max-h-full w-auto h-auto object-contain cursor-grab active:cursor-grabbing rounded-2xl md:rounded-3xl shadow-lg border border-white/20"
              />
            ) : (
              <img
                src={active}
                alt="Product View"
                className="max-w-full max-h-full w-auto h-auto object-contain select-none cursor-grab active:cursor-grabbing transition-transform duration-500 hover:scale-105 rounded-2xl md:rounded-3xl shadow-lg border border-white/20"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (Desktop) */}
        <div className="hidden md:block">
          {activeIndex > 0 && (
            <button
              onClick={() => paginate(-1)}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md shadow-xl text-foreground hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 border border-border/50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {activeIndex < images.length - 1 && (
            <button
              onClick={() => paginate(1)}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md shadow-xl text-foreground hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 border border-border/50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Overlay Tools */}
        <div className="absolute top-6 right-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={() => setIsFullScreen(true)}
            className="p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl text-foreground hover:bg-white hover:scale-110 transition-all border border-border/50"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Dots (Mobile) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 p-2 rounded-full bg-black/20 backdrop-blur-md md:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/40",
              )}
            />
          ))}
        </div>
      </div>

      {/* ─── Thumbnails ─── */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 transition-colors px-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300",
              i === activeIndex
                ? "border-primary shadow-lg shadow-primary/10 scale-95"
                : "border-transparent bg-muted/50 hover:border-primary/30",
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
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 md:p-10 h-[100dvh] w-screen overflow-hidden"
          >
            <button
              onClick={() => setIsFullScreen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[110]"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-full max-h-full flex items-center justify-center"
            >
              {isVideo(active) ? (
                <video
                  src={active}
                  controls
                  autoPlay
                  className="max-w-full max-h-[90vh] rounded-xl"
                />
              ) : (
                <img
                  src={active}
                  alt="Full view"
                  className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                />
              )}
            </motion.div>

            {/* Overlay Navigation */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(-1);
                }}
                disabled={activeIndex === 0}
                className={cn(
                  "p-4 rounded-full bg-white/10 text-white transition-all pointer-events-auto",
                  activeIndex === 0
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-white/20",
                )}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(1);
                }}
                disabled={activeIndex === images.length - 1}
                className={cn(
                  "p-4 rounded-full bg-white/10 text-white transition-all pointer-events-auto",
                  activeIndex === images.length - 1
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-white/20",
                )}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
