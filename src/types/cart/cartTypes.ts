/* ───────────────── TYPES ───────────────── */

export interface ICartItem {
  product_id: string;
  vendor_id: string;
  name: string;
  slug: string;

  price: number;
  discount_price?: number | null;

  quantity: number;

  image?: string | null;
  size?: string | null;
  color?: string | null;
  color_hex?: string | null;

  shipping_cost?: number | null;
}

export interface ICart {
  id: string;
  items: ICartItem[];
  subtotal: number;
  shipping: number;
  platform_fee: number;
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
