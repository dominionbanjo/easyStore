import type {
  AddToCartArgs,
  GetCartResponse,
  UpdateCartItemArgs,
} from "@/types/cart/cartTypes";
import { apiManager } from "./apiManager";

/* ───────────────── CONTROLLERS ───────────────── */
// Track active requests to allow cancellation of previous ones
const cartMutationControllers = new Map<string, AbortController>();

const getAbortSignal = (key: string) => {
  if (cartMutationControllers.has(key)) {
    cartMutationControllers.get(key)?.abort();
  }
  const controller = new AbortController();
  cartMutationControllers.set(key, controller);
  return controller.signal;
};

/* ───────────────── API ───────────────── */

export const cartApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── GET CART ───────── */

    getCart: builder.query<GetCartResponse, void>({
      query: () => ({
        url: "cart",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    /* ───────── ADD ITEM ───────── */

    addItemToCart: builder.mutation<GetCartResponse, AddToCartArgs>({
      query: (body) => {
        const key = `add-${body.product_id}-${body.variant_id || "none"}`;
        return {
          url: "cart/items",
          method: "POST",
          body,
          signal: getAbortSignal(key),
        };
      },
      invalidatesTags: ["Cart"],
    }),

    /* ───────── UPDATE ITEM ───────── */

    updateCartItem: builder.mutation<GetCartResponse, UpdateCartItemArgs>({
      query: ({ productId, ...body }) => {
        const key = `update-${productId}-${body.variant_id || "none"}`;
        return {
          url: `cart/items/${productId}`,
          method: "PATCH",
          body,
          signal: getAbortSignal(key),
        };
      },
      invalidatesTags: ["Cart"],
      onQueryStarted: async (
        { productId, quantity, size, color, variant_id },
        { dispatch, queryFulfilled },
      ) => {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const cart = draft.data.cart;
            const itemIndex = cart.items.findIndex(
              (item) =>
                item.product_id === productId &&
                (item.variant_id || null) === (variant_id || null) &&
                (item.size || null) === (size || null) &&
                (item.color || null) === (color || null),
            );

            if (itemIndex !== -1 && quantity !== undefined) {
              cart.items[itemIndex].quantity = quantity;

              // Recalculate subtotal/total roughly for visual feedback
              let newSubtotal = 0;
              cart.items.forEach((item) => {
                const itemPrice = item.discount_price ?? item.price;
                newSubtotal += itemPrice * item.quantity;
              });

              cart.subtotal = newSubtotal;
              cart.total =
                newSubtotal + (cart.shipping || 0) + (cart.platform_fee || 0);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /* ───────── REMOVE ITEM ───────── */

    removeCartItem: builder.mutation<
      GetCartResponse,
      {
        productId: string;
        size?: string | null;
        color?: string | null;
        variant_id?: string | null;
      }
    >({
      query: ({ productId, size, color, variant_id }) => ({
        url: `cart/items/${productId}${
          size || color || variant_id
            ? `?${size ? `size=${encodeURIComponent(size)}` : ""}${
                size && (color || variant_id) ? "&" : ""
              }${color ? `color=${encodeURIComponent(color)}` : ""}${
                color && variant_id ? "&" : ""
              }${variant_id ? `variant_id=${encodeURIComponent(variant_id)}` : ""}`
            : ""
        }`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
      onQueryStarted: async (
        { productId, size, color, variant_id },
        { dispatch, queryFulfilled },
      ) => {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const cart = draft.data.cart;
            cart.items = cart.items.filter(
              (item) =>
                !(
                  item.product_id === productId &&
                  (item.variant_id || null) === (variant_id || null) &&
                  (item.size || null) === (size || null) &&
                  (item.color || null) === (color || null)
                ),
            );

            // Recalculate totals
            let newSubtotal = 0;
            cart.items.forEach((item) => {
              const itemPrice = item.discount_price ?? item.price;
              newSubtotal += itemPrice * item.quantity;
            });
            cart.subtotal = newSubtotal;
            cart.total =
              newSubtotal + (cart.shipping || 0) + (cart.platform_fee || 0);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /* ───────── CLEAR CART ───────── */

    clearCart: builder.mutation<
      {
        message: string;
        cart: {
          items: [];
          subtotal: 0;
          shipping: 0;
          total: 0;
        };
      },
      void
    >({
      query: () => ({
        url: "cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

/* ───────────────── HOOK EXPORTS ───────────────── */

export const {
  useGetCartQuery,
  useAddItemToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
