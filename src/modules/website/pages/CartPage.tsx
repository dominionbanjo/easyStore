import { useEffect, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from "@/services/cartApi";
import type { ICartItem } from "@/types/cart/cartTypes";
import { toast } from "sonner";
import { USER_ROUTES, WEBSITE_ROUTES } from "@/routes/temp";
import SmartLink from "@/components/shared/SmartLink";
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
  const { data, isLoading, isFetching, isError, refetch } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();

  const cart = data?.data.cart;

  /* ───────── LOCAL QUANTITY STATE ───────── */
  const [localQty, setLocalQty] = useState<Record<string, number>>({});

  const getItemKey = (
    productId: string,
    size?: string | null,
    color?: string | null,
  ) => `${productId}-${size ?? "none"}-${color ?? "none"}`;

  useEffect(() => {
    if (!cart) return;
    const initial: Record<string, number> = {};
    cart.items.forEach((item: ICartItem) => {
      initial[getItemKey(item.product_id, item.size, item.color)] =
        item.quantity;
    });
    setLocalQty(initial);
  }, [cart]);

  /* ───────── DEBOUNCED API CALL ───────── */
  const debouncedUpdate = useMemo(
    () =>
      debounce(
        (
          productId: string,
          quantity: number,
          size?: string | null,
          color?: string | null,
        ) => {
          updateCartItem({ productId, quantity, size, color })
            .unwrap()
            .catch(() => {
              toast.error("Unable to update quantity");
            });
        },
      ),
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
  const handleQuantityChange = (
    productId: string,
    quantity: number,
    size?: string | null,
    color?: string | null,
  ) => {
    const safeQty = Math.max(1, quantity);
    const key = getItemKey(productId, size, color);
    setLocalQty((prev) => ({
      ...prev,
      [key]: safeQty,
    }));
    debouncedUpdate(productId, safeQty, size, color);
  };

  const handleRemove = async (
    productId: string,
    size?: string | null,
    color?: string | null,
  ) => {
    try {
      await removeCartItem({ productId, size, color }).unwrap();
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
    <section className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 py-24 px-4 sm:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Page Header */}
        <div className="px-4 sm:px-0 flex items-end justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
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
          <Card className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-neutral-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-white/5 mx-4 sm:mx-0 shadow-none">
            <div className="w-24 h-24 bg-gray-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-8">
              <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-10 max-w-sm mx-auto text-lg font-medium leading-relaxed">
              Looks like you haven’t added any items yet. Explore our
              marketplace to find great products.
            </p>
            <SmartLink to={WEBSITE_ROUTES.HOME}>
              <Button className="rounded-2xl h-14 px-10 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Start Shopping
              </Button>
            </SmartLink>
          </Card>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8 items-start">
            {/* Items List */}
            <div className="space-y-4 px-1 sm:px-0">
              {cart.items.map((item: ICartItem) => (
                <CartItem
                  key={getItemKey(item.product_id, item.size, item.color)}
                  item={item}
                  quantity={
                    localQty[
                      getItemKey(item.product_id, item.size, item.color)
                    ] ?? item.quantity
                  }
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
                previewHref={USER_ROUTES.CHECKOUT}
                continueShoppingHref={WEBSITE_ROUTES.HOME}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
