import { Link } from "react-router-dom";
import { Star, MapPin, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
}

export default function StoreCard({
  name,
  slug,
  description,
  logo,
  rating,
  totalProducts,
  address,
}: StoreCardProps) {
  const formattedAddress =
    typeof address === "object" && address !== null
      ? [address.city, address.state].filter(Boolean).join(", ")
      : address;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link to={`/stores/${slug}`} className="block h-full">
        <Card className="relative h-full overflow-hidden border-none bg-white p-0 shadow-sm hover:shadow-xl transition-all duration-300">
          {/* ─── BANNER / HEADER ─── */}
          <div className="h-20 w-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />

          {/* ─── LOGO (OVERLAPPING) ─── */}
          <div className="absolute top-10 left-5">
            <Avatar className="h-16 w-16 border-4 border-white shadow-md rounded-2xl">
              <AvatarImage
                src={logo || ""}
                alt={name}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold rounded-2xl">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* ─── CONTENT ─── */}
          <div className="px-5 pt-8 pb-5 flex flex-col h-[calc(100%-80px)]">
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                  {name}
                </h3>
                {rating > 4.5 && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-700 border-none px-1.5 py-0"
                  >
                    Top
                  </Badge>
                )}
              </div>

              {formattedAddress && (
                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{formattedAddress}</span>
                </p>
              )}

              {description && (
                <p className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed italic">
                  "{description}"
                </p>
              )}
            </div>

            {/* ─── FOOTER META ─── */}
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 stroke-yellow-400" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {rating.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-primary/60" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {totalProducts} products
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                Visit <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
