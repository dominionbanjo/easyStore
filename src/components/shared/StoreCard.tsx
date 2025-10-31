"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Store, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StoreCardProps {
  name: string;
  category: string;
  logo: string;
  rating: number;
  products: number;
  location: string;
  description: string;
}

export default function StoreCard({
  name,
  category,
  logo,
  rating,
  products,
  location,
  description,
}: StoreCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="h-full"
    >
      <Card className="overflow-hidden rounded-2xl bg-background border border-border shadow-sm hover:shadow-md transition-all duration-300 h-full">
        {/* ─── Header ─── */}
        <CardHeader className="pb-3 pt-4 px-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-border overflow-hidden">
              <img
                src={logo}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <CardTitle className="text-base font-semibold text-foreground truncate">
                {name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {category}
              </CardDescription>
            </div>
          </div>

          {/* ─── Location ─── */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>{location}</span>
          </div>
        </CardHeader>

        {/* ─── Content ─── */}
        <CardContent className="px-4 space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          <div className="flex items-center justify-between">
            {/* Rating */}
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              <span className="text-sm font-medium text-foreground">
                {rating.toFixed(1)}
              </span>
            </div>

            {/* Products */}
            <Badge
              variant="outline"
              className="text-xs border-border bg-muted/40 text-foreground"
            >
              {products} Products
            </Badge>
          </div>
        </CardContent>

        {/* ─── Footer ─── */}
        <CardFooter className="px-4 pb-4">
          <Button
            size="sm"
            onClick={() => navigate("/shop/1")}
            className="rounded-full w-full text-white"
          >
            <Store className="h-4 w-4 mr-1" />
            Visit Store
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
