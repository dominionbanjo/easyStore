"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface StoreProductCardProps {
  id: number;
  name: string;
  image: string;
  price: string;
  category: string;
  rating: number;
}

export default function StoreProductCard({
  id,
  name,
  image,
  price,
  category,
  rating,
}: StoreProductCardProps) {
  const navigate = useNavigate();

  const handleEdit = () => navigate(`/dashboard/store/edit/${id}`);
  const handleDelete = () => {
    // Delete action logic (e.g. API call)
    console.log("Deleting product", id);
  };

  return (
    <Card className="overflow-hidden rounded-2xl hover:shadow-md transition-all bg-white">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-56 object-cover" />
      </div>

      <CardHeader className="flex flex-col items-start gap-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <Badge variant="outline">{category}</Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-base font-medium">
          <span>{price}</span>
          <span className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-yellow-500" />
            <span className="ml-1 text-sm text-muted-foreground">{rating}</span>
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-2">
          <Button
            onClick={handleEdit}
            className="flex-1 rounded-full bg-primary text-white hover:bg-primary/90"
          >
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            className="flex-1 rounded-full border-destructive text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
