import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ICartItem } from "@/types/cart/cartTypes";

interface CartItemProps {
  item: ICartItem;
  quantity: number;
  onQuantityChange: (
    productId: string,
    quantity: number,
    size?: string | null,
    color?: string | null,
  ) => void;
  onRemove: (
    productId: string,
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
    <motion.div layout>
      <Card className="group flex flex-col sm:flex-row gap-4 p-4 sm:p-5 rounded-3xl border sm:border shadow-sm sm:shadow-md bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 relative overflow-hidden transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative h-48 sm:h-32 w-full sm:w-32 shrink-0 rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800">
          <img
            src={item.image ?? "/placeholder.png"}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1 flex-1">
              <h3 className="text-base sm:text-lg font-black leading-tight text-foreground line-clamp-2">
                {item.name}
              </h3>

              <div className="flex flex-wrap gap-2 pt-1">
                {item.size && (
                  <Badge
                    variant="secondary"
                    className="rounded-lg px-2 py-0 h-6 font-bold text-[10px] uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-600"
                  >
                    Size: {item.size}
                  </Badge>
                )}
                {item.color && (
                  <Badge
                    variant="outline"
                    className="rounded-lg px-2 py-0 h-6 font-bold text-[10px] uppercase tracking-widest border-zinc-200 flex items-center gap-1.5"
                  >
                    {item.color_hex && (
                      <div
                        className="w-2 h-2 rounded-full border border-black/10"
                        style={{ backgroundColor: item.color_hex }}
                      />
                    )}
                    {item.color}
                  </Badge>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.product_id, item.size, item.color)}
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
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
              <div className="flex items-center gap-1 w-fit bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-1.5 border border-border/50">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    onQuantityChange(
                      item.product_id,
                      quantity - 1,
                      item.size,
                      item.color,
                    )
                  }
                  className="h-8 w-8 rounded-xl hover:bg-white dark:hover:bg-zinc-700 shadow-sm transition-all"
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
                      item.size,
                      item.color,
                    )
                  }
                  className="h-8 w-8 rounded-xl hover:bg-white dark:hover:bg-zinc-700 shadow-sm transition-all"
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
    </motion.div>
  );
}
