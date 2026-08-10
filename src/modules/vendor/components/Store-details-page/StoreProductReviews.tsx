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
import { AddReviewForm } from "@/modules/website/components/products/AddReviewForm";
// Keep using ReviewCard from website but wrap it or rebuild it if needed. For now we will adapt it via css vars
import { ReviewCard } from "@/modules/website/components/products/ReviewCard";
import type { IProductReview } from "@/types/product/productTypes";

interface StoreProductReviewsProps {
  productId: string;
  reviews: IProductReview[];
  ratingAverage: number;
  reviewCount: number;
}

export function StoreProductReviews({
  productId,
  reviews,
  ratingAverage,
  reviewCount,
}: StoreProductReviewsProps) {
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
    <section className="py-6 border-t border-zinc-200 dark:border-zinc-800">
      <div className="w-full mx-auto space-y-10">
        {/* ─── Header & Stats ─── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        i < Math.round(ratingAverage)
                          ? "fill-[var(--theme-primary)] stroke-[var(--theme-primary)]"
                          : "fill-zinc-200 stroke-zinc-200 dark:fill-zinc-800 dark:stroke-zinc-800"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-base sm:text-xl text-zinc-900 dark:text-zinc-100">
                  {ratingAverage.toFixed(1)}
                </span>
              </div>
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
              <span className="text-zinc-500 font-medium">
                {reviewCount} Verified Reviews
              </span>
            </div>
          </div>

          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="rounded-sm bg-[var(--theme-primary)] text-white hover:opacity-90  transition-all font-bold px-5 sm:px-8 h-11 sm:h-12 md:h-14 border border-black/10 dark:border-white/10"
              >
                <MessageSquarePlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 rounded-sm bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
              <div className="p-2.5 rounded-sm bg-white dark:bg-zinc-950  text-[var(--theme-primary)] border border-black/5 dark:border-white/5">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">
                  {ratingAverage.toFixed(1)} Rating
                </div>
                <p className="text-xs text-zinc-500 text-nowrap">
                  Global Customer Satisfaction
                </p>
              </div>
            </Card>

            <Card className="p-4 rounded-sm bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
              <div className="p-2.5 rounded-sm bg-white dark:bg-zinc-950  text-[var(--theme-primary)] border border-black/5 dark:border-white/5">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">100% Genuine</div>
                <p className="text-xs text-zinc-500 text-nowrap">
                  Verified Product Purchase
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* ─── Reviews List ─── */}
        <div className="space-y-8">
          {reviews.length === 0 ? (
            <div className="text-center py-20 px-6 rounded-sm border border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <MessageSquarePlus className="w-8 h-8 text-[var(--theme-primary)]" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Be the first to review!
              </h3>
              <p className="text-zinc-500 mt-2 max-w-sm text-sm">
                Share your thoughts with the community and help others make a
                better choice.
              </p>
              <button
                className="mt-6 text-[var(--theme-primary)] font-bold text-sm hover:underline"
                onClick={() => setOpen(true)}
              >
                Start your review now
              </button>
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
