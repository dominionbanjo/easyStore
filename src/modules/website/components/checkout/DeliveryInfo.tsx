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
    <Card className="rounded-3xl border-0 sm:border shadow-sm bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 overflow-hidden">
      <CardHeader className="px-6 py-5 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-black tracking-tight text-foreground flex items-center justify-start gap-3 w-full text-left">
          <MapPin className="h-6 w-6 text-emerald-500" />
          Delivery Details
        </CardTitle>
        <Button
          size="sm"
          variant="ghost"
          onClick={onEditAddress}
          className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 h-8 px-0 text-sm font-bold tracking-tight shrink-0"
        >
          {hasAddress ? "CHANGE" : "ADD ADDRESS"}
        </Button>
      </CardHeader>

      <CardContent className="px-6 pb-8">
        {!hasAddress ? (
          <div className="flex flex-col items-start justify-center py-6 text-left space-y-4">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-lg text-foreground">
                Missing Address
              </p>
              <p className="text-sm text-muted-foreground max-w-[240px]">
                Please add your delivery address to proceed with the checkout.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Recipient */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-zinc-400" />
              </div>
              <div className="flex flex-col items-start text-left">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1.5">
                  RECIPIENT
                </p>
                <p className="text-lg font-black text-zinc-900 dark:text-white leading-none">
                  {fullName}
                </p>
              </div>
            </div>

            {/* Contact Number */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shrink-0">
                <Phone className="h-6 w-6 text-zinc-400" />
              </div>
              <div className="flex flex-col items-start text-left">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1.5">
                  CONTACT NUMBER
                </p>
                <p className="text-lg font-black text-zinc-900 dark:text-white leading-none">
                  {phone}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shrink-0">
                <Home className="h-6 w-6 text-zinc-400" />
              </div>
              <div className="flex flex-col items-start text-left">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1.5">
                  SHIPPING ADDRESS
                </p>
                <div className="space-y-0.5 mt-0.5">
                  <p className="text-lg font-black text-zinc-900 dark:text-white leading-tight">
                    {street}
                    {state ? `, ${state}` : ""}
                    {postalCode ? `, ${postalCode}` : ""}
                  </p>
                  <p className="text-sm font-bold text-zinc-400 mt-1">{city}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
