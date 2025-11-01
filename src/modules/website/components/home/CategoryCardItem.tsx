import { useState } from "react";
import { toast } from "sonner";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  name: string;
  thumbnail: string; // can be image or video
  seller?: string;
  purchases?: number;
  likes?: number;
}

export default function CategoryCard({
  name,
  thumbnail,
  seller = "Dominion",
  purchases = 12000,
  likes = 76,
}: CategoryCardProps) {
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const next = !liked;
    setLiked(next);
    toast.info(next ? "Added to favorites ❤️" : "Removed from favorites 💔", {
      duration: 2000,
    });
  };

  // Detect video type from file extension
  const isVideo = /\.(mp4|webm|ogg)$/i.test(thumbnail);

  return (
    <div className="group relative w-full max-w-sm cursor-pointer overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:shadow-lg">
      {/* ─────── Media Layer (Auto-detect image or video) ─────── */}
      <div className="relative h-[26rem] w-full overflow-hidden">
        {isVideo ? (
          <video
            src={thumbnail}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={thumbnail}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-700 group-hover:opacity-100" />

        {/* Like Button (top-right) */}
        <motion.button
          onClick={handleLike}
          aria-label="Toggle favorite"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-all hover:bg-white group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-3"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              liked ? "fill-red-500 text-red-500" : "text-gray-700"
            }`}
          />
        </motion.button>

        {/* Always-visible title */}
        <div className="absolute bottom-4 left-4 z-10 text-white">
          <h3 className="text-xl font-semibold leading-tight">{name}</h3>
          <p className="text-sm font-medium opacity-90">Story (series)</p>
        </div>

        {/* Hover Footer Reveal */}
        <div
          className="
            absolute bottom-0 left-0 z-10 w-full 
            translate-y-full opacity-0 
            transition-all duration-500 ease-out 
            group-hover:translate-y-0 group-hover:opacity-100
            bg-black/50 backdrop-blur-md px-5 py-4
            flex items-center justify-between text-white
          "
        >
          {/* Seller Info */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{seller}</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs font-medium">
              Seller
            </span>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={handleLike}
              className="rounded-full p-1.5 shadow-sm transition-all"
            >
              <Heart
                className={`h-5 w-5 ${
                  liked ? "fill-white text-white" : "text-white/80"
                }`}
              />
            </button>
            <span>{likes}</span>

            <div className="flex items-center gap-1">
              <ShoppingCart className="h-4 w-4 text-white/80" />
              <span>{purchases / 1000}k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
