import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect } from "@/components/shared/FormSelect";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Search } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";

//
// ─── Mock Products By Category ─────────────────────────────────────────────
//
const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: "₦1,200,000",
    image: "/images/elect1.png",
    category: "Electronics",
    description:
      "The latest Apple flagship with A17 Bionic and titanium frame.",
    stock: 6,
  },
  {
    id: 2,
    name: "Samsung Smart TV 65”",
    price: "₦780,000",
    image: "/images/elect2.png",
    category: "Electronics",
    description: "Crystal UHD 4K display with dynamic contrast enhancer.",
    stock: 4,
  },
  {
    id: 3,
    name: "Casual Men’s Sneakers",
    price: "₦32,000",
    image: "/images/fash1.png",
    category: "Fashion",
    description: "Lightweight sneakers designed for comfort and daily style.",
    stock: 10,
  },
  {
    id: 4,
    name: "Luxury Handbag",
    price: "₦180,000",
    image: "/images/fash2.png",
    category: "Fashion",
    description: "Elegant premium leather handbag for modern women.",
    stock: 7,
  },
  {
    id: 5,
    name: "Sofa Couch (3 Seater)",
    price: "₦250,000",
    image: "/images/home1.png",
    category: "Home & Living",
    description: "Comfortable modern sofa with breathable linen fabric.",
    stock: 2,
  },
  {
    id: 6,
    name: "Vitamin C Serum",
    price: "₦9,500",
    image: "/images/beauty1.png",
    category: "Beauty",
    description: "Brightening formula for smooth, radiant, youthful skin.",
    stock: 12,
  },
  {
    id: 7,
    name: "Trail Running Shoes",
    price: "₦48,000",
    image: "/images/sport1.png",
    category: "Sports & Outdoors",
    description: "Light, durable shoes designed for speed and endurance.",
    stock: 5,
  },
];

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "low" },
  { label: "Price: High to Low", value: "high" },
  { label: "Alphabetical", value: "az" },
];

//
// ─── Category Details Page ─────────────────────────────────────────────────
//
export default function CategoryDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const decodedCategory = decodeURIComponent(slug || "");

  const methods = useForm({
    defaultValues: { search: "", sort: "default" },
  });
  const { watch } = methods;
  const search = watch("search");
  const sort = watch("sort");

  const [filtered, setFiltered] = useState(
    mockProducts.filter((p) => p.category === decodedCategory)
  );

  // ✅ Filter + Sort Logic
  useEffect(() => {
    let result = mockProducts.filter((p) =>
      p.category.toLowerCase().includes(decodedCategory.toLowerCase())
    );

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "low") {
      result = [...result].sort(
        (a, b) =>
          parseInt(a.price.replace(/\D/g, "")) -
          parseInt(b.price.replace(/\D/g, ""))
      );
    } else if (sort === "high") {
      result = [...result].sort(
        (a, b) =>
          parseInt(b.price.replace(/\D/g, "")) -
          parseInt(a.price.replace(/\D/g, ""))
      );
    } else if (sort === "az") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    setFiltered(result);
  }, [decodedCategory, search, sort]);

  return (
    <section className="min-h-screen bg-muted/30">
      {/* ─── Header Section ─── */}
      <div className="bg-gradient-to-r from-muted/40 via-background to-muted/40 py-14 text-center border-b border-border">
        <div className="max-w-4xl mx-auto px-4 space-y-5">
          <h1 className="text-3xl font-bold text-foreground capitalize">
            {decodedCategory}
          </h1>
          <p className="text-muted-foreground">
            Discover the best items in {decodedCategory}. Filter, sort, and shop
            effortlessly.
          </p>

          <FormProvider {...methods}>
            <form className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
              <div className="w-full sm:w-80">
                <FormInput
                  name="search"
                  placeholder="Search products..."
                  className="!space-y-0"
                />
              </div>
              <div className="w-full sm:w-56">
                <FormSelect
                  name="sort"
                  placeholder="Sort by"
                  options={sortOptions}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      {/* ─── Category Summary ─── */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Card className="border border-border bg-background rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-border">
              <img
                src={`/images/${
                  decodedCategory.toLowerCase().split(" ")[0]
                }1.png`}
                alt={decodedCategory}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-semibold text-foreground">
                  {decodedCategory}
                </CardTitle>
              </CardHeader>
              <p className="text-sm text-muted-foreground">
                {filtered.length} products available
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="text-xs border-border bg-muted/40 text-foreground"
          >
            <Layers className="h-3 w-3 mr-1 text-primary" />
            Shop smart — find your favorites
          </Badge>
        </Card>
      </div>

      {/* ─── Product Grid ─── */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                  rating={4.5}
                  stock={product.stock}
                  options={{
                    image: { showFavorite: true },
                    info: { showVendor: false },
                    actions: { showStock: true },
                  }}
                >
                  <ProductCard.Image />
                  <ProductCard.Info />
                  <ProductCard.Actions />
                </ProductCard>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
