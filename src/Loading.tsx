import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      {/* 🌀 Animated Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [1, 1.2, 1], opacity: 1 }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center justify-center"
      >
        <ShoppingBag className="w-10 h-10 text-primary" />
      </motion.div>

      {/* 💫 Brand Text or Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mt-4 text-sm font-medium text-gray-600"
      >
        Loading your store...
      </motion.p>
    </div>
  );
}
