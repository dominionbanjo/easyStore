import { TabbedGrid } from "@/components/shared/TabbedGrid";
import { mockCategories } from "../../lib/data";
import { ProductCard } from "@/components/shared/ProductCard";


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
    <ProductCard.Root
        image={product.image}
        name="Dunk High 'Green Satin'"
        price={`${product.price}`}
        brand={""}
        stock={product.stock}
        rating={product.rating}
        category={product.category}
        vendor={product.vendor}
        id={product.id}
        avatar={product.image}
      >
        <ProductCard.Image />
        <ProductCard.Info />
        <ProductCard.Footer />
        {/* <ProductCard.Actions onClick={() => console.log("Buy clicked")} /> */}
      </ProductCard.Root>

      )}
    />
  );
}
