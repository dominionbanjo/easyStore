import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useGetSalesTerminalProductsQuery, useGetSalesTerminalCategoriesQuery, useRecordOfflineSaleMutation, useLazyLookupByBarcodeQuery, type SalesTerminalProduct } from "@/services/salesApi";
import {
  addToSaleCart,
  updateSaleCartQuantity,
  removeSaleCartItem,
  setSaleCustomerName,
  setSaleCustomerEmail,
  setSalePaymentMethod,
  clearSaleCart,
} from "@/features/saleCartSlice";
import type { PaymentMethod } from "@/features/saleCartSlice";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Minus, Plus, Trash2, X, Barcode } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SalesReceiptModal } from "@/modules/vendor/components/sales-history/SalesReceiptModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { VariantSelectionModal } from "@/modules/vendor/components/sales-terminal/VariantSelectionModal";

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="p-3">
          <div className="aspect-square bg-muted animate-pulse rounded-lg mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4 mb-1" />
          <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function SalesTerminalPage() {
  const dispatch = useAppDispatch();
  const saleCart = useAppSelector((s) => s.saleCart);

  const [pageByCategory, setPageByCategory] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const pageKey = activeCategory ?? '__all__';
  const currentPage = pageByCategory[pageKey] ?? 1;
  const [viewMode, setViewMode] = useState<"products" | "cart">("products");
  const [receiptOrderId, setReceiptOrderId] = useState<string | null>(null);
  const [showSaleConfirm, setShowSaleConfirm] = useState(false);
  const [variantModalProduct, setVariantModalProduct] = useState<SalesTerminalProduct | null>(null);

  const { data: productsData, isLoading, isFetching } = useGetSalesTerminalProductsQuery({
    page: currentPage,
    limit: 24,
    q: debouncedSearch || undefined,
    category: activeCategory,
  });

  const { data: categories } = useGetSalesTerminalCategoriesQuery();

  const [recordSale, { isLoading: isSaving }] = useRecordOfflineSaleMutation();
  const [lookupBarcode] = useLazyLookupByBarcodeQuery();
  const [scanValue, setScanValue] = useState("");

  const cartTotal = useMemo(() => {
    return saleCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [saleCart.items]);

  const totalItems = saleCart.items.reduce((sum, i) => sum + i.quantity, 0);

  const addToCart = useCallback(
    (product: { id: string; name: string; price: number; image: string | null }, variant?: { id: string; price: number; image_url: string | null; combinations: Record<string, string> }) => {
      dispatch(
        addToSaleCart({
          product_id: product.id,
          variant_id: variant?.id,
          name: product.name + (variant ? ` (${Object.values(variant.combinations || {}).join(", ")})` : ""),
          price: variant ? variant.price : product.price,
          quantity: 1,
          image: variant?.image_url || product.image,
        })
      );
    },
    [dispatch]
  );

  const handleBarcodeScan = useCallback(async (code: string) => {
    if (!code || code.length < 3) return;
    try {
      const result = await lookupBarcode(code).unwrap();
      if (result.product) {
        addToCart(
          { id: result.product.id, name: result.product.name, price: result.product.price, image: result.product.image },
          result.variant
            ? { id: result.variant.id, price: result.variant.price, image_url: result.variant.image_url, combinations: result.variant.combinations }
            : undefined,
        );
        toast.success(`Scanned: ${result.variant ? `${result.product.name} (${Object.values(result.variant.combinations).join(", ")})` : result.product.name}`);
      }
    } catch {
      toast.error("Product not found for this barcode");
    }
  }, [lookupBarcode, addToCart]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPageByCategory((prev) => ({ ...prev, [pageKey]: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPageByCategory((prev) => ({ ...prev, [pageKey]: newPage }));
  };

  const handleCategoryClick = (cat: string | undefined) => {
    setActiveCategory(cat === activeCategory ? undefined : cat);
  };

  const updateQty = (productId: string, variantId: string | undefined, delta: number) => {
    const item = saleCart.items.find((i) => i.product_id === productId && i.variant_id === variantId);
    if (item) {
      dispatch(updateSaleCartQuantity({ product_id: productId, variant_id: variantId, quantity: item.quantity + delta }));
    }
  };

  const handleCompleteSale = useCallback(async () => {
    if (saleCart.items.length === 0) {
      toast.error("Add items to the cart first");
      return;
    }
    if (!saleCart.paymentMethod) {
      toast.error("Select a payment method before completing the sale");
      return;
    }
    try {
      const result = await recordSale({
        items: saleCart.items.map((i) => ({ product_id: i.product_id, variant_id: i.variant_id, quantity: i.quantity })),
        customer_name: saleCart.customerName || undefined,
        customer_email: saleCart.customerEmail || undefined,
        payment_method: saleCart.paymentMethod || undefined,
      }).unwrap();
      setShowSaleConfirm(false);
      toast.success("Sale completed successfully!");
      setReceiptOrderId(result.order_id);
      dispatch(clearSaleCart());
      setViewMode("products");
    } catch (err: unknown) {
      const message = err instanceof Object && "data" in err ? (err as { data: { message: string } }).data?.message : "Sale failed";
      toast.error(message || "Sale failed");
    }
  }, [saleCart, recordSale, dispatch]);

  const products = productsData?.items ?? [];
  const pagination = productsData?.pagination;

  const renderProductGrid = () => {
    if (isLoading && !productsData) {
      return <SkeletonGrid />;
    }

    if (products.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-16">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg">No products found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      );
    }

    const grid = activeCategory ? (
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{activeCategory}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {(products ?? []).map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} onOpenVariant={setVariantModalProduct} />
          ))}
        </div>
      </div>
    ) : (
      Object.entries(
        (products ?? []).reduce<Record<string, typeof products>>((acc, p) => {
          const cat = p.category || "Uncategorized";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(p);
          return acc;
        }, {})
      ).map(([category, categoryProducts]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} onOpenVariant={setVariantModalProduct} />
            ))}
          </div>
        </div>
      ))
    );

    return (
      <>
        {(isFetching && productsData) ? (
          <div className="space-y-6 opacity-60 transition-opacity">
            {grid}
            <SkeletonGrid />
          </div>
        ) : grid}
      </>
    );
  };

  /* ─── Shared cart panel content ─── */
  const cartPanel = (
    <>
      <div className="h-14 px-4 border-b flex items-center gap-2 shrink-0">
        <ShoppingCart className="h-5 w-5" />
        <h2 className="font-semibold">Cart</h2>
        <span className="text-sm text-muted-foreground ml-auto">{totalItems} items</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {saleCart.items.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Click products to add them to the sale</p>
          </div>
        ) : (
          saleCart.items.map((item, idx) => (
            <div key={`${item.product_id}-${item.variant_id}-${idx}`} className="flex gap-3 bg-muted/50 rounded-lg p-3">
              <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg"><ShoppingCart className="h-5 w-5" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-sm text-primary font-semibold">₦{(item.price / 100).toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => updateQty(item.product_id, item.variant_id, -1)}
                    className="h-6 w-6 rounded bg-background flex items-center justify-center hover:bg-muted"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.product_id, item.variant_id, 1)}
                    className="h-6 w-6 rounded bg-background flex items-center justify-center hover:bg-muted"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => dispatch(removeSaleCartItem({ product_id: item.product_id, variant_id: item.variant_id }))}
                    className="ml-auto h-6 w-6 rounded bg-background flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sticky footer — always visible */}
      <div className="border-t p-4 space-y-3 shrink-0 bg-background">
        <div className="space-y-2">
          <Input
            placeholder="Customer name (optional)"
            value={saleCart.customerName}
            onChange={(e) => dispatch(setSaleCustomerName(e.target.value))}
          />
          <Input
            placeholder="Customer email (optional)"
            type="email"
            value={saleCart.customerEmail}
            onChange={(e) => dispatch(setSaleCustomerEmail(e.target.value))}
          />
        </div>

        <div>
          {!saleCart.paymentMethod && (
            <p className="text-xs text-destructive font-medium mb-1.5">Select a payment method</p>
          )}
          <div className="flex gap-2">
          {(["cash", "transfer", "pos"] as PaymentMethod[]).map((method) => (
            <button
              key={method}
              onClick={() => dispatch(setSalePaymentMethod(method))}
              className={`flex-1 py-2 rounded-sm text-sm font-medium uppercase tracking-wider transition-colors ${
                saleCart.paymentMethod === method
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {method === "pos" ? "POS" : method}
            </button>
              ))}
        </div>
        </div>

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">₦{(cartTotal / 100).toLocaleString()}</span>
        </div>
        <Button className="w-full h-12 text-lg" onClick={() => setShowSaleConfirm(true)} isLoading={isSaving} disabled={saleCart.items.length === 0 || !saleCart.paymentMethod}>
          Complete Sale
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex flex-1 min-h-0 gap-0">
      {/* ─── Product Grid (desktop always visible, mobile toggles) ─── */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden",
        viewMode === "cart" && "hidden lg:flex"
      )}>
        <div className="h-14 px-4 border-b flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative w-44">
            <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Scan barcode..."
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && scanValue.trim()) {
                  handleBarcodeScan(scanValue.trim());
                  setScanValue("");
                }
              }}
              className="pl-10 font-mono text-sm"
            />
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
            {pagination ? `Page ${currentPage} of ${pagination.pages} — ${pagination.total} products` : ""}
          </span>
        </div>

        <div className="flex gap-2 p-4 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory(undefined)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !activeCategory ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            All {categories ? `(${categories.reduce((s, c) => s + c.count, 0)})` : ""}
          </button>
          {(categories ?? []).map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.name ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {renderProductGrid()}

          {pagination && pagination.pages > 1 && (
            <Pagination
              page={currentPage}
              pages={pagination.pages}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* ─── Cart Panel (desktop always visible, mobile toggles) ─── */}
      <div className={cn(
        "w-96 border-l bg-background flex flex-col",
        viewMode === "products" && "hidden lg:flex"
      )}>
        {viewMode === "cart" && (
          <div className="lg:hidden flex items-center gap-2 p-3 border-b shrink-0">
            <button onClick={() => setViewMode("products")} className="flex items-center gap-1 text-sm font-medium text-primary">
              <X className="h-4 w-4" />
              Back to products
            </button>
          </div>
        )}
        {cartPanel}
      </div>

      {/* ─── Receipt Modal after sale ─── */}
      <SalesReceiptModal
        orderId={receiptOrderId}
        open={!!receiptOrderId}
        onOpenChange={(open) => { if (!open) setReceiptOrderId(null); }}
      />

      {/* ─── Variant Selection Modal ─── */}
      <VariantSelectionModal
        product={variantModalProduct}
        open={!!variantModalProduct}
        onOpenChange={(open) => { if (!open) setVariantModalProduct(null); }}
        onConfirm={addToCart}
      />

      {/* ─── Confirm Sale Dialog ─── */}
      <ConfirmDialog
        open={showSaleConfirm}
        onOpenChange={setShowSaleConfirm}
        onConfirm={handleCompleteSale}
        title="Complete Sale"
        description={`Confirm sale of ${totalItems} item${totalItems === 1 ? "" : "s"} for ${(cartTotal / 100).toLocaleString()}?`}
        confirmText="Complete Sale"
        isLoading={isSaving}
      />

      {/* ─── Mobile FAB: Cart button (products view) ─── */}
      {viewMode === "products" && totalItems > 0 && (
        <button
          onClick={() => setViewMode("cart")}
          className="fixed bottom-20 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg flex items-center gap-2 lg:hidden"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="font-bold text-base">{totalItems}</span>
        </button>
      )}
    </div>
  );
}

function ProductCard({
  product,
  onAdd,
  onOpenVariant,
}: {
  product: SalesTerminalProduct;
  onAdd: (product: { id: string; name: string; price: number; image: string | null }, variant?: { id: string; price: number; image_url: string | null; combinations: Record<string, string> }) => void;
  onOpenVariant?: (product: SalesTerminalProduct) => void;
}) {
  const handleClick = () => {
    if (product.variants.length > 0 && onOpenVariant) {
      onOpenVariant(product);
    } else {
      onAdd(product);
    }
  };

  return (
    <Card
      className="p-2 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl">
            <ShoppingCart className="h-6 w-6" />
          </div>
        )}
      </div>
      <p title={product.name} className="font-medium text-xs sm:text-sm line-clamp-2 break-words">{product.name}</p>
      <p className="text-primary text-sm font-bold mt-1 truncate">₦{(product.price / 100).toLocaleString()}</p>
      {product.stock <= 5 && (
        <p className="text-xs text-amber-600 mt-1">{product.stock} left</p>
      )}
    </Card>
  );
}
