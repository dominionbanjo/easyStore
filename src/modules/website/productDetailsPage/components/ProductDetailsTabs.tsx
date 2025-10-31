"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ProductDetailsTabs({ product }: any) {
  return (
    <Tabs defaultValue="description" className="w-full space-y-8">
      {/* ─── Tabs Header ─── */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex justify-start min-w-max">
          <TabsList
            className={cn(
              "flex gap-3 p-2 h-12 bg-muted/30 border border-border rounded-full shadow-sm mx-auto md:mx-0"
            )}
          >
            {[
              { value: "description", label: "Description" },
              { value: "specs", label: "Specifications" },
              { value: "shipping", label: "Shipping & Returns" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium transition-all duration-200",
                  "text-muted-foreground hover:text-foreground",
                  "data-[state=active]:bg-primary data-[state=active]:text-white shadow-sm whitespace-nowrap"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          s
        </div>
      </div>

      {/* ─── Tabs Content ─── */}
      <Card className="p-6 rounded-2xl border border-border/40 shadow-sm bg-background">
        <AnimatePresence mode="sync">
          <TabsContent value="description" asChild>
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-700 leading-relaxed">
                {product.description} This product combines modern design and
                durable build quality to offer unmatched performance and
                comfort.
              </p>
            </motion.div>
          </TabsContent>

          <TabsContent value="specs" asChild>
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="space-y-1 text-gray-600 list-disc pl-6">
                <li>Material: Premium ABS plastic</li>
                <li>Bluetooth range: 15m</li>
                <li>Battery: 1200 mAh rechargeable</li>
                <li>Warranty: 1 year</li>
              </ul>
            </motion.div>
          </TabsContent>

          <TabsContent value="shipping" asChild>
            <motion.div
              key="shipping"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-600 leading-relaxed">
                Ships within 2–4 business days. Returns accepted within 7 days
                of delivery if the item is unused and in original packaging.
              </p>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Card>
    </Tabs>
  );
}
