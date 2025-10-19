import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Star, ArrowRight } from "lucide-react";
import HomepageLayout from "@/components/layout/homepage/HomePageLayout";
import ProductCard from "@/components/shared/ProductCard";

export default function LandingPage() {
  const categories = [
    { name: "Fashion", image: "/images/fashion.jpg" },
    { name: "Electronics", image: "/images/electronics.jpg" },
    { name: "Home & Living", image: "/images/home.jpg" },
    { name: "Beauty", image: "/images/beauty.jpg" },
    { name: "Sports", image: "/images/sports.jpg" },
    { name: "Accessories", image: "/images/accessories.jpg" },
  ];

  const featuredProducts = [
    {
      name: "Wireless Headphones",
      price: "$99.99",
      image: "/images/headphones.jpg",
    },
    {
      name: "Classic Denim Jacket",
      price: "$59.00",
      image: "/images/jacket.jpg",
    },
    {
      name: "Smart Watch",
      price: "$149.99",
      image: "/images/watch.jpg",
    },
    {
      name: "Modern Sofa",
      price: "$499.00",
      image: "/images/sofa.jpg",
    },
  ];

  return (
    <HomepageLayout>
      <main className="min-h-screen flex flex-col bg-emerald-50 text-foreground">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-white to-emerald-50 py-20 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              Discover products you’ll{" "}
              <span className="text-primary">love</span>
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Shop the best deals in fashion, electronics, home decor, and more
              — all curated for your lifestyle.
            </p>
            <Button
              size="lg"
              className="bg-primary text-white rounded-full px-8 hover:bg-primary/90"
            >
              Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-6 bg-background">
          <div className="max-w-7xl mx-auto text-center space-y-10">
            <h2 className="text-3xl font-semibold">Shop by Category</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {categories.map((cat) => (
                <Card
                  key={cat.name}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader className="text-lg font-semibold text-primary pt-4">
                    {cat.name}
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
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
                  rating={4.5 + (index % 2 ? 0 : -0.2)} // small variation for realism
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-emerald-100">
          <div className="max-w-6xl mx-auto text-center px-6 space-y-10">
            <h2 className="text-3xl font-semibold">What our customers say</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <Card
                  key={n}
                  className="bg-card rounded-2xl shadow-sm p-6 space-y-3"
                >
                  <div className="flex justify-center gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    “Absolutely love EasyStore! My orders always arrive on time
                    and the quality is top-notch.”
                  </p>
                  <span className="text-sm font-semibold text-foreground">
                    — Jane Doe
                  </span>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </HomepageLayout>
  );
}
