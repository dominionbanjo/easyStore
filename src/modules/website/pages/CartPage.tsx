import { useEffect, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from "@/services/cartApi";
import type { ICartItem } from "@/types/cart/cartTypes";
import { toast } from "sonner";
import { USER_ROUTES, WEBSITE_ROUTES } from "@/routes/temp";
import { useNavigate } from "react-router-dom";
import { CartSkeleton } from "../components/skeletons/CartSkeleton";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";

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
        <p className="text-gray-600 mb-4 font-medium">Failed to load cart</p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="rounded-full"
        >
          Retry
        </Button>
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
    <section className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-20">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Page Header */}
        <div className="px-4 sm:px-0 flex items-end justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Shopping Cart
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">
              You have {cart.items.length}{" "}
              {cart.items.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>

        {cart.items.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-zinc-900 rounded-3xl sm:border border-dashed border-gray-200 dark:border-zinc-800 mx-4 sm:mx-0">
            <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Looks like you haven’t added any items yet. Explore our
              marketplace to find great products.
            </p>
            <Button
              onClick={() => navigate(WEBSITE_ROUTES.HOME)}
              className="rounded-full h-12 px-8 text-base font-bold bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8 items-start">
            {/* Items List */}
            <div className="space-y-4 px-1 sm:px-0">
              {cart.items.map((item: ICartItem) => (
                <CartItem
                  key={`${item.product_id}-${item.size}-${item.color}`}
                  item={item}
                  quantity={localQty[item.product_id] ?? item.quantity}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Sticky Summary */}
            <div className="px-0 sm:px-0 sticky top-24">
              <CartSummary
                subtotal={cart.subtotal}
                shipping={cart.shipping}
                total={cart.total}
                onClear={handleClearCart}
                onPreview={() => navigate(USER_ROUTES.CHECKOUT)}
                onContinueShopping={() => navigate(WEBSITE_ROUTES.HOME)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
