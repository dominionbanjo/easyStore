import { ProductCard } from "@/components/shared/ProductCard";
import { USER_ROUTES } from "@/routes/temp";
import { useNavigate } from "react-router-dom";

const featuredProducts = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    vendor: "SoundMaster",
    price: "₦99,999",
    image:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=60",
    category: "Electronics",
    rating: 4.8,
    stock: 12,
  },
  {
    id: 2,
    name: "Classic Denim Jacket",
    vendor: "Urban Threads",
    price: "₦59,000",
    image:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=60",
    category: "Fashion",
    rating: 4.6,
    stock: 5,
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    vendor: "TechSync",
    price: "₦149,999",
    image:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=60",
    category: "Wearables",
    rating: 4.9,
    stock: 8,
  },
  {
    id: 4,
    name: "Contemporary Living Sofa",
    vendor: "HomeScape",
    price: "₦499,000",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=60",
    category: "Furniture",
    rating: 4.7,
    stock: 2,
  },
];

export default function FeaturedProductsSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-2 bg-card">
      <div className=" mx-auto text-center space-y-10">
        <h2 className="text-3xl font-semibold">Featured Products</h2>

        {/* Responsive Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 mx-auto px-4">
          {featuredProducts.map((product) => (
            <ProductCard.Root key={product.id} {...product}>
              <ProductCard.Image />
              <ProductCard.Info
                onClick={() => navigate(`${USER_ROUTES.PRODUCT_DETAIL}`)}
              />
            </ProductCard.Root>
          ))}
        </div>
      </div>
    </section>
  );
}
