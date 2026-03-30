import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SocialProofBadge from "./SocialProofBadge";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  selectCurrentUser,
  setShowOnboardingModal,
} from "@/features/userSlice";
import { AUTH_ROUTES } from "@/routes/index";
import SmartLink from "@/components/shared/SmartLink";

// Hero main fade-in animation
const transitionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 0.8,
    },
  },
};

export function HeroTitle() {
  return (
    <>
      Transform Your Business with a
      <br />
      <span className="relative inline-block mt-2">
        <span className="relative z-10 text-primary">
          Professional{" "}
          <span className="text-emerald-500 dark:text-emerald-400 font-bold underline decoration-dotted underline-offset-8">
            Online Storefront
          </span>
        </span>
      </span>
    </>
  );
}

export default function HeroSection() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  return (
    <section className="relative isolate  py-6 sm:py-12  dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 transition-colors duration-300">
      <div className="w-full mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* LEFT SIDE */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            {/* Catchy TAG */}
            <motion.h1
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-balance leading-[1.1]"
            >
              <HeroTitle />
            </motion.h1>

            <motion.p
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="mt-6 max-w-2xl mx-auto lg:mx-0 text-lg sm:text-xl leading-relaxed text-muted-foreground"
            >
              EasyStore gives you everything you need to sell online. Create
              your professional storefront in minutes, showcase your products to
              millions, and manage your entire business from one simple
              dashboard.
            </motion.p>

            <motion.div
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="mt-10 flex flex-col sm:flex-row items-center lg:items-start gap-6"
            >
              {!user || user.account_type === "vendor" ? (
                <SmartLink
                  to={!user ? `${AUTH_ROUTES.SIGNUP}?role=vendor` : "/vendor"}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    className="group relative bg-primary hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-neutral-950 rounded-xl h-14 px-10 text-lg font-bold hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 w-full"
                  >
                    <div className="absolute inset-0 bg-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    <span className="relative flex items-center gap-2">
                      Start Selling Now
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </SmartLink>
              ) : (
                <Button
                  size="lg"
                  onClick={() =>
                    dispatch(
                      setShowOnboardingModal({
                        show: true,
                        step: "store-form",
                      }),
                    )
                  }
                  className="group relative bg-primary hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-neutral-950 rounded-xl h-14 px-10 text-lg font-bold hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40"
                >
                  <div className="absolute inset-0 bg-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <span className="relative flex items-center gap-2">
                    Start Selling Now
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              )}

              <SocialProofBadge
                users={[
                  { src: "/images/fash4.png", alt: "@user1", fallback: "U1" },
                  { src: "/images/fash0.png", alt: "@user2", fallback: "U2" },
                  { src: "/images/fash1.png", alt: "@user3", fallback: "U3" },
                ]}
                rating={4.9}
                totalUsers={100}
                maxAvatars={3}
              />
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <motion.div
            variants={transitionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="flex-1 w-full max-w-2xl"
          >
            <div className="relative group p-2 bg-white dark:bg-neutral-800 rounded-[2.5rem] shadow-2xl border border-border/50 dark:border-white/5 overflow-hidden transform hover:-rotate-1 transition-transform duration-700">
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-muted">
                <video
                  className="w-full h-full object-cover"
                  src="/videos/campaign5.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />

                {/* Floating Elements for "Story" feel */}
                <div className="absolute top-6 right-6 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-2xl border border-white/20 dark:border-white/5 flex items-center gap-3 animate-bounce">
                  <div className="w-10 h-10 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <div className="bg-white/20 p-1 rounded-full">
                      <ArrowRight className="h-4 w-4 rotate-[-45deg]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em]">
                      Recent Sale
                    </p>
                    <p className="text-sm font-black text-foreground">
                      ₦45,000 received
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
