import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IOrder } from "@/services/ordersApi";
import { useAddItemToCartMutation } from "@/services/cartApi";
import { toast } from "sonner";

interface OrderPaymentSummaryProps {
  order: IOrder;
  handleCopy: () => void;
  isCopied: boolean;
}

export function OrderPaymentSummary({ order }: OrderPaymentSummaryProps) {
  const [isReordering, setIsReordering] = useState(false);
  const [addItemToCart] = useAddItemToCartMutation();
  const navigate = useNavigate();

  const handleReorder = async () => {
    if (!order.order_items || order.order_items.length === 0) {
      toast.error("No items found to reorder.");
      return;
    }

    setIsReordering(true);
    try {
      // Create a promise for each item to be added to the cart
      const promises = order.order_items.map((item) =>
        addItemToCart({
          product_id: item.product_id,
          variant_id: item.variant_id ?? undefined,
          quantity: item.quantity,
          size: item.size ?? undefined,
          color: item.color ?? undefined,
        }).unwrap(),
      );

      await Promise.all(promises);

      toast.success("Items added to cart successfully!");
      navigate("/cart"); // Navigate to cart after reordering
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reorder some items.");
    } finally {
      setIsReordering(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="overflow-hidden rounded-sm border border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="bg-muted/30 px-4 py-3 border-b border-border/40">
          <h2 className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-widest font-outfit">
            <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Payment
          </h2>
        </div>
        <div className="p-3 sm:p-5 space-y-3">
          <div className="flex justify-between text-muted-foreground text-[10px] font-black uppercase tracking-widest">
            <span>Subtotal</span>
            <span className="text-foreground font-black font-outfit">
              ₦{(Number(order.subtotal) / 100).toLocaleString()}
            </span>
          </div>

          {order.shipping_fee != null && Number(order.shipping_fee) > 0 && (
            <div className="flex justify-between text-muted-foreground text-[10px] font-black uppercase tracking-widest">
              <span>Shipping</span>
              <span className="text-foreground font-black font-outfit">
                ₦{(Number(order.shipping_fee) / 100).toLocaleString()}
              </span>
            </div>
          )}

          {order.platform_fee != null && Number(order.platform_fee) > 0 && (
            <div className="flex justify-between text-muted-foreground text-[10px] font-black uppercase tracking-widest">
              <span>Fee (2%)</span>
              <span className="text-foreground font-black font-outfit">
                ₦{(Number(order.platform_fee) / 100).toLocaleString()}
              </span>
            </div>
          )}

          <Separator className="bg-border/40" />
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Total
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-outfit tracking-tighter">
              ₦{(Number(order.total) / 100).toLocaleString()}
            </span>
          </div>
          <Separator className="bg-border/40" />

          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
              <span className="text-muted-foreground">Method</span>
              <span className="text-foreground px-2 py-0.5 rounded-sm bg-muted/30 border border-border/40">
                {order.payment_method}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
              <span className="text-muted-foreground">Status</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-sm border",
                  order.payment_status === "success"
                    ? "text-emerald-600 border-emerald-600/20 bg-emerald-600/10"
                    : order.payment_status === "failed"
                      ? "text-red-600 border-red-600/20 bg-red-600/10"
                      : "text-amber-600 border-amber-600/20 bg-amber-600/10",
                )}
              >
                {order.payment_status}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/20">
            {order.payment_status === "pending" && order.payment_url && (
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-11 rounded-sm uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all"
                onClick={() => (window.location.href = order.payment_url!)}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Retry Payment
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full font-black h-11 rounded-sm border border-border/40 hover:bg-muted/50 uppercase tracking-widest text-[10px] transition-all group/reorder"
              onClick={handleReorder}
              disabled={isReordering}
            >
              {isReordering ? (
                <div className="h-3.5 w-3.5 rounded-sm border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-4 w-4 group-hover/reorder:scale-110 transition-transform" />
                  Reorder Item
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
