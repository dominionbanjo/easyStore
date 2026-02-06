import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, User, Phone, Home } from "lucide-react";

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
    <Card className="rounded-[2rem] border-0 sm:border shadow-xl shadow-primary/5 bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 overflow-hidden group">
      <CardHeader className="px-5 py-6 sm:px-8 sm:py-7 flex flex-row items-center justify-between border-b border-zinc-50 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <CardTitle className="text-lg sm:text-xl font-black tracking-tight text-foreground">
            Delivery Details
          </CardTitle>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onEditAddress}
          className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 h-9 px-4 rounded-xl text-xs font-black tracking-widest transition-all"
        >
          {hasAddress ? "EDIT" : "ADD"}
        </Button>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        {!hasAddress ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-5">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2rem] flex items-center justify-center animate-pulse">
              <MapPin className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <p className="font-black text-xl text-foreground">
                No Address Found
              </p>
              <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
                Add your shipping information to calculate precise delivery
                times and costs.
              </p>
            </div>
            <Button
              onClick={onEditAddress}
              className="rounded-2xl h-12 px-8 font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
            >
              Add Address
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
              {/* Recipient */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800 transition-colors group-hover:bg-white dark:group-hover:bg-zinc-800">
                  <User className="h-5 w-5 text-zinc-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] mb-1">
                    Recipient
                  </p>
                  <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-white truncate">
                    {fullName}
                  </p>
                </div>
              </div>

              {/* Contact Number */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800 transition-colors group-hover:bg-white dark:group-hover:bg-zinc-800">
                  <Phone className="h-5 w-5 text-zinc-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] mb-1">
                    Contact Number
                  </p>
                  <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                    {phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="flex items-start gap-4 pt-6 border-t border-zinc-50 dark:border-zinc-900">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200/50 dark:border-zinc-800">
                <Home className="h-5 w-5 text-zinc-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] mb-1.5">
                  Shipping Destination
                </p>
                <div className="space-y-1">
                  <p className="text-base sm:text-xl font-black text-zinc-900 dark:text-white leading-tight">
                    {street}
                  </p>
                  <p className="text-sm sm:text-base font-bold text-zinc-500 flex items-center gap-2">
                    {city} • {state}{" "}
                    {postalCode && (
                      <span className="text-zinc-300 dark:text-zinc-700">
                        |
                      </span>
                    )}{" "}
                    {postalCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
