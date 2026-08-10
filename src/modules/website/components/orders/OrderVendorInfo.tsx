import { ShoppingBag, User, Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import SmartLink from "@/components/shared/SmartLink";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import type { IOrder } from "@/services/ordersApi";

export function OrderVendorInfo({ order }: { order: IOrder }) {
  if (!order.vendor) return null;

  return (
    <div>
      <Card className="overflow-hidden rounded-sm border border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="bg-muted/30 px-4 py-3 border-b border-border/40">
          <h2 className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-widest font-outfit">
            <ShoppingBag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            Seller
          </h2>
        </div>
        <div className="p-3 sm:p-5 space-y-4">
          {/* Store Details */}
          {order.vendor.store ? (
            <div className="flex items-center gap-3 p-2 rounded-sm bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/10">
              <div className="w-10 h-10 rounded-sm overflow-hidden border border-border/10 flex-shrink-0 bg-white dark:bg-neutral-800">
                {order.vendor.store.logo ? (
                  <OptimizedImage
                    src={order.vendor.store.logo}
                    alt={order.vendor.store.store_name}
                    recipe="LOGO"
                    aspectRatio="1 / 1"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-purple-600/40">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="font-black text-foreground text-xs uppercase tracking-tight font-outfit truncate">
                  {order.vendor.store.store_name}
                </h3>
                <SmartLink
                  to={`/stores/${order.vendor.store.slug}`}
                  className="text-[9px] font-black text-purple-600 dark:text-purple-400 hover:opacity-70 uppercase tracking-[0.2em] transition-opacity"
                >
                  Store Profile
                </SmartLink>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                  Vendor
                </p>
                <p className="text-xs font-black uppercase text-foreground">
                  {order.vendor.first_name} {order.vendor.last_name}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3">
              <Mail className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                  Email
                </p>
                <a
                  href={`mailto:${order.vendor.email}`}
                  className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-opacity truncate block font-outfit"
                >
                  {order.vendor.email}
                </a>
              </div>
            </div>

            {(order.vendor.phone_number ||
              order.vendor.store?.phone_number) && (
              <div className="flex items-start gap-3">
                <Phone className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                    Phone
                  </p>
                  <a
                    href={`tel:${order.vendor.store?.phone_number || order.vendor.phone_number}`}
                    className="text-xs font-black text-foreground font-outfit"
                  >
                    {order.vendor.store?.phone_number ||
                      order.vendor.phone_number}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
