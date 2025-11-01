import { motion } from "framer-motion";
import { useMemo } from "react";
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
  // 📡 RTK Query Hooks
  const { data, isLoading, isError, refetch } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();

  const cart = data?.cartItems || [];

  // 💰 Totals
  const totalPrice = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  // 🧭 Event Handlers
  const handleRemove = async (id: string) => {
    try {
      await removeCartItem(id).unwrap();
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = async (id: string, quantity: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, Math.min(item.stock, quantity));
    try {
      await updateCartItem({ id, quantity: newQty }).unwrap();
    } catch {
      toast.error("Unable to update quantity");
    }
  };

  const handleCheckout = () => {
    toast.info("Proceeding to checkout...");
  };

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading your cart...
      </div>
    );

  if (isError)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <ShoppingCart className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-gray-600 mb-4">Failed to load cart</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );

  return (
    <section className="min-h-screen bg-emerald-50 py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* 🧭 Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">My Cart</h1>
          <p className="text-gray-600">
            {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        {/* 🛒 Cart Empty */}
        {cart.length === 0 ? (
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
            {/* 🧾 Cart List */}
            <div className="space-y-5">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-28 w-28 rounded-md object-cover"
                    />
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </CardTitle>
                      <p className="text-primary font-medium">
                        ₦{item.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Available: {item.stock} units
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="rounded-full"
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
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="rounded-full"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between h-full sm:ml-auto sm:pl-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                      <p className="text-sm font-medium text-gray-700">
                        Subtotal: ₦
                        {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* 💳 Summary Card */}
            <Card className="h-fit bg-white rounded-xl shadow-sm">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold">
                  Order Summary
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700"
                >
                  Clear Cart
                </Button>
              </CardHeader>

              <CardContent className="space-y-4 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₦1,500</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₦{(totalPrice + 1500).toLocaleString()}</span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full rounded-full bg-primary text-white hover:bg-primary/90"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-gray-300"
                >
                  <Package className="h-4 w-4 mr-2" />
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
