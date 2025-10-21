import ProductCard from "@/components/shared/ProductCard";

const featuredProducts = [
  { name: "Wireless Headphones", price: "$99.99", image: "/images/headphones.jpg" },
  { name: "Classic Denim Jacket", price: "$59.00", image: "/images/jacket.jpg" },
  { name: "Smart Watch", price: "$149.99", image: "/images/watch.jpg" },
  { name: "Modern Sofa", price: "$499.00", image: "/images/sofa.jpg" },
];

export default function FeaturedProductsSection() {
  return (
    <section className="py-20 px-6 bg-card">
      <div className="max-w-7xl mx-auto text-center space-y-10">
        <h2 className="text-3xl font-semibold">Featured Products</h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={index}
              id={index + 1}
              name={product.name}
              price={product.price}
              image={product.image}
              category="Featured"
              rating={4.5 + (index % 2 ? 0 : -0.2)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
