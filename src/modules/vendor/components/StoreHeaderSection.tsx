import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Mail, Phone, Globe, Store } from "lucide-react";

export default function StoreHeaderSection({
  store,
}: {
  store: {
    name: string;
    banner: string;
    logo: string;
    description: string;
    rating: number;
    location: string;
    email: string;
    phone: string;
    website: string;
    totalProducts: number;
  };
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-background shadow-sm rounded-t-3xl overflow-hidden border-b border-border"
    >
      {/* Banner */}
      <div className="relative h-56 sm:h-72 w-full">
        <img
          src={store.banner}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6 sm:py-10 relative -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end gap-6">
          {/* Logo */}
          <div className="w-28 h-28 rounded-xl overflow-hidden border-4 border-background shadow-lg bg-background">
            <img
              src={store.logo}
              alt={store.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {store.name}
            </h1>
            <div className="flex items-center flex-wrap gap-3 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{store.location}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-500" />
                <span className="font-medium text-foreground">
                  {store.rating.toFixed(1)} / 5.0
                </span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <Badge
                variant="outline"
                className="bg-muted/40 text-foreground border-border"
              >
                {store.totalProducts} Products
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-muted-foreground max-w-3xl leading-relaxed text-sm sm:text-base">
          {store.description}
        </p>

        {/* Contact Buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-full">
            <Mail className="h-4 w-4 mr-2 text-primary" />
            {store.email}
          </Button>
          <Button variant="outline" className="rounded-full">
            <Phone className="h-4 w-4 mr-2 text-primary" />
            {store.phone}
          </Button>
          <Button variant="outline" className="rounded-full">
            <Globe className="h-4 w-4 mr-2 text-primary" />
            Visit Website
          </Button>
          <Button className="rounded-full text-white">
            <Store className="h-4 w-4 mr-2" />
            Follow Store
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
