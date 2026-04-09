import { Link } from "react-router-dom";
import { Star, MapPin, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Address {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
}

interface StoreCardProps {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  rating: number;
  totalProducts: number;
  address?: string | Address | null;
  className?: string;
  coverImage?: string | null;
}

export default function StoreCard({
  name,
  slug,
  description,
  logo,
  rating,
  totalProducts,
  address,
  className,
  coverImage,
}: StoreCardProps) {
  const formattedAddress =
    typeof address === "object" && address !== null
      ? [address.city, address.state].filter(Boolean).join(", ")
      : address;

  const bannerImage = coverImage || "/images/defaultbanner.png";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn("h-full group", className)}
    >
      <Link to={`/stores/${slug}`} className="block h-full">
        <Card className="relative h-full overflow-hidden border-border/40 bg-card p-0  hover: hover: transition-all duration-300 rounded-sm">
          {/* ─── BANNER AREA ─── */}
          <div
            className="h-24 w-full bg-cover bg-center transition-all duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${bannerImage})` }}
          />

          {/* ─── LOGO (FLOATING) ─── */}
          <div className="absolute top-12 left-5 z-10">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-card  rounded-sm ring-1 ring-border/10 transition-transform duration-300 group-hover:scale-105 bg-background">
                <AvatarImage
                  src={logo || ""}
                  alt={name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black rounded-sm">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {rating >= 4.5 && (
                <div
                  className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-1 rounded-sm  border-2 border-card"
                  title="Top Rated"
                >
                  <Star className="w-3 h-3 fill-current" />
                </div>
              )}
            </div>
          </div>

          {/* ─── CONTENT ─── */}
          <div className="px-5 pt-12 pb-5 flex flex-col h-[calc(100%-96px)]">
            <div className="flex-1 space-y-3">
              {/* Name & Badge */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-lg text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                </div>

                {formattedAddress && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                    <MapPin className="h-3 w-3 shrink-0 text-primary/60" />
                    <span className="truncate max-w-[180px]">
                      {formattedAddress}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {description ? (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground/50 italic">
                  Explore products from {name}...
                </p>
              )}
            </div>

            {/* ─── FOOTER META ─── */}
            <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 bg-secondary/30 px-2 py-1 rounded-sm">
                  <Package className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground/80">
                    {totalProducts}{" "}
                    <span className="text-muted-foreground font-normal">
                      items
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2 py-1 rounded-sm">
                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                  <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">
                    {rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
