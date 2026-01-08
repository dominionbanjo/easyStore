import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductDetailsTabsProps {
  product: {
    description?: string;
    specs?: Record<string, string> | null;
    shipping?: {
      delivery?: string;
      returns?: string;
      location?: string;
      shippingCost?: string;
    };
  };
}

export default function ProductDetailsTabs({
  product,
}: ProductDetailsTabsProps) {
  const hasDescription =
    typeof product.description === "string" &&
    product.description.trim().length > 0;

  const hasSpecs = product.specs && Object.keys(product.specs).length > 0;

  const hasShipping =
    product.shipping &&
    Object.values(product.shipping).some(
      (v) => typeof v === "string" && v.trim().length > 0
    );

  const tabs = [
    hasDescription && { value: "description", label: "Description" },
    hasSpecs && { value: "specs", label: "Specifications" },
    hasShipping && { value: "shipping", label: "Shipping & Returns" },
  ].filter(Boolean) as { value: string; label: string }[];

  if (tabs.length === 0) return null;

  return (
    <Tabs defaultValue={tabs[0].value} className="w-full space-y-8">
      {/* ─── Tabs Header ─── */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <TabsList
          className={cn(
            "flex gap-3 p-2 h-12 bg-muted/30 border border-border rounded-full shadow-sm"
          )}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                "text-muted-foreground hover:text-foreground",
                "data-[state=active]:bg-primary data-[state=active]:text-white shadow-sm"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* ─── Tabs Content ─── */}
      <Card className="p-6 rounded-2xl border border-border/40 shadow-sm bg-background">
        <AnimatePresence mode="sync">
          {/* DESCRIPTION */}
          {hasDescription && (
            <TabsContent value="description" asChild>
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </motion.div>
            </TabsContent>
          )}

          {/* SPECS */}
          {hasSpecs && (
            <TabsContent value="specs" asChild>
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <ul className="space-y-2 text-gray-700">
                  {Object.entries(product.specs!).map(([key, value]) => (
                    <li
                      key={key}
                      className="flex justify-between gap-4 border-b border-border/40 pb-2"
                    >
                      <span className="font-medium capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-muted-foreground">{value}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </TabsContent>
          )}

          {/* SHIPPING */}
          {hasShipping && (
            <TabsContent value="shipping" asChild>
              <motion.div
                key="shipping"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-3 text-gray-700"
              >
                {product.shipping?.delivery && (
                  <p>
                    <span className="font-medium">Delivery:</span>{" "}
                    {product.shipping.delivery}
                  </p>
                )}

                {product.shipping?.returns && (
                  <p>
                    <span className="font-medium">Returns:</span>{" "}
                    {product.shipping.returns}
                  </p>
                )}

                {product.shipping?.location && (
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {product.shipping.location}
                  </p>
                )}

                {product.shipping?.shippingCost && (
                  <p>
                    <span className="font-medium">Shipping Cost:</span>{" "}
                    {product.shipping.shippingCost}
                  </p>
                )}
              </motion.div>
            </TabsContent>
          )}
        </AnimatePresence>
      </Card>
    </Tabs>
  );
}
