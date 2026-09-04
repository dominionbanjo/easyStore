import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import {
  buildCloudinaryUrl,
  isSlowConnection,
} from "@/utils/imageDelivery";

interface ProductGalleryProps {
  images: string[];
}

const DETAIL_WIDTH = 1600;
const SLOW_DETAIL_WIDTH = 800;
const SLOW_ZOOM_WIDTH = 1200;
const MAX_ZOOM = 3;

const getZoomUrl = (url: string, slow: boolean): string =>
  slow
    ? buildCloudinaryUrl(url, { width: SLOW_ZOOM_WIDTH, quality: "eco" })
    : buildCloudinaryUrl(url, { quality: "auto" });

const getDisplayUrl = (url: string, slow: boolean): string =>
  slow
    ? buildCloudinaryUrl(url, { width: SLOW_DETAIL_WIDTH, quality: "eco" })
    : buildCloudinaryUrl(url, { width: DETAIL_WIDTH, quality: "auto" });

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [highResIndex, setHighResIndex] = useState<number | null>(null);
  const [highResUrl, setHighResUrl] = useState<string | null>(null);

  const zoomedRef = useRef(false);
  const transformRef = useRef<ReactZoomPanPinchContentRef | null>(null);
  const savedScrollY = useRef(0);

  const watchDrag = useCallback(() => !zoomedRef.current, []);

  const carouselOptions = useMemo(
    () => ({ containScroll: "keepSnaps" as const, watchDrag }),
    [watchDrag],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions);
  const [fullscreenEmblaRef, fullscreenEmblaApi] =
    useEmblaCarousel(carouselOptions);

  const isVideo = (src: string) => src.endsWith(".mp4");

  /* ─── MAIN CAROUSEL SYNC ─── */
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  /* ─── FULLSCREEN CAROUSEL SYNC + HQ PRELOAD ─── */
  useEffect(() => {
    if (!fullscreenEmblaApi || !isFullScreen) return;

    const onSelect = () => {
      const index = fullscreenEmblaApi.selectedScrollSnap();
      setFullscreenIndex(index);
      transformRef.current?.resetTransform(0);
    };
    fullscreenEmblaApi.on("select", onSelect);
    fullscreenEmblaApi.scrollTo(fullscreenIndex, true);
    onSelect();
    return () => {
      fullscreenEmblaApi.off("select", onSelect);
    };
  }, [fullscreenEmblaApi, isFullScreen, fullscreenIndex]);

  useEffect(() => {
    if (!isFullScreen) return;
    const url = images[fullscreenIndex];
    if (!url || isVideo(url)) {
      setHighResIndex(null);
      setHighResUrl(null);
      return;
    }
    const zoomUrl = getZoomUrl(url, isSlowConnection());
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      setHighResIndex(fullscreenIndex);
      setHighResUrl(zoomUrl);
    };
    image.onerror = () => {
      setHighResIndex(null);
      setHighResUrl(null);
    };
    image.src = zoomUrl;
    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [isFullScreen, fullscreenIndex, images]);

  /* ─── BACK BUTTON TO CLOSE FULLSCREEN ─── */
  useEffect(() => {
    if (!isFullScreen) return;

    // Save scroll position before locking body overflow.
    savedScrollY.current = window.scrollY;
    document.body.style.overflow = "hidden";

    window.history.pushState({ modal: "gallery-fullscreen" }, "");

    const handlePopState = () => {
      setIsFullScreen(false);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.body.style.overflow = "unset";
      // Restore scroll position after unlocking body overflow.
      window.scrollTo(0, savedScrollY.current);
    };
  }, [isFullScreen]);

  const closeFullScreen = () => {
    if (isFullScreen) {
      if (window.history.state?.modal === "gallery-fullscreen") {
        window.history.back();
      }
      setIsFullScreen(false);
    }
  };

  const openFullScreen = (index: number) => {
    setFullscreenIndex(index);
    setIsFullScreen(true);
  };

  const scrollToMain = (index: number) => {
    emblaApi?.scrollTo(index);
    setActiveIndex(index);
  };

  const handleTransformed = (scale: number) => {
    zoomedRef.current = scale > 1.01;
  };

  const fullScreenContent = (
    <>
      {isFullScreen && (
        <div className="fixed inset-0 z-[1000000] flex flex-col items-center justify-center h-[100dvh] w-screen overflow-hidden touch-none bg-black"
          onClick={closeFullScreen}
        >
          {/* Close Button - Centered at top */}
          <div className="absolute top-0 left-0 w-full p-8 flex justify-center z-[1000001] pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFullScreen();
              }}
              className="p-4 rounded-sm bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20  backdrop-blur-md active:scale-95 group pointer-events-auto"
            >
              <X className="w-8 h-8 transition-transform group-hover:rotate-90" />
            </button>
          </div>

          {/* Media Container */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12">
            <div
              className="w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div ref={fullscreenEmblaRef} className="overflow-hidden w-full h-full flex items-center touch-none">
                <div className="flex h-full">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center"
                    >
                      {isVideo(image) ? (
                        <video
                          src={image}
                          controls
                          autoPlay
                          className="max-w-full max-h-full object-contain rounded-sm border border-white/5"
                        />
                      ) : (
                        <TransformWrapper
                          ref={transformRef}
                          minScale={1}
                          maxScale={MAX_ZOOM}
                          centerZoomedOut
                          wheel={{ step: 0.35 }}
                          doubleClick={{ mode: "toggle", step: 2 }}
                          onTransform={(_, state) =>
                            handleTransformed(state.scale)
                          }
                        >
                          <TransformComponent
                            wrapperStyle={{ width: "100%", height: "100%" }}
                            contentStyle={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={
                                highResIndex === index && highResUrl
                                  ? highResUrl
                                  : getDisplayUrl(image, isSlowConnection())
                              }
                              alt="Full view"
                              decoding="async"
                              draggable={false}
                              className="max-w-full max-h-full object-contain rounded-sm md:rounded-sm select-none"
                            />
                          </TransformComponent>
                        </TransformWrapper>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-10 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fullscreenEmblaApi?.scrollPrev();
                }}
                disabled={fullscreenIndex === 0}
                className={cn(
                  "p-4 md:p-6 rounded-sm bg-white/5 hover:bg-white/10 backdrop-blur-md text-white  transition-all pointer-events-auto border border-white/10 active:scale-90",
                  fullscreenIndex === 0 &&
                    "opacity-0 invisible pointer-events-none",
                )}
              >
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 stroke-[2.5px]" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fullscreenEmblaApi?.scrollNext();
                }}
                disabled={fullscreenIndex === images.length - 1}
                className={cn(
                  "p-4 md:p-6 rounded-sm bg-white/5 hover:bg-white/10 backdrop-blur-md text-white  transition-all pointer-events-auto border border-white/10 active:scale-90",
                  fullscreenIndex === images.length - 1 &&
                    "opacity-0 invisible pointer-events-none",
                )}
              >
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10 stroke-[2.5px]" />
              </button>
            </div>
          </div>

          {/* Pagination / Status */}
          <div className="absolute bottom-10 flex flex-col items-center gap-4">
            <div className="flex gap-2.5 p-2 rounded-sm bg-white/5 backdrop-blur-md border border-white/10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    fullscreenEmblaApi?.scrollTo(i);
                  }}
                  className={cn(
                    "h-1.5 rounded-sm transition-all duration-300",
                    i === fullscreenIndex
                      ? "w-8 bg-white"
                      : "w-1.5 bg-white/60 hover:bg-white/40",
                  )}
                />
              ))}
            </div>
            <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em]">
              {fullscreenIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );

  if (!images?.length) return null;

  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-10 h-fit w-full">
      {/* ─── Main Display ─── */}
      <div
        className="group relative w-full aspect-square md:aspect-[4/5] rounded-sm md:rounded-sm overflow-hidden bg-muted/50 border border-border/60 touch-pan-y cursor-pointer"
        onClick={() => openFullScreen(activeIndex)}
      >
        <div ref={emblaRef} className="w-full h-full overflow-hidden">
          <div className="flex h-full touch-pan-y">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 w-full h-full"
              >
                {isVideo(image) ? (
                  <video
                    src={image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover rounded-sm md:rounded-sm border border-white/20"
                  />
                ) : (
                  <OptimizedImage
                    src={image}
                    alt="Product View"
                    recipe="DETAIL"
                    widths={isSlowConnection() ? [SLOW_DETAIL_WIDTH] : undefined}
                    aspectRatio="auto"
                    className="w-full h-full object-cover rounded-sm md:rounded-sm border border-white/20 transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows (Desktop) */}
        <div className="hidden md:block">
          {activeIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                scrollToMain(activeIndex - 1);
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-sm bg-white/90 backdrop-blur-xl  text-zinc-900 hover:bg-white hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 border border-white/50 ring-1 ring-black/5"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
            </button>
          )}
          {activeIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                scrollToMain(activeIndex + 1);
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-sm bg-white/90 backdrop-blur-xl  text-zinc-900 hover:bg-white hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 border border-white/50 ring-1 ring-black/5"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5px]" />
            </button>
          )}
        </div>

        {/* Overlay Tools */}
        <div className="absolute top-6 right-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openFullScreen(activeIndex);
            }}
            className="p-3 rounded-sm bg-white/90 backdrop-blur-xl  text-zinc-900 hover:bg-white hover:scale-110 active:scale-95 transition-all border border-white/50 ring-1 ring-black/5"
          >
            <Maximize2 className="w-4 h-4 stroke-[2.5px]" />
          </button>
        </div>

        {/* Progress Dots (Mobile) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 p-2 rounded-sm bg-black/40 backdrop-blur-md md:hidden border border-white/10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                scrollToMain(i);
              }}
              className={cn(
                "h-1.5 rounded-sm transition-all duration-300 ",
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
            onClick={() => scrollToMain(i)}
            className={cn(
              "relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-sm overflow-hidden border-2 transition-all duration-300",
              i === activeIndex
                ? "border-primary   scale-95"
                : "border-border/40 bg-muted/50 hover:border-primary/30",
            )}
          >
            {isVideo(img) ? (
              <video src={img} className="w-full h-full object-cover" />
            ) : (
              <OptimizedImage
                src={img}
                alt=""
                recipe="THUMBNAIL"
                aspectRatio="1 / 1"
                className="w-full h-full object-cover"
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
