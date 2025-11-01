import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect } from "@/components/shared/FormSelect";
import { Search, Layers, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockCategories = [
  {
    id: 1,
    name: "Electronics",
    image: "/images/elect1.png",
    description:
      "Explore the latest gadgets, phones, laptops, and smart home devices.",
    productCount: 540,
    subcategories: ["Phones", "Laptops", "Headphones", "Smartwatches"],
  },
  {
    id: 2,
    name: "Fashion",
    image: "/images/fash1.png",
    description:
      "From casual to couture — find clothing, shoes, and accessories for every occasion.",
    productCount: 820,
    subcategories: ["Men", "Women", "Shoes", "Accessories"],
  },
  {
    id: 3,
    name: "Home & Living",
    image: "/images/home1.png",
    description:
      "Elevate your space with furniture, décor, and modern home essentials.",
    productCount: 420,
    subcategories: ["Furniture", "Décor", "Lighting", "Kitchen"],
  },
  {
    id: 4,
    name: "Beauty",
    image: "/images/home5.png",
    description:
      "Discover premium skincare, cosmetics, and personal care products.",
    productCount: 275,
    subcategories: ["Makeup", "Skincare", "Fragrance", "Haircare"],
  },
  {
    id: 5,
    name: "Sports & Outdoors",
    image: "/images/fash2.png",
    description:
      "Gear up for adventure with fitness equipment, outdoor wear, and accessories.",
    productCount: 300,
    subcategories: ["Gym", "Cycling", "Camping", "Running"],
  },
];

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Most Popular", value: "popular" },
  { label: "Highest Products", value: "products" },
  { label: "A-Z", value: "alphabetical" },
];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [filtered, setFiltered] = useState(mockCategories);
  const methods = useForm({
    defaultValues: { search: "", sort: "default" },
  });

  const { watch } = methods;
  const search = watch("search");
  const sort = watch("sort");

  useEffect(() => {
    let result = mockCategories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "products") {
      result = [...result].sort((a, b) => b.productCount - a.productCount);
    } else if (sort === "alphabetical") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    setFiltered(result);
  }, [search, sort]);

  return (
    <section className="min-h-screen bg-muted/30">
      {/* ─── Hero Section ─── */}
      <div className="bg-gradient-to-r from-muted/40 via-background to-muted/40 py-14 text-center border-b border-border">
        <div className="max-w-4xl mx-auto px-4 space-y-5">
          <h1 className="text-3xl font-bold text-foreground">
            Shop by Categories
          </h1>
          <p className="text-muted-foreground">
            Browse through all available categories and find products that match
            your interests.
          </p>

          <FormProvider {...methods}>
            <form className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
              <div className="w-full sm:w-80">
                <FormInput
                  name="search"
                  placeholder="Search categories..."
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

      {/* ─── Categories Grid ─── */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {filtered.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden rounded-2xl bg-background border hover:shadow-sm transition-all">
                  <div className="relative w-full h-40">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded-md text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Layers className="h-3 w-3 text-primary" />
                      {cat.productCount} products
                    </div>
                  </div>

                  <CardHeader className="px-5 pt-4">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {cat.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-5 pb-5 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {cat.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {cat.subcategories.slice(0, 3).map((sub, j) => (
                        <Badge
                          key={j}
                          variant="outline"
                          className="text-xs border-border bg-muted/40"
                        >
                          {sub}
                        </Badge>
                      ))}
                      {cat.subcategories.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-border text-muted-foreground"
                        >
                          +{cat.subcategories.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => navigate("/categories/1")}
                      className="mt-3 w-full rounded-full text-white"
                    >
                      Explore <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No categories found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
