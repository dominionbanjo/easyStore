import { Link } from "react-router-dom";
import { Star, MapPin, Package } from "lucide-react";

interface StoreCardProps {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  rating: number;
  totalProducts: number;
  address?: string | null;
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
  return (
    <Link
      to={`/stores/${slug}`}
      className="group block rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all h-[200px]"
    >
      <div className="p-5 space-y-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
            {logo ? (
              <img
                src={logo}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-muted-foreground">
                {name.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{name}</p>
            {address && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {address}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>{totalProducts} products</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
