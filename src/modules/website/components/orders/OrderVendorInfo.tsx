import { motion } from "framer-motion";
import { ShoppingBag, User, Mail, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import SmartLink from "@/components/shared/SmartLink";
import type { IOrder } from "@/services/ordersApi";

export function OrderVendorInfo({ order }: { order: IOrder }) {
  if (!order.vendor) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <Card className="overflow-hidden rounded-2xl border-2 border-gray-100 dark:border-white/5 bg-white dark:bg-neutral-900/50">
        <div className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-500/10 dark:to-transparent px-6 py-4 border-b-2 border-gray-100 dark:border-white/5">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Seller Information
          </h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Store Details */}
          {order.vendor.store ? (
            <div className="flex items-center gap-4 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/20">
              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white dark:border-white/10 shadow-sm flex-shrink-0">
                {order.vendor.store.logo ? (
                  <img
                    src={order.vendor.store.logo}
                    alt={order.vendor.store.store_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-foreground leading-tight">
                  {order.vendor.store.store_name}
                </h3>
                <SmartLink
                  to={`/stores/${order.vendor.store.slug}`}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 uppercase tracking-wider"
                >
                  View Store Profile
                </SmartLink>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  Vendor Name
                </p>
                <p className="font-semibold text-foreground">
                  {order.vendor.first_name} {order.vendor.last_name}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  Support Email
                </p>
                <a
                  href={`mailto:${order.vendor.email}`}
                  className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors break-all"
                >
                  {order.vendor.email}
                </a>
              </div>
            </div>

            {(order.vendor.phone_number ||
              order.vendor.store?.phone_number) && (
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    Phone Number
                  </p>
                  <a
                    href={`tel:${order.vendor.store?.phone_number || order.vendor.phone_number}`}
                    className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    {order.vendor.store?.phone_number ||
                      order.vendor.phone_number}
                  </a>
                </div>
              </div>
            )}

            {order.vendor.store?.address_street && (
              <div className="flex items-start gap-3 border-t border-gray-100 dark:border-white/5 pt-4">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    Store Address
                  </p>
                  <p className="font-medium text-foreground text-sm">
                    {order.vendor.store.address_street}
                    {order.vendor.store.address_city &&
                      `, ${order.vendor.store.address_city}`}
                    {order.vendor.store.address_state &&
                      ` (${order.vendor.store.address_state})`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
