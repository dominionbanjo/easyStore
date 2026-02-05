import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Package,
} from "lucide-react";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from "@/services/cartApi";
import type { ICartItem } from "@/types/cart/cartTypes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { USER_ROUTES, WEBSITE_ROUTES } from "@/routes/temp";
import { useNavigate } from "react-router-dom";
import { CartSkeleton } from "../components/skeletons/CartSkeleton";

/* ───────── DEBOUNCE HELPER ───────── */
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 500) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function CartPage() {
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, refetch } = useGetCartQuery();

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();

  const cart = data?.data.cart;

  /* ───────── LOCAL QUANTITY STATE ───────── */
  const [localQty, setLocalQty] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!cart) return;
    const initial: Record<string, number> = {};
    cart.items.forEach((item: ICartItem) => {
      initial[item.product_id] = item.quantity;
    });
    setLocalQty(initial);
  }, [cart]);

  /* ───────── DEBOUNCED API CALL ───────── */
  const debouncedUpdate = useMemo(
    () =>
      debounce((productId: string, quantity: number) => {
        updateCartItem({ productId, quantity })
          .unwrap()
          .catch(() => {
            toast.error("Unable to update quantity");
          });
      }),
    [updateCartItem],
  );

  /* ───────── STATES ───────── */
  if (isLoading || isFetching || !data) {
    return <CartSkeleton />;
  }

  if (isError || !cart) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <ShoppingCart className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-gray-600 mb-4">Failed to load cart</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  /* ───────── HANDLERS ───────── */
  const handleQuantityChange = (productId: string, quantity: number) => {
    const safeQty = Math.max(1, quantity);

    setLocalQty((prev) => ({
      ...prev,
      [productId]: safeQty,
    }));

    debouncedUpdate(productId, safeQty);
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeCartItem(productId).unwrap();
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  /* ───────── UI ───────── */
  return (
    <section className="min-h-screen py-6 px-1 sm:px-4">
      <Card className="max-w-6xl mx-auto shadow-sm rounded-xl">
        <CardHeader className="px-4 py-4">
          <CardTitle className="text-xl sm:text-2xl font-semibold">
            My Cart
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            {cart.items.length} item{cart.items.length !== 1 ? "s" : ""}
          </p>
        </CardHeader>

        <CardContent className="px-3 sm:px-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                Your cart is empty
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Looks like you haven’t added any items yet.
              </p>
              <Button
                onClick={() => navigate(WEBSITE_ROUTES.HOME)}
                className="rounded-full bg-primary text-white px-6 py-2"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
              {/* ITEMS */}
              <div className="space-y-4">
                {cart.items.map((item: ICartItem) => {
                  const qty = localQty[item.product_id] ?? item.quantity;

                  return (
                    <motion.div
                      key={`${item.product_id}-${item.size}-${item.color}`}
                      layout
                    >
                      <Card className="flex flex-col sm:flex-row gap-4 p-3 sm:p-4 rounded-lg border">
                        <img
                          src={item.image ?? "/placeholder.png"}
                          alt={item.name}
                          className="h-24 w-24 rounded-md object-cover shrink-0"
                        />

                        <div className="flex-1 text-left space-y-1">
                          <h3 className="text-base font-semibold">
                            {item.name}
                          </h3>

                          <p className="text-primary font-medium text-sm">
                            ₦
                            {(
                              item.discount_price ?? item.price
                            ).toLocaleString()}
                          </p>

                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                handleQuantityChange(item.product_id, qty - 1)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <Input
                              value={qty}
                              readOnly
                              className="w-12 text-center"
                            />

                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                handleQuantityChange(item.product_id, qty + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(item.product_id)}
                            className="text-red-500"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>

                          <p className="text-sm font-medium">
                            ₦
                            {(
                              (item.discount_price ?? item.price) * qty
                            ).toLocaleString()}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* SUMMARY */}
              <Card className="h-fit rounded-lg border">
                <CardHeader className="px-4 py-3 flex justify-between">
                  <CardTitle className="text-base font-semibold">
                    Order Summary
                  </CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        Clear
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Clear Shopping Cart?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove all items from your cart.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleClearCart}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6"
                        >
                          Clear Everything
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>

                <CardContent className="px-4 pb-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{cart.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₦{cart.shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₦{cart.total.toLocaleString()}</span>
                  </div>
                </CardContent>

                <CardFooter className="px-4 pb-4 flex flex-col gap-3">
                  <Button
                    className="w-full rounded-full bg-primary text-white"
                    onClick={() => navigate(USER_ROUTES.PREVIEW)}
                  >
                    Preview Orders
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={() => navigate(WEBSITE_ROUTES.HOME)}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
