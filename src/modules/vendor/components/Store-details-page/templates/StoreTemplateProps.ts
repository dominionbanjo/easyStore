import type {
  IStoreDetails,
  IStoreCategory,
  IStoreProduct,
  IStorePagination,
} from "@/types/Store/storeTypes";

export interface StoreTemplateProps {
  store: IStoreDetails;
  categories: IStoreCategory[];
  products: IStoreProduct[];
  pagination: IStorePagination;
  isProductsLoading: boolean;
  isProductsFetching: boolean;
  isCategoriesLoading: boolean;

  // View state
  activeTab: "products" | "categories";
  selectedCategory: { id: string; name: string } | null;
  searchQuery: string;
  isSearching: boolean;
  page: number;
  productsKey: string;

  // Cart info
  onCartOpen: () => void;
  cartItemsCount: number;

  // Actions
  onTabChange: (tab: "products" | "categories") => void;
  onCategorySelect: (category: { id: string; name: string } | null) => void;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onMessageVendor?: () => void;
}
