import { Star, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { IProductReview } from "@/types/product/productTypes";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface ReviewCardProps {
  review: IProductReview;
  index?: number;
}

export function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  const initials =
    `${review.user.first_name?.[0] || ""}${review.user.last_name?.[0] || ""}`.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="p-6 md:p-8 rounded-3xl border-border/40 bg-gradient-to-br from-background to-muted/20 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* User Info & Avatar */}
          <div className="flex sm:flex-col items-center sm:items-center gap-4 shrink-0 sm:w-32">
            <Avatar className="w-16 h-16 border-2 border-primary/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
              <AvatarImage
                src={review.user.avatar || ""}
                alt={review.user.first_name}
              />
              <AvatarFallback className="bg-primary/5 text-primary font-bold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col sm:items-center text-left sm:text-center">
              <h4 className="font-bold text-foreground line-clamp-1">
                {review.user.first_name} {review.user.last_name}
              </h4>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 px-2 py-0.5 rounded-full mt-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5 transition-transform group-hover:scale-110",
                      i < review.rating
                        ? "fill-yellow-400 stroke-yellow-400"
                        : "fill-muted stroke-muted-foreground/20",
                    )}
                  />
                ))}
              </div>
              <time className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                {format(new Date(review.created_at), "MMM d, yyyy")}
              </time>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-0 group-hover:h-full bg-primary/20 transition-all duration-500 rounded-full hidden sm:block" />
              <p className="text-lg text-foreground/80 leading-relaxed italic">
                "{review.comment}"
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
