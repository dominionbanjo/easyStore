import { motion } from "framer-motion";
import { getBaseDomain } from "@/utils/subdomain";
import { Home } from "iconsax-react";

export function HomeFloater() {
  const baseDomain = getBaseDomain();
  const homeUrl = `${window.location.protocol}//${baseDomain}`;

  return (
    <div className="fixed bottom-24 lg:bottom-10 right-2 z-[100]">
      <motion.a
        href={homeUrl}
        title="Back to EazyStore Home"
        whileHover={{
          scale: 1.2,
          rotate: 5,
        }}
        whileTap={{ scale: 0.9 }}
        className="flex h-10 w-10 items-center justify-center transition-all duration-300 group opacity-70 hover:opacity-100"
      >
        <Home
          variant="Bold"
          color="var(--color-primary, #10b981)"
          size={28}
          className="relative z-10 transition-transform duration-300 group-hover:scale-110"
        />

        {/* Subtle accent glow instead of background */}
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.a>
    </div>
  );
}
