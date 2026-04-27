import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Global,
  Flash,
  ShieldTick,
  Location,
  PlayCircle,
  Shop,
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
// const CAMPAIGN_VIDEO =
//   "https://res.cloudinary.com/dcmg4skhv/video/upload/v1776268865/campaign2_gstecn.mp4";

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
      <section className="relative isolate pt-12 sm:pt-24 pb-20 sm:pb-32 overflow-hidden">
        {/* IMMERSIVE BACKGROUND (Full Coverage with Refined Blur) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden blur-[4px] scale-105">
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
            className="hidden sm:block w-full h-full object-cover"
          />
          {/* Solid Cinematic Overlay (Ensures text readability without washing out the image) */}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950" />
        </div>

        <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-12 sm:gap-20">
            {/* CONTENT SECTION (Full Width) */}
            <div className="w-full text-center space-y-6">
              <div className="space-y-4">
                <motion.h1
                  variants={transitionVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-[44px] sm:text-7xl md:text-8xl lg:text-[100px] font-black tracking-tighter leading-[0.85] text-white max-w-5xl mx-auto drop-shadow-[0_4px_40px_rgba(0,0,0,0.8)]"
                >
                  <HeroTitle />
                </motion.h1>

                <motion.p
                  variants={transitionVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="w-full text-lg sm:text-xl lg:text-2xl leading-relaxed text-neutral-100 font-bold max-w-4xl mx-auto text-center drop-shadow-[0_4px_40px_rgba(0,0,0,0.8)]"
                >
                  Give your business the professional edge it deserves. Build
                  trust, own your brand, and sell with confidence.
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-4">
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-12 w-full">
            {/* CTAs */}
            <motion.div
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-4 w-full"
            >
              <button className="flex items-center gap-2 group/link text-white/80 hover:text-white transition-colors">
                <PlayCircle
                  variant="Bold"
                  color="currentColor"
                  size={24}
                  className="transition-transform group-hover/link:scale-110"
                />
                <span className="text-lg font-bold border-b-2 border-transparent group-hover/link:border-emerald-400">
                  See how it works
                </span>
              </button>

              <Button
                size="lg"
                onClick={handleGetStarted}
                className="group relative bg-primary hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white rounded-sm h-16 px-10 text-xl font-black hover:scale-[1.02] active:scale-95 transition-all w-fit shadow-2xl shadow-emerald-500/40"
              >
                <span className="relative flex items-center gap-2">
                  Create Store for Free
                </span>
              </Button>
            </motion.div>

            {/* Premium Custom Link Preview Card */}
            <motion.div
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              className="flex justify-center w-full px-4"
            >
              <div className="bg-neutral-900/90 backdrop-blur-2xl border border-white/20 p-6 rounded-sm shadow-[0_30px_60px_rgba(0,0,0,0.6)] space-y-5 w-full max-w-[320px]">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-sm bg-primary/20 flex items-center justify-center text-primary">
                    <Shop variant="Bold" color="currentColor" size={26} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      Custom Domain
                    </span>
                    <span className="text-base font-bold text-white">
                      Your Brand, Your Link.
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-sm p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-400/60" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
                      <div className="w-2 h-2 rounded-full bg-green-400/60" />
                    </div>
                    <div className="h-1 flex-1 bg-white/5 rounded-full" />
                  </div>
                  <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
                    <span className="text-neutral-400">https://</span>
                    <span className="text-emerald-400 italic font-black">
                      gameshop
                    </span>
                    <span className="text-neutral-200 font-black">
                      .eazystore.com.ng
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Core Value Pillars */}
            <motion.div
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left max-w-2xl mx-auto"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-sm shrink-0 border border-white/10">
                  <Global variant="Bold" color="#10b981" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Your Store Link
                  </h3>
                  <p className="text-sm text-neutral-300 mt-1 drop-shadow-md">
                    Not a marketplace profile — a real brand.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-sm shrink-0 border border-white/10">
                  <Flash variant="Bold" color="#f59e0b" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Instant Setup
                  </h3>
                  <p className="text-sm text-neutral-300 mt-1 drop-shadow-md">
                    No coding, no stress. Go live in minutes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-sm shrink-0 border border-white/10">
                  <ShieldTick variant="Bold" color="#10b981" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Secure Escrow
                  </h3>
                  <p className="text-sm text-neutral-300 mt-1 drop-shadow-md">
                    Get paid safely. Buyers trust you more.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-sm shrink-0 border border-white/10">
                  <Location variant="Bold" color="#3b82f6" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Built for Nigeria
                  </h3>
                  <p className="text-sm text-neutral-300 mt-1 drop-shadow-md">
                    Works with local payment realities.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
