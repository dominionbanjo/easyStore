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
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  Info,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
    social_links?: Record<string, string>;
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

  const initials =
    vendorName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "ST";

  const displayLogo = store.user?.avatar || store.logo;

  return (
    <div className="w-full bg-background relative rounded-sm md:rounded-md xl:rounded-t-[2.5rem] pb-8 md:pb-12">
      {/* ─── BANNER ─── */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden group rounded-md">
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
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* 🖼️ Logo / Profile Picture Container (Overlapping) */}
          <div className="relative group shrink-0 -mt-20 sm:-mt-24 z-30">
            <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-3xl sm:rounded-[2.5rem] border-[6px] border-background bg-background shadow-2xl overflow-hidden flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]">
              {displayLogo ? (
                <img
                  src={displayLogo}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary via-primary/80 to-emerald-600 flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            {/* Verified Badge */}
            <div className="absolute -bottom-2 -right-2 z-40">
              <div className="bg-emerald-500 text-white p-2 sm:p-2.5 rounded-2xl shadow-lg shadow-emerald-500/30 ring-4 ring-background">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          {/* 📝 Text Info (Pushed Below Banner Line) */}
          <div className="flex-1 pt-4 pb-2 text-center md:text-left space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20 font-bold py-1 px-4 rounded-full"
                >
                  Official Store
                </Badge>
                {store.totalProducts! > 50 && (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold py-1 px-4 rounded-full"
                  >
                    Top Rated
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
                  {store.name}
                </h1>
                {store.user && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-primary/10 h-10 w-10 shrink-0"
                      >
                        <Info className="w-6 h-6 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-6 rounded-[2.5rem] border-border/50 shadow-2xl backdrop-blur-xl bg-background/95">
                      <div className="space-y-5">
                        <div className="flex items-center gap-4 border-b border-border/50 pb-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
                            {store.user?.avatar ? (
                              <img
                                src={store.user.avatar}
                                className="w-full h-full object-cover"
                                alt={vendorName}
                              />
                            ) : (
                              <span className="text-xl font-bold text-primary">
                                {initials}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-0.5">
                              Verified Vendor
                            </p>
                            <h4 className="font-bold text-lg leading-tight text-foreground">
                              {vendorName}
                            </h4>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground px-1">
                            Contact Details
                          </p>
                          <div className="space-y-1">
                            {store.phone && (
                              <button
                                onClick={() =>
                                  window.open(`tel:${store.phone}`)
                                }
                                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-primary/5 transition-colors text-sm font-bold group text-foreground"
                              >
                                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                  <Phone className="w-4 h-4" />
                                </div>
                                {store.phone}
                              </button>
                            )}
                            {store.email && (
                              <button
                                onClick={() =>
                                  window.open(`mailto:${store.email}`)
                                }
                                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-primary/5 transition-colors text-sm font-bold group text-foreground"
                              >
                                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                  <Mail className="w-4 h-4" />
                                </div>
                                {store.email}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                <div className="flex items-center gap-2 text-foreground bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-semibold">
                    {store.location || "Online Everywhere"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-foreground bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm">
                  <Store className="w-4 h-4 text-primary" />
                  <span className="font-semibold">
                    {store.totalProducts} Products
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-amber-500/10 backdrop-blur-md text-amber-600 px-4 py-2 rounded-full border border-amber-500/30 shadow-sm">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-bold">
                    {store.rating?.toFixed(1) ?? "0.0"} Rating
                  </span>
                </div>
              </div>

              {/* Description Section (Moved up) */}
              {store.description && (
                <div className="bg-background/60 backdrop-blur-md p-5 rounded-[2.5rem] border border-border/50 relative mt-2 w-full max-w-2xl mx-auto md:mx-0 shadow-sm transition-all hover:bg-background/80">
                  <div className="absolute -top-3 left-8 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] uppercase font-black tracking-widest shadow-lg">
                    About Store
                  </div>
                  <p className="text-foreground/80 leading-relaxed text-base font-medium italic">
                    "{store.description}"
                  </p>
                </div>
              )}

              {/* Actions (Integrated into flow) */}
              <div className="flex gap-3 justify-center md:justify-start">
                <div className="flex bg-muted/30 p-1.5 rounded-3xl border border-border/50 backdrop-blur-sm gap-2">
                  {/* Dynamic Social Links */}
                  {store.social_links &&
                    Object.entries(store.social_links).map(
                      ([platform, url]) => {
                        if (!url) return null;

                        const getIcon = () => {
                          switch (platform.toLowerCase()) {
                            case "instagram":
                              return <Instagram className="w-5 h-5" />;
                            case "facebook":
                              return <Facebook className="w-5 h-5" />;
                            case "twitter":
                            case "x":
                              return <Twitter className="w-5 h-5" />;
                            case "whatsapp":
                              return <MessageCircle className="w-5 h-5" />;
                            case "website":
                            case "globe":
                              return <Globe className="w-5 h-5" />;
                            default:
                              return <Globe className="w-5 h-5" />;
                          }
                        };

                        return (
                          <Button
                            key={platform}
                            size="icon"
                            variant="ghost"
                            className="rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors h-11 w-11"
                            title={platform}
                            onClick={() => window.open(url, "_blank")}
                          >
                            {getIcon()}
                          </Button>
                        );
                      },
                    )}

                  {/* Legacy website field if still present */}
                  {store.website && !store.social_links?.website && (
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
