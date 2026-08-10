import type { RefObject } from "react";
import type {
  IStoreDetails,
  IStoreCategory,
  IStoreProduct,
} from "@/types/Store/storeTypes";

export interface StoreTemplateProps {
  store: IStoreDetails;
  categories: IStoreCategory[];
  products: IStoreProduct[];
  productsTotal: number;
  isProductsLoading: boolean;
  isProductsFetching: boolean;
  isCategoriesLoading: boolean;

  // View state
  activeTab: "products" | "categories";
  selectedCategory: { id: string; name: string } | null;
  searchQuery: string;
  isSearching: boolean;
  productsKey: string;
  sentinelRef: RefObject<HTMLDivElement | null>;

  // Cart info
  onCartOpen: () => void;
  cartItemsCount: number;

  // Actions
  onTabChange: (tab: "products" | "categories") => void;
  onCategorySelect: (category: { id: string; name: string } | null) => void;
  onSearchChange: (query: string) => void;
  onMessageVendor?: () => void;
  isMessagingLoading?: boolean;
}
