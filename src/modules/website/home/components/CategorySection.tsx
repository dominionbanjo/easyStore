"use client";

import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CategoryCard from "./CategoryCardItem";
import { mockCategories } from "../../lib/data";
import { cn } from "@/lib/utils";

// const tabGroups = [
//   {
//     value: "fashion",
//     label: "Fashion",
//     categories: mockCategories.fashion,
//   },
//   {
//     value: "electronics",
//     label: "Electronics",
//     categories: mockCategories.electronics,
//   },
//   {
//     value: "home-living",
//     label: "Home & Living",
//     categories: mockCategories.home,

//   },
// ];

const tabGroups = Object.keys(mockCategories).map((key) => ({
  value: key.toLowerCase(),
  label: key.charAt(0).toUpperCase() + key.slice(1),
  categories: mockCategories[key as keyof typeof mockCategories],
}));
console.log(tabGroups);
export default function CategoriesSection() {
  return (
    <section className="w-full ">
      {/* ─── Top Sticky Tab Navigation ─── */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/20">
        <Tabs defaultValue={tabGroups[0].value} className="mx-auto">
          <TabsList className="flex flex-wrap justify-center gap-2 sm:gap-6 bg-transparent py-4 px-4">
            {tabGroups.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "px-5 py-4 text-sm font-medium rounded-full transition-all duration-200",
                  "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  "data-[state=active]:bg-muted data-[state=active]:text-foreground "
                )}
              >
                {tab.label}
              </TabsTrigger>

            ))}
          </TabsList>

          {tabGroups.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="mt-10 focus-visible:outline-none"
            >
              <motion.div
                layout
                className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  mx-auto px-4"
              >
                {tab.categories.map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <CategoryCard
                      name={cat.name}
                      thumbnail={cat.thumbnail}
                      purchases={cat.purchases}
                      seller={cat.seller}
                    />
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
