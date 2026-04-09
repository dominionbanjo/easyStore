import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Star, MessageSquarePlus, Filter } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReviewCard } from "./ReviewCard";
import { AddReviewForm } from "./AddReviewForm";
import type { IProductReview } from "@/types/product/productTypes";

interface ReviewsSectionProps {
  productId: string;
  reviews: IProductReview[];
  ratingAverage: number;
  reviewCount: number;
}

export default function ReviewsSection({
  productId,
  reviews,
  ratingAverage,
  reviewCount,
}: ReviewsSectionProps) {
  const { isAuthenticated, currentUser } = useSelector(
    (state: RootState) => state.user,
  );

  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && (!isAuthenticated || !currentUser)) {
      toast.error("Please login to share your experience", {
        description: "Redirecting to login page...",
      });
      const redirectUrl = encodeURIComponent(
        location.pathname + location.search,
      );
      setTimeout(
        () => (window.location.href = `/auth/login?redirect=${redirectUrl}`),
        1500,
      );
      return;
    }
    setOpen(newOpen);
  };

  return (
    <section className="py-6 border-t border-border/40">
      <div className="w-full mx-auto space-y-10">
        {/* ─── Header & Stats ─── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(ratingAverage)
                          ? "fill-yellow-400 stroke-yellow-400"
                          : "fill-muted stroke-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-xl">
                  {ratingAverage.toFixed(1)}
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span className="text-muted-foreground font-medium">
                {reviewCount} Verified Reviews
              </span>
            </div>
          </div>

          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="rounded-sm bg-primary text-white hover:bg-primary/90   transition-all font-bold px-8 h-14"
              >
                <MessageSquarePlus className="w-5 h-5 mr-3" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-0 border-none bg-transparent">
              <DialogHeader className="hidden">
                <DialogTitle>Write a Review</DialogTitle>
              </DialogHeader>
              <AddReviewForm
                productId={productId}
                userName={currentUser?.first_name || "Customer"}
                onClose={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* ─── Rating Highlights (Compact) ─── */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 rounded-sm bg-muted/30 border-none flex items-center gap-4">
              <div className="p-2.5 rounded-sm bg-background  text-primary">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="font-bold">
                  {ratingAverage.toFixed(1)} Rating
                </div>
                <p className="text-xs text-muted-foreground text-nowrap">
                  Global Customer Satisfaction
                </p>
              </div>
            </Card>

            <Card className="p-4 rounded-sm bg-muted/30 border-none flex items-center gap-4">
              <div className="p-2.5 rounded-sm bg-background  text-teal-600">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold">100% Genuine</div>
                <p className="text-xs text-muted-foreground text-nowrap">
                  Verified Product Purchase
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* ─── Reviews List ─── */}
        <div className="space-y-8">
          {reviews.length === 0 ? (
            <div className="text-center py-20 px-6 rounded-sm border-2 border-dashed border-muted flex flex-col items-center">
              <div className="w-20 h-20 rounded-sm bg-muted flex items-center justify-center mb-6">
                <MessageSquarePlus className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Be the first to review!
              </h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Share your thoughts with the community and help others make a
                better choice.
              </p>
              <Button
                variant="link"
                className="mt-4 text-primary font-bold text-lg"
                onClick={() => setOpen(true)}
              >
                Start your review now
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review, idx) => (
                <ReviewCard
                  key={review.id || `review-${idx}`}
                  review={review}
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
