import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/shared/ProductCard";
import { Pagination } from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { USER_ROUTES } from "@/routes/temp";

type Props = {
  products: any[];
  pagination?: {
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  isLoading: boolean;
  selectedCategory?: { id: string; name: string } | null;
  onBackToCategories?: () => void;
  onPageChange: (page: number) => void;
};

export function StoreProductsGrid({
  products,
  pagination,
  isLoading,
  selectedCategory,
  onBackToCategories,
  onPageChange,
}: Props) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[280px] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <p className="text-center text-muted-foreground py-20">
        No products found.
      </p>
    );
  }

  return (
    <>
      {selectedCategory && (
        <div className="mb-6 flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={onBackToCategories}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to categories
          </Button>

          <p className="text-sm text-muted-foreground">
            Showing products in <strong>{selectedCategory.name}</strong>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard.Root
            key={product.id}
            id={product.id}
            image={product.image}
            name={product.name}
            price={`₦${product.price.toLocaleString("en-NG")}`}
            category=""
            rating={Number(product.rating_average ?? 0)}
            stock={product.stock ?? 0}
          >
            <ProductCard.Image />
            <ProductCard.Info
              onClick={() =>
                navigate(`${USER_ROUTES.PRODUCT_DETAIL}/${product.slug}`)
              }
            />
          </ProductCard.Root>
        ))}
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
