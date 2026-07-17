import { useState, useMemo } from "react";
import { useGetSalesTerminalProductsQuery, useRecordOfflineSaleMutation } from "@/services/salesApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface CartItem {
  product_id: string;
  variant_id?: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  variant_label?: string;
}

export function SalesTerminalPage() {
  const { data: products, isLoading } = useGetSalesTerminalProductsQuery();
  const [recordSale, { isLoading: isSaving }] = useRecordOfflineSaleMutation();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("all");
    products?.forEach((p) => { if (p.category) cats.add(p.category); });
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const addToCart = (product: NonNullable<typeof products>[number], variantId?: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product_id === product.id && i.variant_id === variantId);
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.id && i.variant_id === variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      const variant = product.variants.find((v: { id: string }) => v.id === variantId);
      return [
        ...prev,
        {
          product_id: product.id,
          variant_id: variantId,
          name: product.name + (variant ? ` (${Object.values(variant.combinations || {}).join(", ")})` : ""),
          price: variant ? variant.price : product.price,
          quantity: 1,
          image: variant?.image_url || product.image,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, variantId: string | undefined, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product_id === productId && i.variant_id === variantId
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (productId: string, variantId: string | undefined) => {
    setCart((prev) => prev.filter((i) => !(i.product_id === productId && i.variant_id === variantId)));
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      toast.error("Add items to the cart first");
      return;
    }
    try {
      await recordSale({
        items: cart.map((i) => ({ product_id: i.product_id, variant_id: i.variant_id, quantity: i.quantity })),
        customer_name: customerName || undefined,
        customer_email: customerEmail || undefined,
      }).unwrap();
      toast.success("Sale completed successfully!");
      setCart([]);
      setCustomerName("");
      setCustomerEmail("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Sale failed");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      {/* Left: Product Grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 p-4 pb-0 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => addToCart(product)}
              >
                <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl">
                      <ShoppingCart className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                <p className="text-primary font-bold mt-1">₦{(product.price / 100).toLocaleString()}</p>
                {product.stock <= 5 && (
                  <p className="text-xs text-amber-600 mt-1">{product.stock} left</p>
                )}
                {product.variants.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {product.variants.slice(0, 3).map((v) => (
                      <button
                        key={v.id}
                        onClick={(e) => { e.stopPropagation(); addToCart(product, v.id); }}
                        className="text-xs bg-muted px-2 py-1 rounded hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {Object.values(v.combinations || {}).join("/")}
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Cart Panel */}
      <div className="w-96 border-l bg-background flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <h2 className="font-semibold">Current Sale</h2>
          <span className="text-sm text-muted-foreground ml-auto">{cart.length} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Click products to add them to the sale</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.product_id}-${item.variant_id}-${idx}`} className="flex gap-3 bg-muted/50 rounded-lg p-3">
                <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                  {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg"><ShoppingCart className="h-5 w-5" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-sm text-primary font-semibold">₦{(item.price / 100).toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQuantity(item.product_id, item.variant_id, -1)} className="h-6 w-6 rounded bg-background flex items-center justify-center hover:bg-muted"><Minus className="h-3 w-3" /></button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.variant_id, 1)} className="h-6 w-6 rounded bg-background flex items-center justify-center hover:bg-muted"><Plus className="h-3 w-3" /></button>
                    <button onClick={() => removeItem(item.product_id, item.variant_id)} className="ml-auto h-6 w-6 rounded bg-background flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t p-4 space-y-3">
          <div className="space-y-2">
            <Input placeholder="Customer name (optional)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <Input placeholder="Customer email (optional)" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">₦{(cartTotal / 100).toLocaleString()}</span>
          </div>
          <Button className="w-full h-12 text-lg" onClick={handleCompleteSale} isLoading={isSaving} disabled={cart.length === 0}>
            Complete Sale
          </Button>
        </div>
      </div>
    </div>
  );
}
