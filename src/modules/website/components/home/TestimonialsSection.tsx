import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Jane Doe",
    text: "Absolutely love EasyStore! My orders always arrive on time and the quality is top-notch.",
  },
  {
    id: 2,
    name: "Michael Lee",
    text: "The experience has been seamless from start to finish. Customer support is amazing!",
  },
  {
    id: 3,
    name: "Amaka Johnson",
    text: "My store has grown so much since using EasyStore — easy setup and great analytics.",
  },
  {
    id: 4,
    name: "David Smith",
    text: "A perfect solution for small business owners who want to scale fast and efficiently.",
  },
  {
    id: 5,
    name: "Maria Okafor",
    text: "I love the clean UI and how simple it is to manage all my products in one place.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-[1700px] mx-auto text-center px-6 space-y-10">
        <h2 className="text-3xl font-semibold">What our customers say</h2>

        {/* Continuous scrolling carousel */}
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{
              x: ["0%", "-100%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25, // adjust speed
                ease: "linear",
              },
            }}
          >
            {/* duplicate list for seamless infinite scroll */}
            {[...testimonials, ...testimonials].map((item) => (
              <Card
                key={`${item.id}-${Math.random()}`}
                className="flex-shrink-0 w-[300px] rounded-2xl border bg-background shadow-sm p-6 space-y-4"
              >
                <div className="flex justify-center gap-1 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  “{item.text}”
                </p>
                <span className="block text-sm font-semibold text-foreground">
                  — {item.name}
                </span>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
