import { motion } from "framer-motion";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  comment: string;
  gradient?: string;
}

/* ─────────────────────────────────────────────
   Testimonial Card
───────────────────────────────────────────── */
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      className={`
        w-[300px]
        h-[380px]
        flex-shrink-0
        rounded-2xl
        p-6
        text-white
        flex flex-col justify-between
        shadow-lg
        ${
          testimonial.gradient ??
          "bg-gradient-to-br from-indigo-600 to-blue-600"
        }
      `}
    >
      {/* Top */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{testimonial.name}</h3>
        <p className="text-sm opacity-80">
          {testimonial.role}
          {testimonial.company && `, ${testimonial.company}`}
        </p>
      </div>

      {/* Bottom */}
      <p className="text-sm leading-relaxed opacity-95">
        “{testimonial.comment}”
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Auto-Moving Carousel
───────────────────────────────────────────── */
export default function TestimonialsCarousel() {
  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Adewale Akinwale",
      role: "Founder",
      company: "Urban Threads",
      comment:
        "Since launching our store on EasyStore, sales have doubled and managing inventory is now stress-free. The platform made it easy to scale without technical headaches.",
      gradient: "bg-gradient-to-br from-emerald-600 to-emerald-500",
    },
    {
      id: "2",
      name: "Amara Okoye",
      role: "Store Owner",
      company: "Luxe Essentials",
      comment:
        "EasyStore helped us reach more customers online and streamline order processing. What used to take hours now takes minutes.",
      gradient: "bg-gradient-to-br from-blue-600 to-indigo-600",
    },
    {
      id: "3",
      name: "Ibrahim Musa",
      role: "Founder",
      company: "FreshMart",
      comment:
        "Moving our business online with EasyStore transformed how we sell. We now track sales, manage deliveries, and grow faster with confidence.",
      gradient: "bg-gradient-to-br from-purple-600 to-pink-600",
    },
    {
      id: "4",
      name: "Chioma Nwoye",
      role: "Co-Founder",
      company: "Glow Beauty",
      comment:
        "The platform gave our brand a professional storefront and reliable payments. Customer trust and repeat purchases increased almost immediately.",
      gradient: "bg-gradient-to-br from-orange-600 to-amber-500",
    },
  ];

  /* duplicate list for seamless infinite scroll */
  const items = [...testimonials, ...testimonials];

  return (
    <section className="py-20 overflow-hidden">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-semibold">
          Customers growing with EasyStore
        </h2>
        <p className="text-muted-foreground mt-2">
          Trusted by founders and teams worldwide
        </p>
      </div>

      {/* Carousel Track */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {items.map((item, index) => (
            <TestimonialCard key={`${item.id}-${index}`} testimonial={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
