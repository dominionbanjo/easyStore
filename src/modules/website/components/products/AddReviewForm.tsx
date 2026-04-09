import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAddProductReviewMutation } from "@/services/productReviewApi";
import { logErrorDetails } from "@/utils/errorHandler";

const ReviewSchema = z.object({
  comment: z
    .string()
    .min(5, "Please write a short review (at least 5 characters)"),
});

type ReviewFormValues = z.infer<typeof ReviewSchema>;

interface AddReviewFormProps {
  productId: string;
  onClose: () => void;
  userName: string;
}

export function AddReviewForm({
  productId,
  onClose,
  userName,
}: AddReviewFormProps) {
  const [addReview, { isLoading }] = useAddProductReviewMutation();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const methods = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (!rating) {
      toast.error("Please select a star rating");
      return;
    }

    try {
      await addReview({
        productId,
        rating,
        comment: data.comment,
      }).unwrap();

      toast.success("Thank you! Your review has been posted.");
      methods.reset();
      setRating(0);
      onClose();
    } catch (err: any) {
      logErrorDetails(err, "Review Submission");
      toast.error(err.message || "Failed to submit review");
    }
  };

  return (
    <Card className="p-6 md:p-8 rounded-sm border-none bg-background  relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              Share Your Thoughts
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Posting as{" "}
              <span className="text-primary font-medium">{userName}</span>
            </p>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {/* Star Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                Your Rating
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="group outline-none transition-transform active:scale-90"
                  >
                    <Star
                      className={`h-8 w-8 transition-all duration-200 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 stroke-yellow-400 scale-110"
                          : "stroke-muted-foreground/30 hover:stroke-yellow-400/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                Your Review
              </label>
              <div className="relative">
                <Textarea
                  {...methods.register("comment")}
                  placeholder="What did you like or dislike?"
                  className="min-h-[120px] rounded-sm border-muted-foreground/20 bg-muted/30 focus:bg-background transition-all text-base p-4 resize-none"
                />
                {methods.formState.errors.comment && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-destructive font-medium mt-1.5 ml-1"
                  >
                    {methods.formState.errors.comment.message}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary text-white hover:bg-primary/90 h-12 rounded-sm text-base font-bold   group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-sm animate-spin" />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Submit Review
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Card>
  );
}
