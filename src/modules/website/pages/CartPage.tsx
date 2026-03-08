import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
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
import { WEBSITE_ROUTES, AUTH_ROUTES } from "@/routes/temp";
import {
  updateLocalCartQuantity,
  removeLocalCartItem,
  clearLocalCart as clearLocalCartAction,
} from "@/features/cartSlice";
import SmartLink from "@/components/shared/SmartLink";
import { extractErrorMessage } from "@/utils/errorHandler";
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
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const localCart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const { data, isLoading, isFetching, isError, refetch } = useGetCartQuery(
    undefined,
    { skip: !isAuthenticated },
  );
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();

  const cartItems = isAuthenticated
    ? (data?.data.cart?.items ?? [])
    : localCart.localItems;
  const subtotal = isAuthenticated
    ? (data?.data.cart?.subtotal ?? 0)
    : localCart.localSubtotal;
  const shipping = isAuthenticated ? (data?.data.cart?.shipping ?? 0) : 0;
  const platformFee = isAuthenticated
    ? (data?.data.cart?.platform_fee ?? 0)
    : 0;
  const total = isAuthenticated
    ? (data?.data.cart?.total ?? 0)
    : localCart.localTotal;

  /* ───────── LOCAL QUANTITY STATE ───────── */
  const [localQty, setLocalQty] = useState<Record<string, number>>({});

  const getItemKey = (
    productId: string,
    variant_id?: string | null,
    variant_options?: Record<string, string> | null,
    size?: string | null,
    color?: string | null,
  ) => {
    if (variant_id) return `${productId}-${variant_id}`;
    if (variant_options) {
      const optionsStr = Object.entries(variant_options)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${v}`)
        .join("|");
      return `${productId}-${optionsStr}`;
    }
    return `${productId}-${size ?? "none"}-${color ?? "none"}`;
  };

  useEffect(() => {
    const initial: Record<string, number> = {};
    cartItems.forEach((item: ICartItem) => {
      initial[
        getItemKey(
          item.product_id,
          item.variant_id,
          item.variant_options,
          item.size,
          item.color,
        )
      ] = item.quantity;
    });
    setLocalQty(initial);
  }, [cartItems]);

  /* ───────── DEBOUNCED API CALL ───────── */
  const debouncedUpdate = useMemo(
    () =>
      debounce(
        (
          productId: string,
          quantity: number,
          size?: string | null,
          color?: string | null,
          variant_id?: string | null,
        ) => {
          updateCartItem({ productId, quantity, size, color, variant_id })
            .unwrap()
            .catch((err: any) => {
              toast.error(
                extractErrorMessage(err, "Unable to update quantity"),
              );
            });
        },
      ),
    [updateCartItem],
  );

  /* ───────── STATES ───────── */
  if ((isAuthenticated && isLoading) || isFetching) {
    return <CartSkeleton />;
  }

  if (isAuthenticated && isError) {
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
    variant_id?: string | null,
    variant_options?: Record<string, string> | null,
    size?: string | null,
    color?: string | null,
  ) => {
    const safeQty = Math.max(1, quantity);
    const key = getItemKey(productId, variant_id, variant_options, size, color);
    setLocalQty((prev) => ({
      ...prev,
      [key]: safeQty,
    }));
    if (!isAuthenticated) {
      dispatch(
        updateLocalCartQuantity({
          product_id: productId,
          quantity: safeQty,
          size,
          color,
          variant_id,
        } as any),
      );
      return;
    }
    debouncedUpdate(productId, safeQty, size, color, variant_id);
  };

  const handleRemove = async (
    productId: string,
    variant_id?: string | null,
    _variant_options?: Record<string, string> | null,
    size?: string | null,
    color?: string | null,
  ) => {
    if (!isAuthenticated) {
      dispatch(
        removeLocalCartItem({
          product_id: productId,
          size,
          color,
          variant_id,
        } as any),
      );
      toast.success("Item removed from cart");
      return;
    }
    try {
      await removeCartItem({
        productId,
        size,
        color,
        variant_id,
      } as any).unwrap();
      toast.success("Item removed from cart");
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to remove item"));
    }
  };

  const handleClearCart = async () => {
    if (!isAuthenticated) {
      dispatch(clearLocalCartAction());
      toast.success("Cart cleared");
      return;
    }
    try {
      await clearCart().unwrap();
      toast.success("Cart cleared");
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to clear cart"));
    }
  };

  /* ───────── UI ───────── */
  return (
    <section className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 py-24 px-4 sm:px-8 transition-colors duration-300">
      <div className="w-full mx-auto px-0 sm:px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Page Header */}
        <div className="px-4 sm:px-0 flex items-end justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              Shopping Cart
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">
              You have {cartItems.length}{" "}
              {cartItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (
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
              {cartItems.map((item: ICartItem) => (
                <CartItem
                  key={getItemKey(
                    item.product_id,
                    item.variant_id,
                    item.variant_options,
                    item.size,
                    item.color,
                  )}
                  item={item}
                  quantity={
                    localQty[
                      getItemKey(
                        item.product_id,
                        item.variant_id,
                        item.variant_options,
                        item.size,
                        item.color,
                      )
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
                subtotal={subtotal}
                shipping={shipping}
                serviceCharge={platformFee}
                total={total}
                onClear={handleClearCart}
                previewHref={
                  isAuthenticated
                    ? WEBSITE_ROUTES.CHECKOUT
                    : `${AUTH_ROUTES.LOGIN}?redirect=${encodeURIComponent(WEBSITE_ROUTES.CHECKOUT)}`
                }
                continueShoppingHref={WEBSITE_ROUTES.DISCOVERY}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
