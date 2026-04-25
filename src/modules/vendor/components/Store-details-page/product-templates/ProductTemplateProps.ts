import type {
  IProductDetails,
  IProductStore,
  IProductReview,
  IProduct,
} from "@/types/product/productTypes";

export interface ProductTemplateProps {
  store: IProductStore;
  product: IProductDetails;
  reviews: IProductReview[];
  relatedProducts: IProduct[];
  onCartOpen: () => void;
  cartItemsCount: number;
  onMessageVendor?: () => void;
  isMessagingLoading?: boolean;
}
