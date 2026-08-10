import { Trash2, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ICartItem } from "@/types/cart/cartTypes";
import SmartLink from "@/components/shared/SmartLink";
import { OptimizedImage } from "@/components/shared/OptimizedImage";

interface CartItemProps {
  item: ICartItem;
  quantity: number;
  onQuantityChange: (
    productId: string,
    quantity: number,
    variant_id?: string | null,
    variant_options?: Record<string, string> | null,
    size?: string | null,
    color?: string | null,
  ) => void;
  onRemove: (
    productId: string,
    variant_id?: string | null,
    variant_options?: Record<string, string> | null,
    size?: string | null,
    color?: string | null,
  ) => void;
}

export function CartItem({
  item,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    <div>
      <Card className="group flex flex-col sm:flex-row gap-4 p-4 sm:p-5 rounded-sm border sm:border  sm: bg-white dark:bg-zinc-900 border-zinc-100 dark:border-white/5 relative overflow-hidden transition-all hover:">
        {/* Image */}
        <SmartLink
          to={`/product/${item.slug}`}
          className="relative h-48 sm:h-32 w-full sm:w-32 shrink-0 rounded-sm overflow-hidden bg-gray-100 dark:bg-zinc-800"
        >
          <OptimizedImage
            src={item.image ?? "/placeholder.png"}
            alt={item.name}
            recipe="CARD"
            aspectRatio="4 / 3"
            className="transition-transform duration-500 group-hover:scale-110"
          />
        </SmartLink>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1 flex-1">
              <SmartLink to={`/product/${item.slug}`}>
                <h3 className="text-base sm:text-lg font-black leading-tight text-foreground hover:text-primary transition-colors line-clamp-2">
                  {item.name}
                </h3>
              </SmartLink>

              <div className="flex flex-wrap gap-2 pt-1">
                {item.variant_options ? (
                  Object.entries(item.variant_options).map(([key, value]) => (
                    <Badge
                      key={key}
                      variant="secondary"
                      className="rounded-sm px-2 py-0 h-6 font-bold text-[10px] uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-white/5 flex items-center gap-1.5"
                    >
                      {key.toLowerCase() === "color" && item.color_hex && (
                        <div
                          className="w-2 h-2 rounded-sm border border-black/10"
                          style={{ backgroundColor: item.color_hex }}
                        />
                      )}
                      <span className="opacity-50 mr-1">{key}:</span> {value}
                    </Badge>
                  ))
                ) : (
                  <>
                    {item.size && (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-2 py-0 h-6 font-bold text-[10px] uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        Size: {item.size}
                      </Badge>
                    )}
                    {item.color && (
                      <Badge
                        variant="outline"
                        className="rounded-sm px-2 py-0 h-6 font-bold text-[10px] uppercase tracking-widest border-zinc-200 dark:border-white/10 flex items-center gap-1.5"
                      >
                        {item.color_hex && (
                          <div
                            className="w-2 h-2 rounded-sm border border-black/10"
                            style={{ backgroundColor: item.color_hex }}
                          />
                        )}
                        {item.color}
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                onRemove(
                  item.product_id,
                  item.variant_id,
                  item.variant_options,
                  item.size,
                  item.color,
                )
              }
              className="h-9 w-9 rounded-sm text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm font-bold text-muted-foreground">
                Unit Price:{" "}
                <span className="text-primary font-black">
                  ₦{(item.discount_price ?? item.price).toLocaleString()}
                </span>
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1 w-fit bg-gray-50 dark:bg-zinc-800/50 rounded-sm p-1.5 border border-border/50">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    onQuantityChange(
                      item.product_id,
                      quantity - 1,
                      item.variant_id,
                      item.variant_options,
                      item.size,
                      item.color,
                    )
                  }
                  className="h-8 w-8 rounded-sm hover:bg-white dark:hover:bg-zinc-700  transition-all"
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <div className="w-10 text-center text-base font-black">
                  {quantity}
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    onQuantityChange(
                      item.product_id,
                      quantity + 1,
                      item.variant_id,
                      item.variant_options,
                      item.size,
                      item.color,
                    )
                  }
                  className="h-8 w-8 rounded-sm hover:bg-white dark:hover:bg-zinc-700  transition-all"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Subtotal */}
            <div className="text-left sm:text-right border-t sm:border-0 pt-3 sm:pt-0">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">
                Subtotal
              </p>
              <p className="text-2xl sm:text-xl font-black text-foreground tabular-nums tracking-tight">
                ₦
                {(
                  (item.discount_price ?? item.price) * quantity
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
