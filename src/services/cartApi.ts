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
      invalidatesTags: ["Cart"],
    }),

    /* ───────── REMOVE ITEM ───────── */

    removeCartItem: builder.mutation<GetCartResponse, string>({
      query: (productId) => ({
        url: `cart/items/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
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
