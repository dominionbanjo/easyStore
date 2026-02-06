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
    user?: {
      first_name: string;
      last_name: string;
      username: string;
      avatar: string | null;
    };
  };
};

export default function StoreHeaderSection({ store }: StoreHeaderProps) {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Store link copied to clipboard!");
  };

  const vendorName = store.user
    ? `${store.user.first_name} ${store.user.last_name}`
    : store.name;

  const initials = vendorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const displayLogo = store.user?.avatar || store.logo;

  return (
    <div className="w-full bg-background relative overflow-hidden rounded-t-[3.5rem]">
      {/* ─── BANNER ─── */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden group rounded-t-[3.5rem]">
        <img
          src={store.banner || "/images/defaultbanner.png"}
          alt={store.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle Bottom Fade for blending */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ─── INFO SECTION ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="relative -mt-24 sm:-mt-28 flex flex-col md:flex-row gap-4 items-center md:items-end">
          {/* Logo / Profile Picture Container */}
          <div className="relative group shrink-0">
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-[2.5rem] border-[6px] border-background bg-background shadow-2xl overflow-hidden flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]">
              {displayLogo ? (
                <img
                  src={displayLogo}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary via-primary/80 to-emerald-600 flex items-center justify-center">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            {/* Verified Badge */}
            <div className="absolute -bottom-2 -right-2">
              <div className="bg-emerald-500 text-white p-2 rounded-2xl shadow-lg shadow-emerald-500/30 ring-4 ring-background">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Text Info */}
          <div className="flex-1 pb-2 text-center md:text-left space-y-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20 font-bold py-1"
                >
                  Official Store
                </Badge>
                {store.totalProducts! > 50 && (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/5 text-amber-600 border-amber-500/20 font-bold py-1"
                  >
                    Top Rated
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight drop-shadow-sm">
                {store.name}
              </h1>
              {store.user && (
                <p className="text-sm font-bold text-muted-foreground/60 tracking-widest uppercase">
                  Managed by {vendorName}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    {store.location || "Online Everywhere"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                  <Store className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    {store.totalProducts} Products
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 px-3 py-1.5 rounded-full border border-amber-500/20">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-bold">
                    {store.rating?.toFixed(1) ?? "0.0"} Rating
                  </span>
                </div>
              </div>

              {/* Description Section (Moved up) */}
              {store.description && (
                <div className="bg-muted/20 p-4 rounded-[2rem] border border-border/30 relative mt-1 w-full max-w-2xl mx-auto md:mx-0">
                  <div className="absolute -top-3 left-6 bg-background px-3 py-0.5 rounded-full border border-border/50 text-[9px] uppercase font-black tracking-widest text-muted-foreground">
                    About Store
                  </div>
                  <p className="text-foreground/70 leading-snug text-base font-medium italic">
                    "{store.description}"
                  </p>
                </div>
              )}

              {/* Actions (Integrated into flow) */}
              <div className="flex gap-3 justify-center md:justify-start">
                <div className="flex bg-muted/30 p-1.5 rounded-3xl border border-border/50 backdrop-blur-sm gap-2">
                  {store.email && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors h-11 w-11"
                      title="Email"
                      onClick={() => window.open(`mailto:${store.email}`)}
                    >
                      <Mail className="w-5 h-5" />
                    </Button>
                  )}
                  {store.phone && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors h-11 w-11"
                      title="Call"
                      onClick={() => window.open(`tel:${store.phone}`)}
                    >
                      <Phone className="w-5 h-5" />
                    </Button>
                  )}
                  {store.website && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors h-11 w-11"
                      title="Website"
                      onClick={() => window.open(store.website, "_blank")}
                    >
                      <Globe className="w-5 h-5" />
                    </Button>
                  )}
                  <div className="w-px h-8 bg-border/50 self-center mx-1" />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors h-11 w-11"
                    title="Share"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
