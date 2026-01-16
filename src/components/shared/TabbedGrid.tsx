import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

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

export function TabbedGrid<T>({
  tabGroups,
  renderItem,
  defaultValue,
  className,
  gridClassName,
}: TabbedGridProps<T>) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /* enable horizontal scroll with mouse wheel */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section className={cn("w-full", className)}>
      <Tabs
        defaultValue={defaultValue || tabGroups[0]?.value}
        className="w-full"
      >
        {/* ───────── CATEGORY HEADER ───────── */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b">
          <div ref={scrollRef} className="overflow-x-auto no-scrollbar">
            <TabsList
              className={cn(
                // layout
                "grid grid-flow-col grid-rows-2",
                // spacing (THIS fixes your issue)
                "gap-x-4 gap-y-4",
                // padding & height
                "px-6 py-6 min-h-[104px]",
                // width behavior
                "w-max bg-transparent"
              )}
            >
              {tabGroups.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    // keep pill styling
                    "px-5 py-3 rounded-full text-sm font-medium",
                    // text behavior (important)
                    "leading-tight text-center whitespace-nowrap",
                    // colors
                    "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    "transition-all duration-200",
                    "data-[state=active]:bg-primary/90 data-[state=active]:text-white"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* ───────── TAB CONTENT ───────── */}
        {tabGroups.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mt-10 focus-visible:outline-none"
          >
            <motion.div
              layout
              className={cn(
                "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 px-4 mx-auto",
                gridClassName
              )}
            >
              {tab.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {renderItem(item, i)}
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
