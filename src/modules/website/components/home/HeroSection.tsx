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
const CAMPAIGN_VIDEO =
  "https://res.cloudinary.com/dcmg4skhv/video/upload/v1775865849/campaign_h8etwo.mp4";

export function HeroTitle() {
  return (
    <>
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
    <>
      <section className="relative isolate pt-20 sm:pt-40 pb-12 sm:pb-20 overflow-hidden">
        {/* IMMERSIVE BACKGROUND (Top half only - Full Bleed) */}
        <div className="absolute inset-x-0 top-0 h-[1050px] sm:h-[900px] lg:h-[950px] z-0 pointer-events-none overflow-hidden">
          <img
            src="https://res.cloudinary.com/dcmg4skhv/image/upload/f_auto,q_auto/v1775869586/african_shopping_mobile_uksxfx.jpg"
            alt=""
            loading="eager"
            fetchPriority="high"
            className="sm:hidden w-full h-full object-cover"
          />
          <img
            src="https://res.cloudinary.com/dcmg4skhv/image/upload/f_auto,q_auto/v1775869586/african_shopping_desktop_hfodrq.jpg"
            alt=""
            loading="eager"
            fetchPriority="high"
            className="hidden sm:block w-full h-full object-[center_20%] object-cover"
          />
          {/* Uniform Cinematic Overlays (Locked Dark for high-contrast consistency) */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-neutral-950" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/20 via-transparent to-neutral-950/20" />
        </div>

        <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col items-center justify-center gap-12 sm:gap-20">
            {/* CONTENT SECTION (Centered & Glass-Enhanced) */}
            <div className="w-full max-w-6xl mx-auto text-center space-y-10">
              <div className="space-y-6">
                <motion.h1
                  variants={transitionVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-[40px] sm:text-7xl md:text-8xl lg:text-[100px] font-black tracking-tighter leading-[0.85] text-white lg:max-w-[95%] mx-auto drop-shadow-[0_4px_40px_rgba(0,0,0,0.8)]"
                >
                  <HeroTitle />
                </motion.h1>

                <motion.p
                  variants={transitionVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="w-full text-[17px] sm:text-xl lg:text-2xl leading-relaxed text-neutral-100 font-black max-w-4xl mx-auto text-center drop-shadow-[0_4px_40px_rgba(0,0,0,0.8)]"
                >
                  Give your business the professional edge it deserves. — so you
                  can sell with confidence.
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-12 sm:mt-24">
          <div className="flex flex-col items-center justify-center gap-12 sm:gap-16 w-full">
            {/* Custom Link Preview */}
            <motion.div
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              className="flex justify-center"
            >
              <div className="flex bg-neutral-900/80 backdrop-blur-md rounded-sm min-h-[40px] h-10 items-center justify-center px-4 gap-3 border border-white/10 shadow-xl">
                <div className="flex items-center gap-2 border-r border-white/10 pr-3">
                  <Lock1 variant="Bold" color="#10b981" size={16} />
                  <span className="text-neutral-400 font-bold uppercase tracking-[0.15em] text-[9px] sm:text-[10px] whitespace-nowrap">
                    Your custom link:
                  </span>
                </div>
                <span className="text-[11px] sm:text-sm font-black tracking-tight text-white">
                  <span className="text-emerald-400 underline decoration-emerald-400/30 underline-offset-4">
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
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left max-w-2xl mx-auto"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-white/5 backdrop-blur-sm rounded-sm shrink-0 border border-white/10">
                  <Global variant="Bold" color="#10b981" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Your Store Link</h3>
                  <p className="text-sm text-neutral-200 mt-0.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                    Not a marketplace profile — a real brand.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-white/5 backdrop-blur-sm rounded-sm shrink-0 border border-white/10">
                  <Flash variant="Bold" color="#f59e0b" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Instant Setup</h3>
                  <p className="text-sm text-neutral-200 mt-0.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                    No coding, no stress. Go live in minutes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-white/5 backdrop-blur-sm rounded-sm shrink-0 border border-white/10">
                  <ShieldTick variant="Bold" color="#10b981" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Secure Escrow</h3>
                  <p className="text-sm text-neutral-200 mt-0.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                    Get paid safely. Buyers trust you more.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-white/5 backdrop-blur-sm rounded-sm shrink-0 border border-white/10">
                  <Location variant="Bold" color="#3b82f6" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Built for Nigeria</h3>
                  <p className="text-sm text-neutral-200 mt-0.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                    Works with local payment realities.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video & CTAs Section */}
      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-24 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="flex flex-col items-center justify-center gap-12 sm:gap-20 w-full">
          {/* PREMIUM CAMPAIGN VIDEO (Centerpiece) */}
          <motion.div
            variants={transitionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-[1100px] mx-auto relative px-4"
          >
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-emerald-500/10 blur-[100px] rounded-full -z-10" />

            <div className="relative p-1.5 sm:p-2 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-sm border border-border/50 shadow-2xl overflow-hidden">
              {/* Main Visual: Premium Video Frame */}
              <div className="aspect-[16/10] sm:aspect-video w-full relative overflow-hidden bg-neutral-900 rounded-[2px] transform transition-transform duration-700 hover:scale-[1.005] shadow-inner">
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
              </div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={transitionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="group relative bg-primary hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white rounded-sm h-14 px-8 text-lg font-bold hover:scale-[1.02] active:scale-95 transition-all w-full sm:min-w-[280px] shadow-lg shadow-emerald-500/20"
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
      </div>
    </>
  );
}
