import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SetupEnforcementModal } from "@/modules/vendor/components/modals/SetupEnforcementModal";
import { WelcomeProductModal } from "@/modules/vendor/components/modals/WelcomeProductModal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  Package,
  Download,
  List,
  SearchX,
  X,
  LayoutGrid,
} from "lucide-react";

import { DataTable } from "@/components/shared/DataTable";
import { useGetMyStoreProductsQuery } from "@/services/productApi";
import type { IStoreProduct } from "@/types/product/productTypes";
import { productColumns } from "@/modules/vendor/columns/productColumns";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { clearProductDraft } from "@/features/productDraftSlice";
import { getAppPath, getWebsitePath } from "@/utils/subdomain";
import { DraftRecoveryModal } from "@/modules/vendor/components/modals/DraftRecoveryModal";
import type { RootState } from "@/store";
import { Modal } from "@/components/shared/Modal";
import {
  Eye,
  Edit,
  Trash,
  Slash,
  TickCircle,
  Tag2,
} from "iconsax-react";
import {
  useDeleteProductMutation,
  useUpdateProductOnSaleMutation,
  useUpdateProductStatusMutation,
} from "@/services/productApi";
import { useGetMyStoreQuery } from "@/services/storeApi";
import { ProductShareAction } from "@/modules/vendor/components/dashboard/ProductShareAction";
import { ConfirmDeleteDialog } from "@/modules/vendor/components/ConfirmDeleteDialog";
import { toast } from "sonner";

/* ───────────────── CONSTANTS ───────────────── */
const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

/* ───────────────── PAGE ───────────────── */
export default function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isOutOfStock, setIsOutOfStock] = useState<boolean | undefined>(
    undefined,
  );
  const [onSale, setOnSale] = useState<boolean | undefined>(undefined);
  const [status, setStatus] = useState<"active" | "inactive" | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IStoreProduct | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const [updateStatus, { isLoading: updatingStatus }] =
    useUpdateProductStatusMutation();
  const [updateOnSale, { isLoading: updatingOnSale }] =
    useUpdateProductOnSaleMutation();

  const draftData = useSelector((state: RootState) => state.productDraft.data);

  /* ─── Debounce search input ─── */
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(id);
  }, [search]);

  /* ─── Check for first-time setup completion ─── */
  useEffect(() => {
    if (searchParams.get("setup") === "success") {
      setShowWelcomeModal(true);
      // Clean up the URL after showing the modal
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("setup");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  /* Reset page when filters change */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, isOutOfStock, onSale, status]);

  /* ─── PRODUCTS QUERY (Unified) ─── */
  const { data, isLoading, isFetching, isError } = useGetMyStoreProductsQuery({
    q: debouncedSearch,
    page,
    limit: PAGE_SIZE,
    isOutOfStock: isOutOfStock === undefined ? undefined : String(isOutOfStock),
    onSale: onSale === undefined ? undefined : String(onSale),
    status,
  });
  const { data: storeData } = useGetMyStoreQuery();

  const isActuallyLoading =
    isLoading || isFetching || search.trim() !== debouncedSearch;
  const items: IStoreProduct[] = data?.data.items ?? [];
  const pagination = data?.data.pagination;

  const isSearching =
    debouncedSearch.length > 0 ||
    isOutOfStock !== undefined ||
    onSale !== undefined ||
    status !== undefined;

  /* ─── Trigger welcome modal if empty store ─── */
  useEffect(() => {
    if (!isActuallyLoading && items.length === 0 && !isSearching && !isError) {
      // Small delay to ensure smooth UX
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isActuallyLoading, items.length, isSearching, isError]);

  /* ─── HANDLERS ─── */
  const clearFilters = () => {
    setSearch("");
    setIsOutOfStock(undefined);
    setOnSale(undefined);
    setStatus(undefined);
  };

  const handleAddNewProduct = () => {
    dispatch(clearProductDraft());
    navigate(getAppPath("/products/new"));
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Package className="h-12 w-12 text-muted-foreground/30" />
        <p className="text-muted-foreground text-sm">
          Failed to load products. Please check your connection.
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // definitions moved above for effects

  return (
    <section className="space-y-6 md:space-y-8 pb-10">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
        <div className="flex items-center gap-3"
        >
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex gap-2 border-border/60"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            className="bg-primary text-primary-foreground gap-2 rounded-sm  "
            onClick={() => {
              if (draftData) {
                setShowRecoveryModal(true);
              } else {
                dispatch(clearProductDraft());
                navigate(getAppPath("/products/new"));
              }
            }}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>

          <DraftRecoveryModal
            open={showRecoveryModal}
            onOpenChange={setShowRecoveryModal}
            draft={draftData}
            onContinue={() => {
              setShowRecoveryModal(false);
              navigate(getAppPath("/products/new"));
            }}
            onDiscard={() => {
              dispatch(clearProductDraft());
              setShowRecoveryModal(false);
              navigate(getAppPath("/products/new"));
            }}
          />
        </div>
      </div>

      {/* ─── Toolbar (Search & Filters) ─── */}
      <div className="flex flex-col gap-4 bg-card/50 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-sm border border-border/40  transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <div className="relative w-full sm:flex-1 group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Find products by name, tag or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-background/50 border-border/40 focus:bg-background transition-all rounded-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
            {/* Status Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={status !== undefined ? "secondary" : "outline"}
                  className="gap-2 h-10 border-dashed rounded-sm shrink-0"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span className="text-xs uppercase tracking-wider font-bold">
                    {status === undefined ? "Status" : status}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-48 p-1.5 rounded-sm border-border/40"
                align="end"
              >
                <div className="space-y-1">
                  {["all", "active", "inactive"].map((s) => (
                    <Button
                      key={s}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start font-medium rounded-sm",
                        (status === undefined && s === "all") || status === s
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground",
                      )}
                      onClick={() =>
                        setStatus(
                          s === "all"
                            ? undefined
                            : (s as "active" | "inactive"),
                        )
                      }
                    >
                      {s === "active" && (
                        <span className="h-2 w-2 rounded-sm bg-emerald-500 mr-2" />
                      )}
                      {s === "inactive" && (
                        <span className="h-2 w-2 rounded-sm bg-slate-400 mr-2" />
                      )}
                      <span className="capitalize">
                        {s === "all" ? "All Visibilities" : s}
                      </span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Out of Stock Filter (Checkbox) */}
            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border/40 rounded-sm hover:bg-background transition-all duration-200 cursor-pointer group shrink-0">
              <Checkbox
                id="out_of_stock"
                checked={isOutOfStock === true}
                onCheckedChange={(checked) =>
                  setIsOutOfStock(checked === true ? true : undefined)
                }
                className="rounded-sm border-border/60 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
              />
              <Label
                htmlFor="out_of_stock"
                className="text-xs font-bold uppercase tracking-widest cursor-pointer select-none text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
              >
                Out of Stock
              </Label>
            </div>

            {/* Sale Filter (Checkbox) */}
            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border/40 rounded-sm hover:bg-background transition-all duration-200 cursor-pointer group shrink-0">
              <Checkbox
                id="on_sale"
                checked={onSale === true}
                onCheckedChange={(checked) =>
                  setOnSale(checked === true ? true : undefined)
                }
                className="rounded-sm border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor="on_sale"
                className="text-xs font-bold uppercase tracking-widest cursor-pointer select-none text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
              >
                On Sale
              </Label>
            </div>

            {isSearching && (
              <Button
                variant="ghost"
                size="sm"
                className="h-10 px-3 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={clearFilters}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Products Table / Grid ─── */}
      {!isActuallyLoading && items.length === 0 && !isSearching ? (
        <div className="border-2 border-dashed border-border/60 rounded-sm bg-card/10 p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] sm:min-h-[500px]"
        >
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-sm bg-primary/10 flex items-center justify-center  relative">
            <div className="absolute inset-0 rounded-sm bg-primary/20 animate-ping opacity-20" />
            <Package className="h-10 w-10 sm:h-12 sm:w-12 text-primary relative z-10" />
          </div>

          <div className="max-w-md space-y-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Add your first product!
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              It looks like your store is empty right now. Start adding your
              products or services to begin selling.
            </p>
          </div>

          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6 sm:px-8 rounded-sm   gap-2 font-bold uppercase tracking-widest text-[10px] sm:text-xs"
            onClick={() => {
              if (draftData) {
                setShowRecoveryModal(true);
              } else {
                dispatch(clearProductDraft());
                navigate(getAppPath("/products/new"));
              }
            }}
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            Create Product
          </Button>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="flex flex-row items-center justify-between px-1">
            <h3 className="text-lg font-bold">Inventory Overview</h3>
            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-sm border border-border/40">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-sm",
                  viewMode === "table" && "bg-background ",
                )}
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-sm",
                  viewMode === "grid" && "bg-background ",
                )}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>

            {viewMode === "table" ? (
              <div>
                <DataTable<IStoreProduct, unknown>
                  columns={productColumns}
                  data={items}
                  isLoading={isActuallyLoading}
                  onRowClick={(product) => setSelectedProduct(product)}
                  className="border-none"
                  emptyMessage={
                    isSearching
                      ? "No products match your search"
                      : "No products found"
                  }
                  pagination={
                    pagination
                      ? {
                        page: pagination.page,
                        pages: pagination.pages,
                        limit: PAGE_SIZE,
                        hasNext: pagination.hasNext,
                        hasPrev: pagination.hasPrev,
                        onPageChange: setPage,
                      }
                      : undefined
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4"
              >
                {isActuallyLoading ? (
                  // Grid Skeleton
                  [...Array(8)].map((_, i) => (
                    <Card
                      key={i}
                      className="p-2 rounded-sm border-border/40 animate-pulse bg-card"
                    >
                      <div className="aspect-square bg-muted rounded-sm" />
                      <CardContent className="p-3 pt-4 space-y-3">
                        {" "}
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : items.length > 0 ? (
                  items.map((product) => (
                    <Card
                      key={product.id}
                      className="p-2 rounded-sm border-border/40 hover:border-primary/40 transition-all group bg-card  hover: cursor-pointer"
                      onClick={() => {
                        const path = getWebsitePath(`/product/${product.slug}`);
                        if (path?.startsWith("http")) {
                          window.location.href = path;
                        } else if (path) {
                          navigate(path);
                        }
                      }}
                    >
                      <div className="aspect-square relative overflow-hidden rounded-sm bg-muted/20">
                        <img
                          src={product.image?.url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          <Badge
                            variant={
                              product.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {product.status}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-2 pt-3">
                        <p
                          title={product.name}
                          className="text-xs sm:text-sm font-bold line-clamp-1 break-words"
                        >
                          {product.name}
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-1.5">
                          <p className="text-primary text-sm font-bold truncate min-w-0">
                            ₦{Number(product.price).toLocaleString()}
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                            Stock: {product.stock}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full h-[400px] flex flex-col items-center justify-center gap-3">
                    <div className="p-4 rounded-sm bg-muted/50 text-muted-foreground/40">
                      <SearchX className="h-10 w-10" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-base font-semibold text-foreground">
                        No products found
                      </p>
                      <p className="text-sm text-muted-foreground max-w-[200px]">
                        Try adjusting your filters or search terms.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
      )}

      <SetupEnforcementModal
        open={showSetupModal}
        onOpenChange={setShowSetupModal}
      />

      <WelcomeProductModal
        open={showWelcomeModal}
        onOpenChange={setShowWelcomeModal}
        onAddProduct={handleAddNewProduct}
      />

      {/* ─── Product Quick View Modal ─── */}
      <Modal
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        className="sm:max-w-md"
        contentClassName="p-0"
      >
        {selectedProduct && (
          <div className="flex flex-col">
            {/* Modal Header Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={selectedProduct.image?.url}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-white/80 text-xs font-medium uppercase tracking-widest mt-1">
                      {selectedProduct.category_ref?.name}
                    </p>
                  </div>
                  <Badge
                    variant={
                      selectedProduct.status === "active"
                        ? "default"
                        : "secondary"
                    }
                    className={cn(
                      "bg-white/20 backdrop-blur-md text-white border-white/20",
                      selectedProduct.status === "active"
                        ? "bg-emerald-500/80"
                        : "bg-zinc-500/80",
                    )}
                  >
                    {selectedProduct.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Price
                  </p>
                  <p className="text-base font-bold text-primary">
                    {selectedProduct.on_sale && selectedProduct.discount_price ? (
                      <span className="flex items-center gap-2">
                        ₦{Number(selectedProduct.discount_price).toLocaleString()}
                        <span className="text-xs font-medium text-muted-foreground line-through decoration-rose-500/30">
                          ₦{Number(selectedProduct.price).toLocaleString()}
                        </span>
                      </span>
                    ) : (
                      `₦${Number(selectedProduct.price).toLocaleString()}`
                    )}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Stock Availability
                  </p>
                  <p
                    className={cn(
                      "text-base font-bold",
                      selectedProduct.is_out_of_stock
                        ? "text-red-500"
                        : "text-emerald-500",
                    )}
                  >
                    {selectedProduct.is_out_of_stock
                      ? "Out of Stock"
                      : `${selectedProduct.stock} pcs`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* PRIMARY ACTIONS */}
                <Button
                  className="h-11 justify-start gap-3 rounded-sm font-bold bg-primary hover:bg-primary/90 text-xs"
                  onClick={() => {
                    const path = getWebsitePath(
                      `/product/${selectedProduct.slug}`,
                    );
                    if (path?.startsWith("http")) {
                      window.location.href = path;
                    } else if (path) {
                      navigate(path);
                    }
                  }}
                >
                  <Eye variant="Bold" color="white" size={18} />
                  View
                </Button>

                <Button
                  variant="outline"
                  className="h-11 justify-start gap-3 rounded-sm font-bold border-border/60 text-xs"
                  onClick={() => {
                    dispatch(clearProductDraft());
                    navigate(
                      getAppPath(`/products/${selectedProduct.slug}/edit`),
                    );
                  }}
                >
                  <Edit variant="Bold" color="#10b981" size={18} />
                  Edit
                </Button>

                {/* SECONDARY ACTIONS */}
                <Button
                  variant="outline"
                  className={cn(
                    "h-11 justify-start gap-3 rounded-sm font-bold border-border/60 text-xs",
                    selectedProduct.status === "active"
                      ? "text-red-500"
                      : "text-emerald-500",
                  )}
                  disabled={updatingStatus}
                  onClick={async () => {
                    try {
                      await updateStatus({
                        id: selectedProduct.id,
                        status:
                          selectedProduct.status === "active"
                            ? "inactive"
                            : "active",
                      }).unwrap();
                      setSelectedProduct((prev) =>
                        prev
                          ? {
                              ...prev,
                              status:
                                prev.status === "active"
                                  ? "inactive"
                                  : "active",
                            }
                          : null,
                      );
                      toast.success("Status updated successfully");
                    } catch {
                      toast.error("Failed to update status");
                    }
                  }}
                >
                  {selectedProduct.status === "active" ? (
                    <>
                      <Slash variant="Bold" color="currentColor" size={18} />
                      Hide
                    </>
                  ) : (
                    <>
                      <TickCircle
                        variant="Bold"
                        color="currentColor"
                        size={18}
                      />
                      Activate
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className={cn(
                    "h-11 justify-start gap-3 rounded-sm font-bold border-border/60 text-xs",
                    selectedProduct.on_sale ? "text-amber-600" : "text-blue-500",
                  )}
                  disabled={
                    updatingOnSale ||
                    (!selectedProduct.discount_price && !selectedProduct.on_sale)
                  }
                  onClick={async () => {
                    try {
                      await updateOnSale({
                        id: selectedProduct.id,
                        on_sale: !selectedProduct.on_sale,
                      }).unwrap();
                      setSelectedProduct((prev) =>
                        prev ? { ...prev, on_sale: !prev.on_sale } : null,
                      );
                      toast.success(
                        selectedProduct.on_sale
                          ? "Removed from sale"
                          : "Marked as on sale",
                      );
                    } catch {
                      toast.error("Failed to update sale status");
                    }
                  }}
                >
                  <Tag2 variant="Bold" color="currentColor" size={18} />
                  {selectedProduct.on_sale ? "Remove Sale" : "Mark Sale"}
                </Button>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <ProductShareAction
                    product={selectedProduct}
                    store={storeData}
                    className="w-full h-11 justify-start gap-4 rounded-sm font-bold border-border/60"
                  />
                </div>
                <Button
                  variant="ghost"
                  className="h-11 w-11 rounded-sm text-destructive hover:bg-destructive/10 shrink-0"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash variant="Bold" color="currentColor" size={18} />
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full h-10 rounded-sm font-bold text-muted-foreground hover:bg-muted/50 text-[10px] uppercase tracking-[0.2em]"
                onClick={() => setSelectedProduct(null)}
              >
                Close Overview
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ❗ CONFIRM DELETE */}
      {selectedProduct && (
        <ConfirmDeleteDialog
          open={isDeleteModalOpen}
          loading={deleting}
          title="Delete product"
          description={`Are you sure you want to delete "${selectedProduct.name}"? This action cannot be undone.`}
          onConfirm={async () => {
            try {
              await deleteProduct(selectedProduct.id).unwrap();
              setIsDeleteModalOpen(false);
              setSelectedProduct(null);
              toast.success("Product deleted successfully");
            } catch {
              toast.error("Failed to delete product");
            }
          }}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </section>
  );
}
