import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ProductDetailPage() {
  const { id } = useParams(); // e.g. /product/:id
  const [quantity, setQuantity] = useState(1);

  // Mock product data (in real app, fetch from API)
  const product = {
    id,
    name: "Leather Handbag",
    category: "Fashion",
    price: 120,
    rating: 4.5,
    reviewsCount: 24,
    description:
      "This handcrafted leather handbag combines timeless design with modern functionality. Perfect for casual outings or professional wear.",
    images: [
      "/images/products/handbag1.jpg",
      "/images/products/handbag2.jpg",
      "/images/products/handbag3.jpg",
    ],
    reviews: [
      {
        name: "Sarah Johnson",
        rating: 5,
        comment: "Beautiful design and top quality! Highly recommend.",
      },
      {
        name: "David Lee",
        rating: 4,
        comment: "Great value for money. Would buy again.",
      },
    ],
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product.name} to cart`);
  };

  return (
    <>
      <main className="bg-emerald-50 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          {/* Back Link */}
          <div>
            <Link
              to="/shop"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Shop
            </Link>
          </div>

          {/* ──────────────── PRODUCT SECTION ──────────────── */}
          <section className="grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-sm p-6">
            {/* Left: Image Gallery */}
            <div className="flex flex-col gap-4">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-[400px] object-cover rounded-xl"
              />

              <div className="flex gap-3">
                {product.images.slice(1).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Preview ${i}`}
                    className="w-24 h-24 rounded-lg object-cover border cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Badge className="bg-muted text-foreground font-medium">
                  {product.category}
                </Badge>

                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewsCount} reviews)
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                <div className="text-3xl font-semibold text-primary">
                  ${product.price}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-3 mt-6">
                <div className="flex items-center border rounded-full px-4 py-1.5 bg-muted/30">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-xl font-bold px-2"
                  >
                    -
                  </button>
                  <span className="mx-2 w-6 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-xl font-bold px-2"
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="bg-primary text-primary-foreground flex items-center gap-2 rounded-full px-6 py-2 hover:bg-primary/90"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </section>

          <Separator className="my-10" />

          {/* ──────────────── REVIEWS SECTION ──────────────── */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              Customer Reviews ({product.reviewsCount})
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {product.reviews.map((review, index) => (
                <Card
                  key={index}
                  className="bg-white shadow-sm rounded-xl hover:shadow-md transition-all"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{review.name}</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
