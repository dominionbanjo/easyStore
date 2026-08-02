import { Link } from "react-router-dom";
import { MapPin, GraduationCap, Store } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ZoneCardProps {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  tagline?: string | null;
  description?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  state?: string | null;
  location?: string | null;
  memberCount: number;
  className?: string;
}

const formatCount = (value: number): string =>
  value >= 1000
    ? new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value)
    : String(value);

export default function ZoneCard({
  name,
  slug,
  tagline,
  description,
  coverImage,
  state,
  location,
  memberCount,
  className,
}: ZoneCardProps) {
  const bannerImage = coverImage || "/images/defaultbanner.png";
  const locationLabel = [location, state].filter(Boolean).join(", ");

  return (
    <div
      className={cn(
        "h-full group hover:-translate-y-1.5 transition-transform duration-300",
        className
      )}
    >
      <Link to={`/zones/${slug}`} className="block h-full">
        <Card className="relative h-full overflow-hidden border-border/40 bg-card p-0 transition-all duration-300 rounded-sm">
          {/* ─── BANNER AREA ─── */}
          <div
            className="h-16 sm:h-20 w-full bg-cover bg-center transition-all duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${bannerImage})` }}
          />

          {/* ─── CONTENT ─── */}
          <div className="px-3 pt-3 pb-3 flex flex-col h-[calc(100%-64px)] sm:h-[calc(100%-80px)]">
            <div className="flex-1 space-y-2.5">
              <div className="space-y-1">
                <h3
                  title={name}
                  className="font-bold text-sm sm:text-base text-card-foreground line-clamp-1 break-words min-w-0 group-hover:text-primary transition-colors"
                >
                  {name}
                </h3>

                {locationLabel && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 min-w-0">
                    <MapPin className="h-3 w-3 shrink-0 text-primary/60" />
                    <span className="truncate min-w-0">{locationLabel}</span>
                  </div>
                )}
              </div>

              {tagline ? (
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 break-words leading-relaxed">
                  {tagline}
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground/50 italic truncate">
                  {description || `Shop from ${name} vendors...`}
                </p>
              )}
            </div>

            {/* ─── FOOTER META ─── */}
            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-center gap-2 min-w-0">
              <div
                title={`${memberCount} stores in this zone`}
                className="flex items-center gap-1.5 bg-secondary/30 px-2 py-1 rounded-sm whitespace-nowrap truncate min-w-0 max-w-full"
              >
                <Store className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="text-xs font-semibold text-foreground/80">
                  {formatCount(memberCount)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-1 rounded-sm shrink-0 whitespace-nowrap">
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold text-primary">
                  School Zone
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
