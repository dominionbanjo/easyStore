import { motion } from "framer-motion";
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
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full"
    >
      {/* ─── BANNER ─── */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
        {store.banner ? (
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={store.banner}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-muted to-primary/5 flex items-center justify-center">
            <Store className="h-20 w-20 text-primary/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* ─── CONTENT CONTAINER ─── */}
      <div className="max-w-7xl mx-auto px-4 relative -mt-32 pb-8">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          {/* Subtle Decorative Gradient */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />

          <div className="flex flex-col lg:flex-row gap-8 lg:items-start relative z-10">
            {/* ─── LOGO ─── */}
            <div className="relative flex-shrink-0 mx-auto lg:mx-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl bg-white"
              >
                {store.logo ? (
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/20 bg-primary/5 italic font-black text-4xl">
                    {store.name?.[0]}
                  </div>
                )}
              </motion.div>
              <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg flex items-center gap-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </Badge>
            </div>

            {/* ─── INFORMATION ─── */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                    {store.name}
                  </h1>
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-sm font-bold">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      {store.rating?.toFixed(1) || "5.0"}
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-full border-primary/20 text-primary font-bold px-3 py-1"
                    >
                      {store.totalProducts || 0} Products
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-muted-foreground font-medium">
                  {store.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />{" "}
                      {store.location}
                    </span>
                  )}
                  {store.website && (
                    <a
                      href={store.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <Globe className="w-4 h-4" />{" "}
                      {store.website.replace(/(^\w+:|^)\/\//, "")}
                    </a>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl lg:line-clamp-3">
                {store.description}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full border-primary/10 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full border-primary/10 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full border-primary/10 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
