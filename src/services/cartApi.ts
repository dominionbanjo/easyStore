import type {
  AddToCartArgs,
  GetCartResponse,
  UpdateCartItemArgs,
} from "@/types/cart/cartTypes";
import { apiManager } from "./apiManager";

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
      query: (body) => ({
        url: "cart/items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    /* ───────── UPDATE ITEM ───────── */

    updateCartItem: builder.mutation<GetCartResponse, UpdateCartItemArgs>({
      query: ({ productId, ...body }) => ({
        url: `cart/items/${productId}`,
        method: "PATCH",
        body,
      }),
      onQueryStarted: async (
        { productId, quantity, size, color },
        { dispatch, queryFulfilled },
      ) => {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const cart = draft.data.cart;
            const itemIndex = cart.items.findIndex(
              (item) =>
                item.product_id === productId &&
                (size ? item.size === size : true) &&
                (color ? item.color === color : true),
            );

            if (itemIndex !== -1) {
              if (quantity !== undefined) {
                cart.items[itemIndex].quantity = quantity;
              }
              // Recalculate subtotal/total roughly (frontend optimistic)
              // Note: Accurate calculation requires backend logic for discounts/shipping
              // This acts as a visual feedback until revalidation
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
      { productId: string; size?: string | null; color?: string | null }
    >({
      query: ({ productId, size, color }) => ({
        url: `cart/items/${productId}${
          size || color
            ? `?${size ? `size=${encodeURIComponent(size)}` : ""}${
                size && color ? "&" : ""
              }${color ? `color=${encodeURIComponent(color)}` : ""}`
            : ""
        }`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
      onQueryStarted: async (
        { productId, size, color },
        { dispatch, queryFulfilled },
      ) => {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const cart = draft.data.cart;
            cart.items = cart.items.filter(
              (item) =>
                !(
                  item.product_id === productId &&
                  (size ? item.size === size : true) &&
                  (color ? item.color === color : true)
                ),
            );
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
