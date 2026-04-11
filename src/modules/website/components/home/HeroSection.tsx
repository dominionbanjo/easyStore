import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Global,
  Flash,
  ShieldTick,
  Location,
  PlayCircle,
  Lock1,
} from "iconsax-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  selectCurrentUser,
  setShowOnboardingModal,
} from "@/features/userSlice";
import { AUTH_ROUTES } from "@/routes/index";
import { getBaseDomain, areSubdomainsDisabled } from "@/utils/subdomain";
import { useNavigate } from "react-router-dom";

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

// Campaign video path
const CAMPAIGN_VIDEO = "https://res.cloudinary.com/dcmg4skhv/video/upload/v1775865849/campaign_h8etwo.mp4";

export function HeroTitle() {
  return (
    <>
      <span className="block text-lg md:text-2xl text-muted-foreground font-semibold mb-4 tracking-normal">
        Stop struggling to sell online.
      </span>
      Launch your store, own your link, and get paid securely{" "}
      <span className="relative inline-block mt-2">
        <span className="relative z-10 text-primary">
          all in minutes.
          <svg
            className="absolute w-full h-3 -bottom-1 left-0 text-emerald-400 opacity-50 z-[-1]"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <path
              d="M0 5 Q 50 10 100 5"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
            />
          </svg>
        </span>
      </span>
    </>
  );
}

export default function HeroSection() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);

  const handleGetStarted = () => {
    if (!user) {
      navigate(`${AUTH_ROUTES.SIGNUP}?role=vendor`);
      return;
    }

    if (user.account_type === "vendor" || user.account_type === "admin") {
      const baseDomain = getBaseDomain();
      const subdomainsDisabled = areSubdomainsDisabled();
      const target = user.account_type === "vendor" ? "vendor" : "admin";

      if (subdomainsDisabled) {
        navigate(`/${target}`);
      } else {
        window.location.href = `${window.location.protocol}//${target}.${baseDomain}/`;
      }
      return;
    }

    // If regular user, show onboarding to create store
    dispatch(
      setShowOnboardingModal({
        show: true,
        step: "store-form",
      }),
    );
  };

  return (
    <section className="relative isolate pt-2 pb-12 sm:py-20 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 transition-colors duration-300 overflow-hidden">
      <div className="w-full mx-auto px-1.5 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-16">
          {/* LEFT SIDE */}
          <div className="flex-1 text-center xl:text-left space-y-8 w-full max-w-full xl:max-w-3xl mx-auto xl:mx-0 px-0">
            {/* Catchy TAG */}
            <motion.h1
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              className="text-[32px] sm:text-5xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight md:text-balance leading-[1.05] px-0 sm:px-0"
            >
              <HeroTitle />
            </motion.h1>

            <motion.p
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="mt-4 w-full text-[15px] sm:text-xl leading-relaxed text-muted-foreground font-medium px-0 sm:px-0"
            >
              Give your business the professional edge it deserves. EazyStore
              gives you{" "}
              <strong>
                your own website, professional store link, and secure escrow
                payments
              </strong>{" "}
              — so you can sell with confidence.
            </motion.p>

            {/* Custom Link Preview - MOVED HERE */}
            <motion.div
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              className="flex justify-center xl:justify-start"
            >
              <div className="flex bg-white dark:bg-neutral-900 rounded-sm min-h-[40px] h-10 items-center justify-center px-4 gap-3 border border-border shadow-sm">
                <div className="flex items-center gap-2 border-r border-border pr-3">
                  <Lock1
                    variant="Bold"
                    color="var(--color-primary, #10b981)"
                    size={16}
                  />
                  <span className="text-muted-foreground font-bold uppercase tracking-[0.15em] text-[9px] sm:text-[10px] whitespace-nowrap">
                    Your custom link:
                  </span>
                </div>
                <span className="text-[11px] sm:text-sm font-black tracking-tight text-foreground">
                  <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-4">
                    gameshop
                  </span>
                  .eazystore.com.ng
                </span>
              </div>
            </motion.div>

            {/* Core Value Pillars */}
            <motion.div
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left max-w-sm sm:max-w-2xl ml-2 sm:ml-0"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-sm shrink-0">
                  <Global
                    variant="Bold"
                    color="var(--color-primary, #10b981)"
                    size={22}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Your Store Link</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Not a marketplace profile — a real brand.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-amber-500/10 rounded-sm shrink-0">
                  <Flash variant="Bold" color="#f59e0b" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Instant Setup</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    No coding, no stress. Go live in minutes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-emerald-500/10 rounded-sm shrink-0">
                  <ShieldTick variant="Bold" color="#10b981" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Secure Escrow</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Get paid safely. Buyers trust you more.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-500/10 rounded-sm shrink-0">
                  <Location variant="Bold" color="#3b82f6" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">
                    Built for Nigeria
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Works with local payment realities.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col items-center xl:items-start gap-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="group relative bg-primary hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white rounded-sm h-14 px-8 text-lg font-bold hover:scale-[1.02] active:scale-95 transition-all w-full shadow-lg shadow-emerald-500/20"
                >
                  <span className="relative flex items-center gap-2">
                    Start Selling Now — It's Free
                    <ArrowRight
                      variant="Outline"
                      color="white"
                      size={20}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 font-bold rounded-sm border-2 w-full sm:w-auto hover:bg-muted text-foreground"
                >
                  <PlayCircle
                    variant="Bold"
                    color="currentColor"
                    size={22}
                    className="mr-2"
                  />{" "}
                  See How It Works
                </Button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE Visual Direction */}
          <motion.div
            variants={transitionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="flex-1 w-full max-w-[800px] xl:flex-[1.4] relative mt-10 xl:mt-0"
          >
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-emerald-500/10 blur-[100px] rounded-full -z-10" />

            <div className="relative p-2 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-sm border border-border/50 shadow-2xl overflow-hidden">
              {/* Main Visual: Premium Video Frame */}
              <div className="aspect-[16/10] sm:aspect-video w-full relative overflow-hidden bg-neutral-900 rounded-[2px] transform transition-transform duration-700 hover:scale-[1.01] shadow-inner">
                <video
                  src={CAMPAIGN_VIDEO}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Overlays / Premium Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Subtle Play indicator for context */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="w-8 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-primary animate-[shimmer_2s_infinite]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                    Touring EazyStore
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
