import { getBaseDomain } from "@/utils/subdomain";
import { Home } from "iconsax-react";

export function HomeFloater() {
  const baseDomain = getBaseDomain();
  const homeUrl = `${window.location.protocol}//${baseDomain}`;

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-6 z-[100]">
      <a
        href={homeUrl}
        title="Back to EazyStore Home"
        className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-sm bg-white dark:bg-neutral-900 border-2 border-primary/20 hover:border-primary hover:scale-110 active:scale-95 transition-all duration-300 group overflow-hidden shadow-xl"
      >
        {/* Premium Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <Home
          variant="Bold"
          color="var(--color-primary, #10b981)"
          size={24}
          className="relative z-10 transition-transform duration-300 group-hover:scale-110 sm:hidden"
        />
        <Home
          variant="Bold"
          color="var(--color-primary, #10b981)"
          size={28}
          className="relative z-10 transition-transform duration-300 group-hover:scale-110 hidden sm:block"
        />

        {/* Subtle accent dot */}
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
      </a>
    </div>
  );
}
