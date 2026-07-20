import { Package } from "lucide-react";
import SmartLink from "@/components/shared/SmartLink";
import { Card } from "@/components/ui/card";
import type { IOrder } from "@/services/ordersApi";

export function OrderItemsList({ order }: { order: IOrder }) {
  return (
    <div>
      <Card className="overflow-hidden rounded-sm border border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="bg-muted/30 px-4 py-3 border-b border-border/40">
          <h2 className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-widest font-outfit">
            <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Order Items
            <span className="ml-auto text-[10px] font-black text-emerald-600 dark:text-emerald-400 opacity-80">
              {order.order_items?.length || 0}{" "}
              {order.order_items?.length === 1 ? "Item" : "Items"}
            </span>
          </h2>
        </div>
        <div className="p-3 sm:p-5 space-y-4">
          {order.order_items?.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 pb-4 border-b border-border/40 last:border-0 last:pb-0"
            >
              {/* Product Image */}
              <SmartLink
                to={`/product/${item.slug}`}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-muted/20 rounded-sm overflow-hidden border border-border/10 flex-shrink-0"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground/30">
                    <Package className="h-6 w-6" />
                  </div>
                )}
              </SmartLink>

              {/* Product Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <SmartLink to={`/product/${item.slug}`}>
                  <h3 className="font-black text-foreground text-sm uppercase font-outfit leading-tight mb-1 truncate hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                </SmartLink>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2 opacity-70">
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
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-outfit">
                    ₦
                    {(
                      ((Number(item.discount_price) || Number(item.price)) /
                        100) *
                      item.quantity
                    ).toLocaleString()}
                  </span>
                  {item.discount_price && item.discount_price < item.price && (
                    <span className="text-[10px] text-muted-foreground line-through font-bold">
                      ₦{((item.price / 100) * item.quantity).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>

  );
}
