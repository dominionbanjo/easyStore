import React, { useState, useEffect } from "react";
import { Modal } from "@/components/shared/Modal";
import { useSearchProductsQuery, useGetAllProductsQuery } from "@/services/productApi";
import { Search, Loader2, Package, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: any) => void;
}

export const ProductPicker: React.FC<ProductPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  const { data: searchData, isLoading: isSearching } = useSearchProductsQuery(
    { q: debouncedSearchTerm, limit: 12 }, 
    { skip: !isOpen || !debouncedSearchTerm.trim() }
  );
  
  const { data: recentData, isLoading: isLoadingRecent } = useGetAllProductsQuery(
    { limit: 12 }, 
    { skip: !isOpen || !!searchTerm.trim() }
  );

  const isLoading = (searchTerm.trim() && debouncedSearchTerm !== searchTerm) || isSearching || isLoadingRecent;
  const products = (searchTerm.trim() ? searchData : recentData)?.data?.items || [];

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Attach Product"
      description="Search for a product to share it in this chat."
      className="max-w-[500px]"
    >
      <div className="p-4 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search all products..."
            className="pl-9 h-11 rounded-sm border-2 focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!searchTerm.trim() && products.length > 0 && (
          <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground bg-muted/20 px-3 py-1.5 rounded-sm">
            <History className="h-3 w-3" />
            Recent Products
          </div>
        )}

        <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar grid grid-cols-1 gap-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-sm">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">Searching catalog...</p>
            </div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelect(product)}
                className="flex items-center gap-4 p-3 rounded-sm border border-border hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="h-14 w-14 rounded-sm overflow-hidden bg-muted border border-border group-hover:scale-105 transition-transform">
                  {product.image ? (
                    <img
                      src={typeof product.image === "string" ? product.image : product.image.url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{product.name}</p>
                  <p className="text-primary text-xs font-bold mt-0.5">
                    ₦{Number(product.price).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                    {(product as any).brand || (product as any).store_name || "Eazystore"}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="rounded-sm text-[10px] h-7">
                  ATTACH
                </Button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
              <Package className="h-12 w-12 mb-4" />
              <p className="text-sm font-medium">No products found</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
