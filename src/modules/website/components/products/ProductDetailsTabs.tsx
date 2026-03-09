import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  FileText,
  Layers,
  Truck,
  RotateCcw,
  MapPin,
  Wallet,
  CheckCircle2,
} from "lucide-react";

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
      (v) => typeof v === "string" && v.trim().length > 0,
    );

  const tabs = [
    hasDescription && {
      value: "description",
      label: "Description",
      icon: FileText,
    },
    hasSpecs && {
      value: "specs",
      label: "Specifications",
      icon: Layers,
    },
    hasShipping && {
      value: "shipping",
      label: "Shipping & Returns",
      icon: Truck,
    },
  ].filter(Boolean) as { value: string; label: string; icon: any }[];

  if (tabs.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-2 sm:px-4">
      <Tabs defaultValue={tabs[0].value} className="w-full">
        {/* ─── Tabs Header ─── */}
        <div className="flex justify-center mb-6 md:mb-10 lg:mb-12">
          <TabsList
            className={cn(
              "inline-flex h-12 sm:h-14 w-auto max-w-full items-center justify-start sm:justify-center rounded-xl sm:rounded-2xl bg-muted/50 p-1 text-muted-foreground shadow-inner backdrop-blur-sm border border-border/50 overflow-x-auto no-scrollbar",
            )}
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "relative flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-2.5 px-4 sm:px-8 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap",
                  "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg",
                  "hover:text-foreground/80",
                )}
              >
                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-data-[state=active]:scale-110" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ─── Tabs Content ─── */}
        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            {/* DESCRIPTION */}
            {hasDescription && (
              <TabsContent value="description" asChild className="mt-0">
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <Card className="p-5 sm:p-8 md:p-12 rounded-3xl md:rounded-[2.5rem] border-border/40 bg-gradient-to-br from-background via-background to-primary/5 shadow-2xl shadow-primary/5">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                      {/* Left Accent Column */}
                      <div className="flex flex-row md:flex-col items-center gap-4 shrink-0">
                        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-primary/10 text-primary shadow-inner">
                          <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <div className="md:hidden h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                        <div className="hidden md:block w-px flex-1 bg-gradient-to-b from-primary/30 to-transparent" />
                      </div>

                      {/* Content Column */}
                      <div className="space-y-4 md:space-y-6 flex-1">
                        <div>
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2">
                            Product Description
                          </h3>
                          <div className="h-1 w-12 bg-primary rounded-full" />
                        </div>

                        <div className="relative">
                          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-foreground/80 whitespace-pre-line">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            )}

            {/* SPECS */}
            {hasSpecs && (
              <TabsContent value="specs" asChild className="mt-0">
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <Card className="p-5 sm:p-8 md:p-10 rounded-3xl border-border/40 bg-gradient-to-br from-background via-background to-secondary/5 shadow-xl shadow-primary/5">
                    <div className="flex items-start gap-4 mb-6 md:mb-8">
                      <div className="p-3 rounded-xl bg-secondary/10 text-secondary-foreground">
                        <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                          Technical Specifications
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Detailed features and capabilities.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {Object.entries(product.specs!).map(
                        ([key, value], index) => (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={key}
                            className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary/60" />
                              <span className="font-semibold text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                {key.replace(/_/g, " ")}
                              </span>
                            </div>
                            <span className="font-medium text-xs sm:text-sm text-foreground text-right ml-4">
                              {value}
                            </span>
                          </motion.div>
                        ),
                      )}
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            )}

            {/* SHIPPING */}
            {hasShipping && (
              <TabsContent value="shipping" asChild className="mt-0">
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <Card className="p-5 sm:p-8 md:p-10 rounded-3xl border-border/40 bg-gradient-to-br from-background via-background to-accent/5 shadow-xl shadow-primary/5">
                    <div className="flex items-start gap-4 mb-8 md:mb-10">
                      <div className="p-3 rounded-xl bg-accent/10 text-accent-foreground">
                        <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                          Delivery & Logistics
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          How we get your order to your doorstep.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      {product.shipping?.delivery && (
                        <div className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-background border border-border/50 shadow-sm">
                          <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-1">
                              Estimated Delivery
                            </p>
                            <p className="text-sm sm:text-base text-foreground font-medium">
                              {product.shipping.delivery}
                            </p>
                          </div>
                        </div>
                      )}

                      {product.shipping?.returns && (
                        <div className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-background border border-border/50 shadow-sm">
                          <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary">
                            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-1">
                              Return Policy
                            </p>
                            <p className="text-sm sm:text-base text-foreground font-medium">
                              {product.shipping.returns}
                            </p>
                          </div>
                        </div>
                      )}

                      {product.shipping?.location && (
                        <div className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-background border border-border/50 shadow-sm">
                          <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-1">
                              Ship From
                            </p>
                            <p className="text-sm sm:text-base text-foreground font-medium">
                              {product.shipping.location}
                            </p>
                          </div>
                        </div>
                      )}

                      {product.shipping?.shippingCost && (
                        <div className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-background border border-border/50 shadow-sm">
                          <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-1">
                              Shipping Cost
                            </p>
                            <p className="text-sm sm:text-base text-foreground font-medium">
                              {product.shipping.shippingCost}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
