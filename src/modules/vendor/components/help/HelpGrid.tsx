import { Card } from "@/components/ui/card";
import {
  ShoppingBag,
  CreditCard,
  Settings,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Product Management",
    desc: "Adding items, inventory, and categories.",
    icon: ShoppingBag,
    color: "emerald",
  },
  {
    title: "Payouts & Finance",
    desc: "Settlements, bank account setup, and taxes.",
    icon: CreditCard,
    color: "blue",
  },
  {
    title: "Store Settings",
    desc: "Branding, customization, and profiles.",
    icon: Settings,
    color: "purple",
  },
  {
    title: "Customer Success",
    desc: "Handling orders, returns, and communications.",
    icon: Users,
    color: "orange",
  },
  {
    title: "Security & Safety",
    desc: "Account protection and verification.",
    icon: ShieldCheck,
    color: "red",
  },
  {
    title: "Selling Pro Tips",
    desc: "Marketing tools and growth strategies.",
    icon: Zap,
    color: "yellow",
  },
];

export function HelpGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((cat, idx) => (
        <motion.div
          key={cat.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className="group relative border-none  bg-card hover:ring-2 hover:ring-emerald-500/20 transition-all duration-300 cursor-pointer overflow-hidden p-6">
            <div
              className={`w-12 h-12 rounded-sm bg-${cat.color}-500/10 border border-${cat.color}-500/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500`}
            >
              <cat.icon className={`w-6 h-6 text-${cat.color}-500`} />
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-lg tracking-tight group-hover:text-emerald-500 transition-colors">
                {cat.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                {cat.desc}
              </p>
            </div>

            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
              <ArrowRight className="w-5 h-5 text-emerald-500" />
            </div>

            {/* Subtle background decoration */}
            <div
              className={`absolute -bottom-8 -right-8 w-24 h-24 bg-${cat.color}-500/5 rounded-sm blur-2xl group-hover:scale-150 transition-transform duration-700`}
            />
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
