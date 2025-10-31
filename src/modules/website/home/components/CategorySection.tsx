"use client";

import { TabbedGrid } from "@/components/shared/TabbedGrid";
import ProductCard from "@/components/shared/ProductCard";
import { mockCategories } from "../../lib/data";

export default function CategoriesSection() {
  const tabGroups = Object.keys(mockCategories).map((key) => ({
    value: key.toLowerCase(),
    label: key.charAt(0).toUpperCase() + key.slice(1),
    items: mockCategories[key as keyof typeof mockCategories],
  }));

  return (
    <TabbedGrid
      tabGroups={tabGroups}
      renderItem={(product) => (
        <ProductCard {...product}>
          <ProductCard.Image />
          <ProductCard.Info />
          <ProductCard.Actions />
        </ProductCard>
      )}
    />
  );
}
