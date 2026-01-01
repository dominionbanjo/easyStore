import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface TabGroup<T> {
  value: string;
  label: string;
  items: T[];
}

interface TabbedGridProps<T> {
  tabGroups: TabGroup<T>[];
  renderItem: (item: T, index: number) => React.ReactNode;
  defaultValue?: string;
  className?: string;
  gridClassName?: string;
}

/**
 * A reusable tabbed grid component that displays categorized content
 * with smooth animations and Radix Tabs.
 *
 * Example usage:
 *
 * <TabbedGrid
 *   tabGroups={[
 *     { value: "fashion", label: "Fashion", items: fashionProducts },
 *     { value: "tech", label: "Electronics", items: techProducts },
 *   ]}
 *   renderItem={(item) => <ProductCard {...item} />}
 * />
 */
export function TabbedGrid<T>({
  tabGroups,
  renderItem,
  defaultValue,
  className,
  gridClassName,
}: TabbedGridProps<T>) {
  return (
    <section className={cn("w-full", className)}>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/20">
        <Tabs
          defaultValue={defaultValue || tabGroups[0].value}
          className="mx-auto"
        >
          {/* ─── Tab Buttons ─── */}
          <TabsList className="flex flex-wrap  justify-center gap-2 sm:gap-6 bg-transparent py-4 px-4 mb-5 sm-mb-0">
            {tabGroups.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "px-5 py-4 text-sm font-medium rounded-full transition-all duration-200",
                  "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  "data-[state=active]:bg-primary/90 data-[state=active]:text-white"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ─── Tab Content ─── */}
          {tabGroups.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="mt-10 focus-visible:outline-none"
            >
              <motion.div
                layout
                className={cn(
                  "grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 mx-auto px-4",
                  gridClassName
                )}
              >
                {tab.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {renderItem(item, i)}
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
