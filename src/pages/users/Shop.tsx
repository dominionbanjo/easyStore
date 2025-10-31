"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect } from "@/components/shared/FormSelect";
import { Store } from "lucide-react";
import StoreCard from "@/components/shared/StoreCard";

//
// ─── Mock Stores Data ─────────────────────────────────────────────────────────
//
const mockStores = [
  {
    id: 1,
    name: "Urban Threads",
    category: "Fashion",
    logo: "/images/store-logo1.png",
    rating: 4.7,
    products: 128,
    location: "Lagos, Nigeria",
    description: "Trendy fashion and urban streetwear for all seasons.",
  },
  {
    id: 2,
    name: "TechSync Electronics",
    category: "Electronics",
    logo: "/images/store-logo2.png",
    rating: 4.9,
    products: 320,
    location: "Abuja, Nigeria",
    description: "Your one-stop shop for cutting-edge gadgets and devices.",
  },
  {
    id: 3,
    name: "HomeScape Living",
    category: "Home & Living",
    logo: "/images/store-logo3.png",
    rating: 4.6,
    products: 98,
    location: "Port Harcourt, Nigeria",
    description: "Modern furniture and home décor to elevate your space.",
  },
  {
    id: 4,
    name: "Glow Beauty",
    category: "Beauty",
    logo: "/images/store-logo4.png",
    rating: 4.8,
    products: 76,
    location: "Lagos, Nigeria",
    description: "Premium skincare and beauty essentials you’ll love.",
  },
];

const categories = ["All", "Fashion", "Electronics", "Home & Living", "Beauty"];
const categoryOptions = categories.map((c) => ({ label: c, value: c }));

//
// ─── Component ───────────────────────────────────────────────────────────────
//
export default function StoresPage() {
  const [filter, setFilter] = useState("All");
  console.log(setFilter);

  const methods = useForm({
    defaultValues: {
      search: "",
      category: "All",
    },
  });

  const { watch } = methods;
  const search = watch("search");
  const category = watch("category");
  const currentFilter = category || filter;

  const filteredStores = mockStores.filter((store) => {
    const matchesSearch = store.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      currentFilter === "All" || store.category === currentFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="min-h-screen bg-muted/30">
      {/* ─── Header Section ─── */}
      <div className="bg-gradient-to-r from-muted/40 via-background to-muted/40 py-12 px-4 text-center border-b border-border rounded-t-md">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Explore Stores</h1>
          <p className="text-muted-foreground">
            Discover top-rated stores, find your favorite products, and shop
            confidently.
          </p>

          <FormProvider {...methods}>
            <form className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <div className="w-full sm:w-80">
                <FormInput
                  name="search"
                  label=""
                  placeholder="Search stores..."
                  className="!space-y-0"
                />
              </div>

              <div className="w-full sm:w-56">
                <FormSelect
                  name="category"
                  label=""
                  placeholder="Filter by category"
                  options={categoryOptions}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      {/* ─── Stores Grid ─── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {filteredStores.length > 0 ? (
          <motion.div
            layout
            className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {filteredStores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <StoreCard
                  name={store.name}
                  category={store.category}
                  logo={store.logo}
                  rating={store.rating}
                  products={store.products}
                  location={store.location}
                  description={store.description}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No stores found matching your search or filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}
