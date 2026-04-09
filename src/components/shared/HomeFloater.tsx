import { motion } from "framer-motion";
import { getBaseDomain } from "@/utils/subdomain";
import { LogoIcon } from "./Logo";

export function HomeFloater() {
  const baseDomain = getBaseDomain();
  const homeUrl = `${window.location.protocol}//${baseDomain}`;

  return (
    <div className="fixed bottom-6 right-6 z-[100] hidden lg:block">
      <motion.a
        href={homeUrl}
        title="Back to EazyStore Home"
        whileHover={{ 
          scale: 1.15, 
          rotate: 5,
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
        }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-sm bg-white dark:bg-neutral-900 border-2 border-primary/20 hover:border-primary transition-all duration-300 group overflow-hidden"
      >
        {/* Premium Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <LogoIcon size="md" />
        
        {/* Subtle accent dot */}
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
      </motion.a>
    </div>
  );
}
