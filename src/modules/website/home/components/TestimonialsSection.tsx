import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-emerald-100">
      <div className="max-w-6xl mx-auto text-center px-6 space-y-10">
        <h2 className="text-3xl font-semibold">What our customers say</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="bg-card rounded-2xl shadow-sm p-6 space-y-3">
              <div className="flex justify-center gap-1 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                “Absolutely love EasyStore! My orders always arrive on time and the quality is top-notch.”
              </p>
              <span className="text-sm font-semibold text-foreground">
                — Jane Doe
              </span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
