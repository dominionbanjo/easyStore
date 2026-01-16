import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Mail, Phone, Globe, Store } from "lucide-react";

/* ───────────────── TYPES ───────────────── */

type StoreHeaderProps = {
  store: {
    id: string;
    name: string;
    banner?: string;
    logo?: string;
    description?: string;
    rating?: number;
    location?: string;
    email?: string;
    phone?: string;
    website?: string;
    totalProducts?: number;
  };
};

/* ───────────────── COMPONENT ───────────────── */

export default function StoreHeaderSection({ store }: StoreHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-background shadow-sm rounded-t-3xl overflow-hidden border-b border-border"
    >
      {/* ─── BANNER ─── */}
      <div className="relative h-56 sm:h-72 w-full bg-muted">
        {store.banner ? (
          <img
            src={store.banner}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Store className="h-12 w-12 opacity-40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* ─── CONTENT ─── */}
      <div className="max-w-6xl mx-auto px-6 py-6 sm:py-10 relative -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end gap-6">
          {/* ─── LOGO ─── */}
          <div className="w-28 h-28 rounded-xl overflow-hidden border-4 border-background shadow-lg bg-background">
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Store className="h-8 w-8 opacity-40" />
              </div>
            )}
          </div>

          {/* ─── DETAILS ─── */}
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {store.name}
            </h1>

            <div className="flex items-center flex-wrap gap-3 text-muted-foreground text-sm">
              {store.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{store.location}</span>
                </div>
              )}

              {typeof store.rating === "number" && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-amber-500" />
                    <span className="font-medium text-foreground">
                      {store.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                </>
              )}

              {typeof store.totalProducts === "number" && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <Badge
                    variant="outline"
                    className="bg-muted/40 text-foreground border-border"
                  >
                    {store.totalProducts} Products
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ─── DESCRIPTION ─── */}
        {store.description && (
          <p className="mt-6 text-muted-foreground max-w-3xl leading-relaxed text-sm sm:text-base">
            {store.description}
          </p>
        )}

        {/* ─── CONTACT ACTIONS ─── */}
        <div className="mt-8 flex flex-wrap gap-3">
          {store.email && (
            <Button variant="outline" className="rounded-full">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              {store.email}
            </Button>
          )}

          {store.phone && (
            <Button variant="outline" className="rounded-full">
              <Phone className="h-4 w-4 mr-2 text-primary" />
              {store.phone}
            </Button>
          )}

          {store.website && (
            <Button asChild variant="outline" className="rounded-full">
              <a href={store.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2 text-primary" />
                Visit Website
              </a>
            </Button>
          )}

          <Button className="rounded-full text-white">
            <Store className="h-4 w-4 mr-2" />
            Follow Store
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
