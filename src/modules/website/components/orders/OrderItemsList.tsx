import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { IOrder } from "@/services/ordersApi";

export function OrderItemsList({ order }: { order: IOrder }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="overflow-hidden rounded-2xl border-2 border-gray-100 dark:border-white/5 bg-white dark:bg-neutral-900/50">
        <div className="bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-500/10 dark:to-transparent px-6 py-4 border-b-2 border-gray-100 dark:border-white/5">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Order Items
            <span className="ml-auto text-sm font-semibold text-emerald-600">
              {order.order_items?.length || 0}{" "}
              {order.order_items?.length === 1 ? "Item" : "Items"}
            </span>
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {order.order_items?.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 pb-4 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0"
            >
              {/* Product Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 rounded-xl overflow-hidden border-2 border-gray-100 dark:border-white/5 flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <Package className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-base mb-1">
                  {item.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span>Qty: {item.quantity}</span>
                  {item.variant_options ? (
                    Object.entries(item.variant_options).map(([key, value]) => (
                      <span key={key}>
                        {key}: {value}
                      </span>
                    ))
                  ) : (
                    <>
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    ₦
                    {(
                      ((Number(item.discount_price) || Number(item.price)) /
                        100) *
                      item.quantity
                    ).toLocaleString()}
                  </span>
                  {item.discount_price && item.discount_price < item.price && (
                    <span className="text-sm text-gray-400 dark:text-zinc-500 line-through">
                      ₦{((item.price / 100) * item.quantity).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
