import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Star,
  MapPin,
  Mail,
  Phone,
  Globe,
  Store,
  Share2,
  ShieldCheck,
} from "lucide-react";

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

export default function StoreHeaderSection({ store }: StoreHeaderProps) {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Store link copied to clipboard!");
  };

  return (
    <div className="w-full bg-background pb-8">
      {/* ─── BANNER ─── */}
      <div className="relative h-48 md:h-64 w-full bg-muted overflow-hidden">
        {store.banner ? (
          <img
            src={store.banner}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center">
            <Store className="h-16 w-16 text-primary/20" />
          </div>
        )}
      </div>

      {/* ─── INFO SECTION ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-20 flex flex-col md:flex-row gap-6 md:items-end">
          {/* Logo */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl border-4 border-background bg-background shadow-sm overflow-hidden flex items-center justify-center">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-primary/20">
                  {store.name?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            {/* Verified Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-800 border-emerald-200"
              >
                <ShieldCheck className="w-3 h-3 mr-1" /> Verified
              </Badge>
            </div>
          </div>

          {/* Text Info */}
          <div className="flex-1 pb-2 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-foreground">{store.name}</h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
              {store.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {store.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Store className="w-4 h-4" />
                {store.totalProducts} Products
              </div>
              <div className="flex items-center gap-1 text-amber-600 font-medium">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {store.rating?.toFixed(1) ?? "0.0"} Rating
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pb-4 justify-center md:justify-end">
            {store.email && (
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                title="Email"
                onClick={() => window.open(`mailto:${store.email}`)}
              >
                <Mail className="w-4 h-4" />
              </Button>
            )}
            {store.phone && (
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                title="Call"
                onClick={() => window.open(`tel:${store.phone}`)}
              >
                <Phone className="w-4 h-4" />
              </Button>
            )}
            {store.website && (
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                title="Website"
                onClick={() => window.open(store.website, "_blank")}
              >
                <Globe className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              title="Share"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 max-w-4xl">
          <p className="text-muted-foreground leading-relaxed">
            {store.description}
          </p>
        </div>
      </div>
    </div>
  );
}
