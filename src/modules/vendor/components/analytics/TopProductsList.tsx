import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ShoppingBag, Trophy, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface TopProduct {
  product_id: string;
  name: string;
  slug: string;
  image:
    | {
        url: string;
        public_id: string;
      }
    | string
    | null;
  total_sold: number;
  total_revenue: number;
}

interface TopProductsListProps {
  products: TopProduct[];
}

export function TopProductsList({ products }: TopProductsListProps) {
  return (
    <Card className="border-none  bg-card flex flex-col h-full overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-muted/20">
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <Trophy className="w-5 h-5 text-orange-500" /> Top Selling
        </CardTitle>
        <CardDescription>Most popular items in your store</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto max-h-[440px] custom-scrollbar">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center opacity-40">
            <ShoppingBag className="w-12 h-12 mb-4" />
            <p className="font-bold">No sales data yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border/30 pr-1">
            {products.map((product, idx) => {
              const imageUrl =
                typeof product.image === "object"
                  ? product.image?.url
                  : product.image;

              return (
                <motion.div
                  key={product.product_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group cursor-pointer"
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-sm overflow-hidden border border-border/50 bg-muted">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    {idx < 3 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-sm bg-orange-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-background ">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-muted-foreground font-semibold">
                        <span className="text-foreground">
                          {product.total_sold}
                        </span>{" "}
                        units
                      </p>
                      <div className="w-1 h-1 rounded-sm bg-border" />
                      <p className="text-xs text-emerald-500 font-black">
                        ₦{Number(product.total_revenue).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
