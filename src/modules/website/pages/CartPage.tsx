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
import { toast } from "sonner";
import { WEBSITE_ROUTES } from "@/routes/temp";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();

  const cart = data?.data.cart;

  /* ───────────────── STATES ───────────────── */

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (isError || !cart) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <ShoppingCart className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-gray-600 mb-4">Failed to load cart</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  /* ───────────────── HANDLERS ───────────────── */

  const handleRemove = async (productId: string) => {
    try {
      await removeCartItem(productId).unwrap();
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = async (productId: string, quantity: number) => {
    try {
      await updateCartItem({
        productId,
        quantity: Math.max(1, quantity),
      }).unwrap();
    } catch {
      toast.error("Unable to update quantity");
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

  /* ───────────────── UI ───────────────── */

  return (
    <section className="min-h-screen bg-emerald-50 py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">My Cart</h1>
          <p className="text-gray-600">
            {cart.items.length} item{cart.items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Empty Cart */}
        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
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
          <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
            {/* Cart Items */}
            <div className="space-y-5">
              {cart.items.map((item) => (
                <motion.div
                  key={`${item.product_id}-${item.size}-${item.color}`}
                  layout
                >
                  <Card className="flex flex-col sm:flex-row gap-6 p-4 bg-white rounded-xl shadow-sm">
                    <img
                      src={item.image ?? "/placeholder.png"}
                      alt={item.name}
                      className="h-28 w-28 rounded-md object-cover"
                    />

                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-lg font-semibold">
                        {item.name}
                      </CardTitle>

                      <p className="text-primary font-medium">
                        ₦{(item.discount_price ?? item.price).toLocaleString()}
                      </p>

                      {(item.size || item.color) && (
                        <p className="text-xs text-gray-500">
                          {item.size && `Size: ${item.size}`}{" "}
                          {item.color && `• Color: ${item.color}`}
                        </p>
                      )}

                      {/* Quantity */}
                      <div className="flex items-center gap-3 mt-3">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleQuantityChange(
                              item.product_id,
                              item.quantity - 1,
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <Input
                          value={item.quantity}
                          readOnly
                          className="w-14 text-center"
                        />

                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleQuantityChange(
                              item.product_id,
                              item.quantity + 1,
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
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
                          (item.discount_price ?? item.price) * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <Card className="h-fit bg-white rounded-xl shadow-sm">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Order Summary</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-500"
                >
                  Clear Cart
                </Button>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{cart.subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₦{cart.shipping.toLocaleString()}</span>
                </div>

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₦{cart.total.toLocaleString()}</span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <Button className="w-full rounded-full bg-primary text-white">
                  Proceed to Checkout
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
      </div>
    </section>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

function CartSkeleton() {
  return (
    <section className="min-h-screen bg-emerald-50 py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          {/* Cart Items */}
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-6 p-4 bg-white rounded-xl"
              >
                <Skeleton className="h-28 w-28 rounded-md" />

                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />

                  <div className="flex items-center gap-3 mt-3">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-14 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 space-y-4">
              <Skeleton className="h-6 w-32" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>

              <Skeleton className="h-10 w-full rounded-full" />
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
