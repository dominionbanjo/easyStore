import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import type { IProductReview } from "@/types/product/productTypes";
import { useAddProductReviewMutation } from "@/services/productReviewApi";

/* ───────────────── VALIDATION ───────────────── */

const ReviewSchema = z.object({
  comment: z.string().min(5, "Please write a short review"),
});

type ReviewFormValues = z.infer<typeof ReviewSchema>;

/* ───────────────── PROPS ───────────────── */

interface ReviewsSectionProps {
  productId: string;
  reviews: IProductReview[];
  ratingAverage: number;
  reviewCount: number;
}

/* ───────────────── COMPONENT ───────────────── */

export default function ReviewsSection({
  productId,
  reviews,
  ratingAverage,
  reviewCount,
}: ReviewsSectionProps) {
  const { isAuthenticated, currentUser } = useSelector(
    (state: RootState) => state.user
  );

  const [addReview, { isLoading }] = useAddProductReviewMutation();

  const formRef = useRef<HTMLDivElement | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const methods = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewSchema),
    mode: "onTouched",
  });

  /* ───────────────── ACTIONS ───────────────── */

  const handleWriteReview = () => {
    if (!isAuthenticated || !currentUser) {
      toast.error("You must be logged in to leave a review.");
      setTimeout(() => (window.location.href = "/auth/login"), 800);
      return;
    }

    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  };

  const onSubmit = async (data: ReviewFormValues) => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await addReview({
        productId,
        rating,
        comment: data.comment,
      }).unwrap();

      toast.success("Review submitted successfully!");
      methods.reset();
      setRating(0);
      setHoverRating(0);
      setShowForm(false);
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Failed to submit review";

      toast.error(message);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setRating(0);
    setHoverRating(0);
    methods.reset();
  };

  /* ───────────────── RENDER ───────────────── */

  return (
    <section className="space-y-10">
      {/* ─── Header ─── */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Customer Reviews</h2>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full shadow-sm"
          onClick={handleWriteReview}
        >
          Write a Review
        </Button>
      </div>

      {/* ─── Rating Overview ─── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(ratingAverage)
                  ? "fill-yellow-500"
                  : "fill-muted stroke-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-gray-600">
          {ratingAverage.toFixed(1)} out of 5 ({reviewCount} reviews)
        </p>
      </div>

      {/* ─── Reviews List ─── */}
      <div className="space-y-5">
        {reviews.length === 0 && (
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review this product.
          </p>
        )}

        {reviews.map((review) => (
          <Card
            key={review.id}
            className="p-5 rounded-xl border border-border/50 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900">
                  {review.user.first_name} {review.user.last_name}
                </p>
                <p className="text-gray-500 text-sm mt-0.5">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-1 text-yellow-500">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500" />
                ))}
              </div>
            </div>

            {review.comment && (
              <p className="mt-3 text-gray-700 leading-relaxed">
                {review.comment}
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* ─── Review Form ─── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 mt-8 rounded-2xl border border-border/40 shadow-sm bg-muted/20">
              <h3 className="text-lg font-medium mb-4">
                Review as {currentUser?.first_name}
              </h3>

              {/* ⭐ Star Rating Selector */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-500 stroke-yellow-500"
                          : "stroke-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <Textarea
                    {...methods.register("comment")}
                    placeholder="Share your experience..."
                    className="min-h-[120px]"
                  />

                  {methods.formState.errors.comment && (
                    <p className="text-sm text-destructive">
                      {methods.formState.errors.comment.message}
                    </p>
                  )}

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseForm}
                      className="rounded-full px-6"
                    >
                      Close
                    </Button>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
                    >
                      {isLoading ? "Submitting…" : "Submit Review"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
