import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store"; // adjust if path differs
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FormInput } from "@/components/shared/FormInput";

//
// ─── Validation Schema ────────────────────────────────────────────
//
const ReviewSchema = z.object({
  name: z.string().min(2, "Name is required"),
  comment: z.string().min(5, "Please write a short review"),
});

type ReviewFormValues = z.infer<typeof ReviewSchema>;

//
// ─── Component ───────────────────────────────────────────────────
//
export default function ReviewsSection({
  productId,
}: {
  productId: string | number;
}) {
  console.log(productId);
  const { isAuthenticated, currentUser } = useSelector(
    (state: RootState) => state.user
  );

  const formRef = useRef<HTMLDivElement | null>(null);
  const [showForm, setShowForm] = useState(false);

  const methods = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewSchema),
    mode: "onTouched",
  });

  const reviews = [
    {
      id: 1,
      user: "Jane Doe",
      rating: 5,
      comment: "Amazing sound clarity and build quality! Totally worth it.",
      date: "2 days ago",
    },
    {
      id: 2,
      user: "John Smith",
      rating: 4,
      comment: "Battery life is impressive, wish it had more bass.",
      date: "1 week ago",
    },
    {
      id: 3,
      user: "Asuquo Dominion",
      rating: 5,
      comment: "Comfortable fit and crisp sound — perfect for long flights.",
      date: "2 weeks ago",
    },
  ];

  const handleWriteReview = () => {
    if (!isAuthenticated || !currentUser) {
      toast.error("You must be logged in to leave a review.");
      setTimeout(() => (window.location.href = "/login"), 800);
      return;
    }

    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  };

  const onSubmit = (data: ReviewFormValues) => {
    console.log("✅ Review Submitted:", data);
    toast.success("Review submitted successfully!");
    methods.reset();
  };

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
      <div className="flex flex-wrap items-center gap-3 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-yellow-500" />
        ))}
        <p className="ml-2 text-gray-600">4.8 out of 5 (1,238 ratings)</p>
      </div>

      {/* ─── Reviews List ─── */}
      <div className="space-y-5">
        {reviews.map((r) => (
          <Card
            key={r.id}
            className="p-5 rounded-xl border border-border/50 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900">{r.user}</p>
                <p className="text-gray-500 text-sm mt-0.5">{r.date}</p>
              </div>
              <div className="flex gap-1 text-yellow-500">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500" />
                ))}
              </div>
            </div>
            <p className="mt-3 text-gray-700 leading-relaxed">{r.comment}</p>
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
              <h3 className="text-lg font-medium mb-4">Add a Review</h3>

              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormInput
                    name="name"
                    label="Your Name"
                    placeholder="John Doe"
                    className="w-full"
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Your Experience
                    </label>
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
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
                    >
                      Submit Review
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
