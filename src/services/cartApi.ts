import { apiManager } from "./apiManager";

/* ───────────────── TYPES ───────────────── */

export interface ICartItem {
  product_id: string;
  name: string;
  slug: string;

  price: number;
  discount_price?: number | null;

  quantity: number;

  image?: string | null;
  size?: string | null;
  color?: string | null;

  shipping_cost?: number | null;
}

export interface ICart {
  id: string;
  items: ICartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export interface GetCartResponse {
  status: "success" | "error";
  message: string;
  data: {
    cart: ICart;
  };
}

/* ───────────────── DTO ARGS ───────────────── */

export interface AddToCartArgs {
  product_id: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
}

export interface UpdateCartItemArgs {
  productId: string;
  quantity?: number;
  size?: string | null;
  color?: string | null;
}

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
