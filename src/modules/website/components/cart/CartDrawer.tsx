import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "@/services/cartApi";
import type { ICartItem } from "@/types/cart/cartTypes";
import { USER_ROUTES } from "@/routes/temp";
import { toast } from "sonner";
import SmartLink from "@/components/shared/SmartLink";
import { extractErrorMessage } from "@/utils/errorHandler";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { data, isLoading } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  const cart = data?.data.cart;

  const handleUpdateQty = async (
    productId: string,
    quantity: number,
    size?: string | null,
    color?: string | null,
  ) => {
    if (quantity < 1) return;
    try {
      await updateCartItem({ productId, quantity, size, color }).unwrap();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to update quantity"));
    }
  };

  const handleRemove = async (
    productId: string,
    size?: string | null,
    color?: string | null,
  ) => {
    try {
      await removeCartItem({ productId, size, color }).unwrap();
      toast.success("Item removed");
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to remove item"));
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl">
        <SheetHeader className="p-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-black tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Your Cart
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-20 h-20 bg-muted rounded-xl" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60 py-10">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <p className="font-medium text-muted-foreground">
                Your cart is empty
              </p>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={onClose}
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {cart.items.map((item: ICartItem) => (
                  <motion.div
                    key={`${item.product_id}-${item.size}-${item.color}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border border-border/40">
                      <img
                        src={item.image ?? "/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between gap-2">
                        <h4 className="text-sm font-bold truncate pr-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() =>
                            handleRemove(item.product_id, item.size, item.color)
                          }
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        {item.size && (
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                            {item.size}
                          </span>
                        )}
                        {item.color && (
                          <div className="flex items-center gap-1 ml-1 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            {item.color_hex && (
                              <div
                                className="w-2 h-2 rounded-full border border-black/10"
                                style={{ backgroundColor: item.color_hex }}
                              />
                            )}
                            {item.color}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between pt-2 gap-2">
                        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                          <button
                            onClick={() =>
                              handleUpdateQty(
                                item.product_id,
                                item.quantity - 1,
                                item.size,
                                item.color,
                              )
                            }
                            className="p-1 hover:bg-white dark:hover:bg-zinc-800 rounded shadow-sm transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQty(
                                item.product_id,
                                item.quantity + 1,
                                item.size,
                                item.color,
                              )
                            }
                            className="p-1 hover:bg-white dark:hover:bg-zinc-800 rounded shadow-sm transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm font-black text-primary tabular-nums">
                          ₦
                          {(item.discount_price ?? item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground font-medium">
                <span>Subtotal</span>
                <span>₦{cart.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground font-medium">
                <span>Shipping</span>
                <span>₦{cart.shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground font-medium">
                <span>Service Charge</span>
                <span>₦{cart.service_charge.toLocaleString()}</span>
              </div>
              <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 my-1"></div>
              <div className="flex justify-between text-lg font-black tracking-tight">
                <span>Total</span>
                <span className="text-primary">
                  ₦{cart.total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SmartLink to={USER_ROUTES.CART} className="w-full">
                <Button
                  variant="outline"
                  className="rounded-2xl h-12 font-bold w-full"
                  onClick={onClose}
                >
                  View Cart
                </Button>
              </SmartLink>
              <SmartLink to={USER_ROUTES.CHECKOUT} className="w-full">
                <Button
                  className="rounded-2xl h-12 font-black shadow-lg shadow-primary/20 w-full"
                  onClick={onClose}
                >
                  Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </SmartLink>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
