import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, User, Phone, Home, Globe, Hash, Edit3 } from "lucide-react";
import { motion } from "framer-motion";

interface DeliveryInfoProps {
  fullName: string;
  phone: string;
  street: string;
  state: string;
  postalCode: string;
  city: string;
  hasAddress: boolean;
  onEditAddress: () => void;
}

export function DeliveryInfo({
  fullName,
  phone,
  street,
  state,
  postalCode,
  city,
  hasAddress,
  onEditAddress,
}: DeliveryInfoProps) {
  return (
    <Card className="rounded-sm sm:rounded-sm border-border/40   bg-background overflow-hidden border group transition-all duration-500 hover:">
      <CardHeader className="p-1 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6  border-b border-border/40">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-sm sm:rounded-sm bg-primary/10 flex items-center justify-center text-primary ">
            <MapPin className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
              Shipping Hub
            </CardTitle>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1 opacity-60">
              Final Destination Details
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onEditAddress}
          className="rounded-sm border-primary/20 hover:bg-primary/5 hover:text-primary transition-all font-black text-[10px] tracking-widest px-6 h-10 uppercase w-full sm:w-auto"
        >
          {hasAddress ? (
            <>
              <Edit3 className="h-3.5 w-3.5 mr-2" />
              Update Address
            </>
          ) : (
            "Configure Address"
          )}
        </Button>
      </CardHeader>

      <CardContent className="p-1 sm:p-10">
        {!hasAddress ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-10 sm:py-16 text-center space-y-6"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/5 rounded-sm sm:rounded-sm flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/10 animate-pulse" />
              <Globe className="h-8 w-8 sm:h-10 sm:w-10 text-primary relative z-10" />
            </div>
            <div className="space-y-2">
              <p className="font-black text-xl sm:text-2xl text-foreground uppercase tracking-tight">
                Where should we ship?
              </p>
              <p className="text-sm text-muted-foreground max-w-[320px] leading-relaxed font-medium">
                Your coordinates are missing. Tell us where the magic happens so
                we can compute lightning-fast shipping.
              </p>
            </div>
            <Button
              onClick={onEditAddress}
              className="rounded-sm h-12 sm:h-14 px-8 sm:px-10 font-black bg-primary text-primary-foreground   uppercase tracking-widest text-[10px] sm:text-xs transition-transform hover:scale-105 active:scale-95"
            >
              Add New Address
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-8 sm:space-y-10">
            {/* Top Row: People & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
              <div className="flex gap-4 sm:gap-5">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-sm sm:rounded-sm bg-muted/50 flex items-center justify-center shrink-0 border border-border/40">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 px-1">
                    Recipient
                  </p>
                  <p className="text-lg sm:text-xl font-black text-foreground line-clamp-1">
                    {fullName || "Unnamed Recipient"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-5">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-sm sm:rounded-sm bg-muted/50 flex items-center justify-center shrink-0 border border-border/40">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 px-1">
                    Contact Line
                  </p>
                  <p className="text-lg sm:text-xl font-black text-foreground">
                    {phone || "Not Provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Detailed Geography */}
            <div className="px-2 py-6 sm:p-10 rounded-sm sm:rounded-sm bg-muted/10 border border-border/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Home className="h-24 w-24 -rotate-12" />
              </div>

              <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 relative z-10">
                <div className="hidden sm:flex h-16 w-16 rounded-sm bg-background items-center justify-center shrink-0 border border-border/40 ">
                  <Navigation className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="sm:hidden h-9 w-9 rounded-sm bg-background flex items-center justify-center shrink-0 border border-border/40 ">
                      <Navigation className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                      Shipping Destination
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xl sm:text-2xl md:text-4xl font-black text-foreground leading-[1.1] break-words">
                      {street}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background rounded-sm border border-border/40 ">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] sm:text-[11px] font-black uppercase text-foreground">
                          {city}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background rounded-sm border border-border/40 ">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] sm:text-[11px] font-black uppercase text-foreground">
                          {state}
                        </span>
                      </div>
                      {postalCode && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-sm border border-primary/20">
                          <Hash className="h-3 w-3 text-primary" />
                          <span className="text-[10px] sm:text-[11px] font-black uppercase text-primary">
                            {postalCode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const Navigation = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);
