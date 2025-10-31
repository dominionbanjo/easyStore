"use client";
import ProductCard from "@/components/shared/ProductCard";
import { mockCategories } from "../../lib/data";

export default function RelatedProductsGrid({
  category,
}: {
  category: string;
}) {
  const related =
    mockCategories[category.toLowerCase() as keyof typeof mockCategories] || [];

  return (
    <section className="pt-16 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">Related Products</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {related.slice(0, 4).map((p) => (
          <ProductCard key={p.id} {...p}>
            <ProductCard.Image />
            <ProductCard.Info />
            <ProductCard.Actions />
          </ProductCard>
        ))}
      </div>
    </section>
  );
}
