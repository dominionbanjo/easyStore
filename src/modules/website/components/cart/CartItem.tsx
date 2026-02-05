import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ICartItem } from "@/types/cart/cartTypes";

interface CartItemProps {
  item: ICartItem;
  quantity: number;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({
  item,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    <motion.div layout>
      <Card className="group flex flex-row gap-4 p-3 sm:p-5 rounded-3xl border-0 sm:border shadow-sm sm:shadow-md bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
        {/* Image */}
        <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800">
          <img
            src={item.image ?? "/placeholder.png"}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between py-1">
          <div className="space-y-1">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-sm sm:text-base font-bold leading-tight line-clamp-2 text-foreground">
                {item.name}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.product_id)}
                className="h-8 w-8 -mt-1 -mr-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Badges / Meta */}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {item.size && (
                <Badge
                  variant="secondary"
                  className="rounded-md px-1.5 py-0 h-5 font-semibold text-[10px] uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  {item.size}
                </Badge>
              )}
              {item.color && (
                <Badge
                  variant="outline"
                  className="rounded-md px-1.5 py-0 h-5 font-semibold text-[10px] uppercase tracking-wider border-zinc-200 dark:border-zinc-700"
                >
                  {item.color}
                </Badge>
              )}
            </div>

            <p className="text-primary font-black text-sm sm:text-base pt-1">
              ₦{(item.discount_price ?? item.price).toLocaleString()}
            </p>
          </div>

          {/* Controls Footer */}
          <div className="flex items-center justify-between mt-auto pt-3">
            {/* Quantity */}
            <div className="flex items-center gap-1 bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-1 border border-transparent dark:border-zinc-800">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onQuantityChange(item.product_id, quantity - 1)}
                className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
              >
                <Minus className="h-3 w-3" />
              </Button>

              <div className="w-8 text-center text-sm font-bold">
                {quantity}
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => onQuantityChange(item.product_id, quantity + 1)}
                className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Total */}
            <div className="text-right">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Subtotal
              </p>
              <p className="text-sm sm:text-base font-black text-foreground">
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
