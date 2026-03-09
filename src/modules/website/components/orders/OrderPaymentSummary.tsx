import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Check, Copy, ShoppingBag } from "lucide-react";
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

export function OrderPaymentSummary({
  order,
  handleCopy,
  isCopied,
}: OrderPaymentSummaryProps) {
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
      <Card className="overflow-hidden rounded-2xl border-2 border-gray-100 dark:border-white/5 bg-white dark:bg-neutral-900/50">
        <div className="bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-500/10 dark:to-transparent px-6 py-4 border-b-2 border-gray-100 dark:border-white/5">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Payment Summary
          </h2>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span className="font-semibold">
              ₦{(Number(order.subtotal) / 100).toLocaleString()}
            </span>
          </div>

          {order.shipping_fee != null && Number(order.shipping_fee) > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Shipping Fee</span>
              <span className="font-semibold">
                ₦{(Number(order.shipping_fee) / 100).toLocaleString()}
              </span>
            </div>
          )}

          {order.platform_fee != null && Number(order.platform_fee) > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Platform Fee (2%)</span>
              <span className="font-semibold">
                ₦{(Number(order.platform_fee) / 100).toLocaleString()}
              </span>
            </div>
          )}

          {order.tax != null && Number(order.tax) > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Tax</span>
              <span className="font-semibold">
                ₦{(Number(order.tax) / 100).toLocaleString()}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-gray-900 text-lg">
            <span className="font-black">Total</span>
            <span className="font-black text-emerald-600">
              ₦{(Number(order.total) / 100).toLocaleString()}
            </span>
          </div>
          <Separator className="dark:bg-white/5" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-semibold text-foreground capitalize">
                {order.payment_method}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Status</span>
              <span
                className={cn(
                  "font-bold capitalize",
                  order.payment_status === "success"
                    ? "text-emerald-600"
                    : order.payment_status === "failed"
                      ? "text-red-600"
                      : "text-amber-600",
                )}
              >
                {order.payment_status}
              </span>
            </div>
            {order.payment_reference && (
              <div className="flex justify-between items-center group/ref">
                <span className="text-muted-foreground">Reference</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground line-clamp-1 max-w-[150px]">
                    {order.payment_reference}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                    title="Copy Full Reference"
                  >
                    {isCopied ? (
                      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            {order.payment_method === "online" &&
              order.payment_status !== "success" &&
              order.payment_url && (
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-6 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all group/pay"
                  onClick={() => (window.location.href = order.payment_url!)}
                >
                  <CreditCard className="mr-2 h-5 w-5 group-hover/pay:scale-110 transition-transform" />
                  Retry Payment
                </Button>
              )}

            <Button
              variant="outline"
              className="w-full font-black py-6 rounded-xl border-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800/30 transition-all group/reorder"
              onClick={handleReorder}
              disabled={isReordering}
            >
              {isReordering ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Reordering...
                </span>
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-5 w-5 group-hover/reorder:scale-110 transition-transform" />
                  Reorder Items
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
