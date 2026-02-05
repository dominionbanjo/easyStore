import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* ─────────────────────────────────────────────
   Types
 ───────────────────────────────────────────── */
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  comment: string;
  avatar?: string;
  rating: number;
}

/* ─────────────────────────────────────────────
   Testimonial Card
 ───────────────────────────────────────────── */
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="w-[380px] flex-shrink-0 bg-white border border-border/50 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col justify-between group"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < testimonial.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <Quote className="w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
        </div>

        <p className="text-foreground/80 leading-relaxed text-lg italic">
          "{testimonial.comment}"
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
          <AvatarFallback className="bg-primary/5 text-primary font-bold">
            {testimonial.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h4 className="font-bold text-foreground">{testimonial.name}</h4>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {testimonial.role}{" "}
            {testimonial.company && `@ ${testimonial.company}`}
          </p>
        </div>
      </div>
    </motion.div>
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
      role: "CEO",
      company: "Urban Threads",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=1",
      comment:
        "Since launching our store on EasyStore, sales have doubled and managing inventory is now stress-free. The platform made it easy to scale without technical headaches.",
    },
    {
      id: "2",
      name: "Amara Okoye",
      role: "Director",
      company: "Luxe Essentials",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=2",
      comment:
        "EasyStore helped us reach more customers online and streamline order processing. What used to take hours now takes minutes.",
    },
    {
      id: "3",
      name: "Ibrahim Musa",
      role: "Founder",
      company: "FreshMart",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=3",
      comment:
        "Moving our business online with EasyStore transformed how we sell. We now track sales, manage deliveries, and grow faster with confidence.",
    },
    {
      id: "4",
      name: "Chioma Nwoye",
      role: "Founder",
      company: "Glow Beauty",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=4",
      comment:
        "The platform gave our brand a professional storefront and reliable payments. Customer trust and repeat purchases increased almost immediately.",
    },
  ];

  /* Duplicate for infinite scroll */
  const items = [...testimonials, ...testimonials];

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
              Success Stories
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Trusted by 40,000+ <br />
              <span className="text-primary italic">Growing Businesses</span>
            </h3>
            <div className="h-1.5 w-20 bg-primary rounded-full" />
          </div>
          <p className="text-muted-foreground text-lg max-w-sm">
            Discover how entrepreneurs are transforming their reach and
            operations with our digital tools.
          </p>
        </div>
      </div>

      {/* Marquee Track */}
      <div className="relative w-full group">
        {/* Left Fader */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-8 px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {items.map((item, index) => (
            <TestimonialCard key={`${item.id}-${index}`} testimonial={item} />
          ))}
        </motion.div>

        {/* Right Fader */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>

      <div className="mt-16 flex justify-center">
        <div className="px-6 py-3 bg-muted/30 rounded-full border border-border/50 text-sm font-medium text-muted-foreground flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Active community of vendors and shoppers
        </div>
      </div>
    </section>
  );
}
