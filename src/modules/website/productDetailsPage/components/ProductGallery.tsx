"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  const isVideo = (src: string) => src.endsWith(".mp4");

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
        {isVideo(active) ? (
          <video
            src={active}
            controls
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <motion.img
            key={active}
            src={active}
            alt=""
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "aspect-square rounded-lg overflow-hidden border transition-all",
              i === activeIndex
                ? "border-primary ring-1 ring-primary"
                : "border-transparent hover:border-gray-300"
            )}
          >
            {isVideo(img) ? (
              <video src={img} className="w-full h-full object-cover" />
            ) : (
              <img src={img} alt="" className="w-full h-full object-cover" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
