import { useState } from "react";
import {
  Flash,
  ShieldTick,
  PlayCircle,
  Shop,
  Location,
  Heart,
  TrendUp,
  Money,
  Crown,
} from "iconsax-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  selectCurrentUser,
  setShowOnboardingModal,
} from "@/features/userSlice";
import { AUTH_ROUTES } from "@/routes/index";
import { getBaseDomain, areSubdomainsDisabled } from "@/utils/subdomain";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/shared/Modal";

export function HeroTitle() {
  return (
    <>
      <span className="block lg:inline">Launch your store,</span>{" "}
      <span className="block lg:inline">own your website, and</span>
      <span className="block">get paid securely</span>
      <span className="relative inline-block">
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
              strokeDasharray="200"
              strokeDashoffset="200"
              className="animate-dash"
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
  const [isVideoOpen, setIsVideoOpen] = useState(false);

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

    dispatch(
      setShowOnboardingModal({
        show: true,
        step: "store-form",
      }),
    );
  };

  return (
    <>
      <section className="relative isolate pt-12 sm:pt-20 lg:pt-28 pb-20 sm:pb-32 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden blur-[2px]">
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full mx-auto max-w-6xl px-4 sm:px-8 lg:px-16">
          <div
            className="flex flex-col items-center text-center space-y-7 lg:space-y-8"
          >
            <h1
              className="text-[34px] sm:text-5xl md:text-6xl lg:text-[54px] font-black tracking-tighter leading-[1.08] text-white"
            >
              <HeroTitle />
            </h1>

            <p
              className="text-base sm:text-lg lg:text-xl leading-relaxed text-neutral-300 font-medium max-w-3xl"
            >
              Your brand deserves a store that works as hard as you do.
              Launch in minutes with your own website, payment protection,
              and zero technical skills.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <button
                onClick={handleGetStarted}
                className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-emerald-600 text-white rounded-sm text-sm font-black hover:scale-[1.02] active:scale-95 transition-all animate-pulse-glow shadow-2xl shadow-emerald-500/30"
              >
                Get Started
              </button>

              <button
                onClick={() => setIsVideoOpen(true)}
                className="flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm hover:bg-white/10 transition-colors group"
              >
                <PlayCircle
                  variant="Bold"
                  color="#10b981"
                  className="group-hover:scale-110 transition-transform"
                  size={18}
                />
                <span className="text-white font-black text-sm">Watch demo</span>
              </button>
            </div>

            <div
              className="flex flex-wrap items-center justify-center gap-6"
            >
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="text-emerald-400 font-black text-lg">₦10M+</span>
                <span className="text-sm font-medium">processed securely</span>
              </div>
              <div className="w-px h-5 bg-white/10" />
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="text-amber-400 font-black text-lg">500+</span>
                <span className="text-sm font-medium">active stores</span>
              </div>
            </div>

            <div
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm px-5 py-3"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Custom Website
              </span>
              <span className="text-neutral-500 mx-1">—</span>
              <span className="text-emerald-400 font-black text-sm italic">
                yourbrand
              </span>
              <span className="text-white font-bold text-sm">
                .eazystore.com.ng
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          <Shop variant="Bold" color="#10b981" size={32} className="absolute left-[5%] top-[12%] animate-float" />
          <Location variant="Bold" color="#f59e0b" size={28} className="absolute left-[3%] top-[35%] animate-float-delayed" />
          <Heart variant="Bold" color="#ef4444" size={26} className="absolute left-[6%] top-[58%] animate-float" />
          <Crown variant="Bold" color="#f59e0b" size={30} className="absolute left-[4%] top-[80%] animate-float-delayed" />

          <Flash variant="Bold" color="#f59e0b" size={32} className="absolute right-[5%] top-[10%] animate-float-delayed" />
          <ShieldTick variant="Bold" color="#10b981" size={28} className="absolute right-[3%] top-[33%] animate-float" />
          <TrendUp variant="Bold" color="#10b981" size={26} className="absolute right-[6%] top-[56%] animate-float-delayed" />
          <Money variant="Bold" color="#10b981" size={30} className="absolute right-[4%] top-[78%] animate-float" />
        </div>
      </section>

      <Modal
        open={isVideoOpen}
        onOpenChange={setIsVideoOpen}
        title="How to setup your store"
        className="max-w-[95vw] sm:max-w-[800px] h-fit"
      >
        <div className="aspect-video w-full bg-black relative">
          <video
            src="https://res.cloudinary.com/dcmg4skhv/video/upload/v1778502104/lv_0_20260511131325_fa0q0v.mp4"
            className="w-full h-full object-contain"
            controls
            autoPlay
            playsInline
          />
        </div>
      </Modal>
    </>
  );
}
