
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CategoryCard from "./CategoryCardItem";


const tabGroups = [
  {
    value: "all",
    label: "All",
    categories: [
      { name: "Fashion", image: "/images/fashion.png" , seller:"Dominion", purchases:15000},
      { name: "Electronics", image: "/images/electronics.png" , seller:"Dominion", purchases:15000},
      { name: "Home & Living", image: "/images/home.png" , seller:"Dominion", purchases:15000},
      { name: "Beauty", image: "/images/beauty.png" , seller:"Dominion", purchases:15000},
      { name: "Sports", image: "/images/sport.png" , seller:"Dominion", purchases:15000},
      { name: "Accessories", image: "/images/accessories.png" , seller:"Dominion", purchases:15000},
    ],
  },
  {
    value: "fashion",
    label: "Fashion",
    categories: [
      { name: "Men's Fashion", image: "/images/fashion.png" , seller:"Dominion", purchases:15000},
      { name: "Women's Fashion", image: "/images/fashion.png" , seller:"Dominion", purchases:15000},
    ],
  },
  {
    value: "electronics",
    label: "Electronics",
    categories: [
      { name: "Phones", image: "/images/electronics.png" , seller:"Dominion", purchases:15000},
      { name: "Laptops", image: "/images/electronics.png" , seller:"Dominion", purchases:15000},
    ],
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ───────────── Header ───────────── */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Browse top collections and discover your favorites — inspired by a
            clean fintech aesthetic.
          </p>
        </div>

        {/* ───────────── Tabs ───────────── */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mx-auto flex flex-wrap justify-center gap-2 border-b border-border/40 bg-transparent p-0">
            {tabGroups.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-full border border-border/40 bg-transparent px-5 py-2 text-sm font-medium text-foreground hover:bg-muted/40 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ───────────── Tab Content ───────────── */}
          {tabGroups.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="mt-10 focus-visible:outline-none"
            >
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {tab.categories.map((cat) => (
                  <CategoryCard
                    key={cat.name}
                    name={cat.name}
                    image={cat.image}
                    purchases={cat.purchases}
                    seller={cat.seller}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
