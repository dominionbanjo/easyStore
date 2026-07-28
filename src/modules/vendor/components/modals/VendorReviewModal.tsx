import { useState, useEffect } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onDismiss: () => Promise<void>;
}

export function VendorReviewModal({ open, onOpenChange, onSubmit, onDismiss }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setRating(0);
      setHovered(0);
      setComment("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(rating, comment);
      toast.success("Thank you for your review!");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
    setSubmitting(false);
  };

  const handleDismiss = async () => {
    await onDismiss();
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} disableOutsideClick title="How would you rate EazyStore?" description="Your feedback helps us improve the platform for everyone.">
      <div className="p-4 space-y-6">
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-colors",
                  (hovered || rating) >= star
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30",
                )}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {rating === 1 ? "Needs improvement" :
             rating === 2 ? "Fair" :
             rating === 3 ? "Good" :
             rating === 4 ? "Very good" :
             "Excellent!"}
          </p>
        )}

        <Textarea
          placeholder="Share your experience (optional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />

        <div className="flex gap-3 justify-end border-t pt-4">
          <Button variant="outline" onClick={handleDismiss} disabled={submitting}>
            Not Now
          </Button>
          <Button onClick={handleSubmit} isLoading={submitting} disabled={rating === 0}>
            Submit Review
          </Button>
        </div>
      </div>
    </Modal>
  );
}
