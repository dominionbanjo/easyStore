import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
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
    <section className={cn("w-full space-y-10", className)}>
      <Tabs
        defaultValue={defaultValue || tabGroups[0]?.value}
        className="w-full"
      >
        {/* ───────── CATEGORY HEADER (CARD) ───────── */}
        <Card className="rounded-sm border border-border/40  bg-background">
          <div
            ref={scrollRef}
            className={cn(
              "overflow-x-auto px-4 py-4 pb-5",
              // scrollbar styling
              "scrollbar-thin",
              "scrollbar-thumb-rounded-sm",
              "scrollbar-track-transparent",
              "scrollbar-thumb-muted-foreground/40 hover:scrollbar-thumb-muted-foreground/60"
            )}
          >
            <TabsList
              className={cn(
                "grid grid-flow-col grid-rows-2",
                "gap-x-4 gap-y-4",
                "min-h-[112px] w-max",
                "bg-transparent p-0"
              )}
            >
              {tabGroups.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "px-6 py-3 rounded-sm text-sm font-medium",
                    "leading-tight text-center whitespace-nowrap",
                    "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    "transition-all duration-200",
                    "data-[state=active]:bg-primary/90 data-[state=active]:text-white",
                    "data-[state=active]:"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Card>

        {/* ───────── TAB CONTENT ───────── */}
        {tabGroups.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="focus-visible:outline-none"
          >
            <div
              className={cn(
                "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 px-2 sm:px-4 mx-auto",
                gridClassName
              )}
            >
              {tab.items.map((item, i) => (
                <div key={i}>
                  {renderItem(item, i)}
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
