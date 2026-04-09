import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: number | string;
  name: string;
  price: string;
  image: string;
  category: string;
  rating?: number;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  rating = 4.5,
}: ProductCardProps) {
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const next = !liked;
    setLiked(next);
    toast.info(next ? "Added to favorites" : "Removed from favorites");
  };

  return (
    <Link to={`/product/${id}`}>
      <Card className="overflow-hidden hover: transition-all cursor-pointer rounded-sm">
        {/* Image Section */}
        <div className="relative">
          <div
            className="h-56 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-sm p-1.5  transition-all"
          >
            <Heart
              className={`h-5 w-5 ${
                liked ? "fill-black text-black" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Product Info */}
        <CardHeader className="flex flex-col items-start gap-2 pt-4">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <Badge variant="outline">{category}</Badge>
        </CardHeader>

        {/* Price & Rating */}
        <CardContent className="flex justify-between items-center pb-5">
          <div className="flex items-center gap-2">
            <p className="font-medium text-lg">{price}</p>
            <div className="flex items-center text-sm text-yellow-500">
              <Star className="h-4 w-4 fill-yellow-500 mr-1" />
              <span>{rating}</span>
            </div>
          </div>

          <Button
            size="sm"
            className="rounded-sm px-4 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
