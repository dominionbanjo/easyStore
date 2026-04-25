import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, Clock } from "lucide-react";
import {
  Flash,
  ShieldTick,
  Shop,
  TrendUp,
  Headphone,
  Monitor,
  Setting2,
  Camera,
  Location,
  Card,
  Gift,
  LampOn,
  Mobile,
  Tag2,
  ShoppingBag,
  Heart,
} from "iconsax-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  selectCurrentUser,
  setShowOnboardingModal,
} from "@/features/userSlice";
import {
  GrowthIllustration,
  SocialIllustration,
  TeamIllustration,
} from "./HeroDecorations";
import { AUTH_ROUTES } from "@/routes/index";
import { getBaseDomain, areSubdomainsDisabled } from "@/utils/subdomain";
import { useNavigate } from "react-router-dom";

// Vibrant colorful floating icons for a dynamic, alive feel
const floatingIcons = [
  {
    Icon: Headphone,
    top: "8%",
    left: "14%",
    delay: 0,
    size: 42,
    color: "#FF6B6B",
  },
  {
    Icon: Monitor,
    top: "12%",
    left: "78%",
    delay: 1.2,
    size: 46,
    color: "#4DABF7",
  },
  {
    Icon: Setting2,
    top: "32%",
    left: "8%",
    delay: 2,
    size: 36,
    color: "#FAB005",
  },
  {
    Icon: Rocket,
    top: "52%",
    left: "10%",
    delay: 0.5,
    size: 50,
    color: "#748FFC",
    isLucide: true,
  },
  {
    Icon: Camera,
    top: "64%",
    left: "4%",
    delay: 1.5,
    size: 38,
    color: "#FF922B",
  },
  {
    Icon: Location,
    top: "76%",
    left: "17%",
    delay: 2.5,
    size: 32,
    color: "#FF8787",
  },
  { Icon: Card, top: "84%", left: "9%", delay: 1, size: 42, color: "#20C997" },
  {
    Icon: Mobile,
    top: "28%",
    left: "84%",
    delay: 0.8,
    size: 48,
    color: "#ADB5BD",
  },
  {
    Icon: Clock,
    top: "48%",
    left: "88%",
    delay: 1.2,
    size: 32,
    color: "#845EF7",
    isLucide: true,
  },
  {
    Icon: LampOn,
    top: "68%",
    left: "80%",
    delay: 2,
    size: 36,
    color: "#FCC419",
  },
  {
    Icon: Gift,
    top: "86%",
    left: "74%",
    delay: 0.3,
    size: 40,
    color: "#F06595",
  },
  {
    Icon: Tag2,
    top: "18%",
    left: "5%",
    delay: 0.7,
    size: 34,
    color: "#FF4757",
  },
  {
    Icon: Shop,
    top: "42%",
    left: "92%",
    delay: 1.1,
    size: 40,
    color: "#2ED573",
  },
  {
    Icon: Card,
    top: "15%",
    left: "40%",
    delay: 1.5,
    size: 30,
    color: "#747D8C",
  },
  {
    Icon: ShoppingBag,
    top: "75%",
    left: "85%",
    delay: 0.5,
    size: 38,
    color: "#FFA502",
  },
  {
    Icon: Heart,
    top: "25%",
    left: "70%",
    delay: 2,
    size: 28,
    color: "#FF1F5A",
  },
  {
    Icon: TrendUp,
    top: "55%",
    left: "5%",
    delay: 1.3,
    size: 32,
    color: "#10AC84",
  },
];

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

    dispatch(
      setShowOnboardingModal({
        show: true,
        step: "store-form",
      }),
    );
  };

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center pt-24 sm:pt-36 md:pt-48 pb-20 overflow-hidden bg-transparent">
      {/* Background illumination — Softer and better blended for dark mode */}
      <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[1400px] h-[1000px] bg-primary/[0.08] dark:bg-primary/[0.12] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-0 -left-60 w-[900px] h-[900px] bg-blue-500/[0.05] dark:bg-blue-400/[0.08] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 -right-60 w-[1000px] h-[1000px] bg-purple-500/[0.05] dark:bg-purple-400/[0.08] rounded-full blur-[180px] pointer-events-none" />

      {/* Decorative Illustrations — Blurred into background textures to keep text focus */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none blur-[6px] opacity-70">
        <GrowthIllustration
          className="absolute -left-20 top-[10%] w-[500px] md:w-[700px] opacity-[0.12] dark:opacity-[0.2]"
          primaryColor="var(--color-primary, #10b981)"
        />
        <SocialIllustration
          className="absolute -right-20 top-[20%] w-[500px] md:w-[750px] opacity-[0.12] dark:opacity-[0.2]"
          primaryColor="var(--color-primary, #10b981)"
        />
        <TeamIllustration
          className="absolute right-[10%] bottom-[0%] w-[450px] opacity-[0.08] dark:opacity-[0.15] hidden xl:block"
          primaryColor="var(--color-primary, #10b981)"
        />
        <GrowthIllustration
          className="absolute left-1/3 bottom-[-10%] w-[400px] opacity-[0.08] dark:opacity-[0.15] hidden xl:block"
          primaryColor="var(--color-primary, #10b981)"
        />
      </div>

      {/* Floating commerce icons — now visible on mobile with adjusted scale */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {floatingIcons.map(
          ({ Icon, top, left, size, color, isLucide }, index) => (
            <div
              key={index}
              className="absolute"
              style={{ top, left }}
            >
              <Icon
                {...(isLucide ? {} : { variant: "Bold" })}
                color={color}
                size={size}
                className="opacity-20 sm:opacity-30 drop-shadow-sm scale-75 sm:scale-100"
              />
            </div>
          ),
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 text-center flex flex-col items-center">
        {/* Headline - Guaranteed 3 lines by removing restrictive max-widths */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[40px] sm:text-6xl md:text-7xl lg:text-[82px] font-black tracking-tight leading-[1.05] text-foreground mb-8 w-full max-w-none drop-shadow-[0_2px_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
        >
          Launch your store, <br className="hidden lg:block" />
          manage products and get paid <br className="hidden lg:block" />
          <span className="text-primary italic font-serif">in minutes.</span>
        </motion.h1>

        {/* Subtext - Refined to be more comprehensive */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-800/90 dark:text-slate-100/90 font-bold leading-relaxed mb-10 sm:mb-16 px-4"
        >
          Accept payments, manage orders, and grow your business with your own
          custom store link.
        </motion.p>

        {/* Primary CTA & Secondary Action - Moved closer to subtext */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col items-center justify-center mt-2 group"
        >
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="h-14 px-12 text-lg font-black bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            Create Store
          </Button>
        </motion.div>

        {/* Social Proof & Trust Badges - High impact context directly under CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-10 flex flex-col items-center gap-6"
        >
          {/* Seller Trust */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex -space-x-3 items-center">
              {[
                "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100&h=100",
                "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=100&h=100",
                "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=100&h=100",
                "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&q=80&w=100&h=100",
              ].map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`seller-${i}`}
                  className="w-10 h-10 rounded-full border-2 border-background object-cover shadow-sm bg-neutral-200 dark:bg-neutral-800"
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary backdrop-blur-sm">
                +1K
              </div>
            </div>
            <span className="text-sm font-bold text-neutral-600 dark:text-slate-300 tracking-tight">
              Trusted by 1,000+ Nigerian sellers
            </span>
          </div>
        </motion.div>

        {/* Floating Link Card — Now responsive and visible on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative xl:absolute xl:right-8 xl:top-1/2 xl:-translate-y-1/2 flex flex-col gap-4 z-20 mt-16 xl:mt-0 px-4 w-full sm:w-auto items-center xl:items-start"
        >
          <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-5 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-4 w-full max-w-[280px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-primary/20 flex items-center justify-center text-primary">
                <Shop variant="Bold" color="currentColor" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-tighter text-neutral-500 dark:text-neutral-400">
                  Custom Domain
                </span>
                <span className="text-sm font-bold text-foreground">
                  Your Brand, Your Link.
                </span>
              </div>
            </div>

            <div className="bg-neutral-500/10 dark:bg-neutral-500/20 rounded-sm p-3 border border-neutral-200 dark:border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400/50" />
                </div>
                <div className="h-1 flex-1 bg-neutral-200 dark:bg-white/5 rounded-full" />
              </div>
              <div className="text-[11px] font-black tracking-tight flex items-center gap-1.5">
                <span className="text-neutral-500">https://</span>
                <span className="text-primary italic">gameshop</span>
                <span className="text-neutral-600 dark:text-neutral-200">
                  .eazystore.com.ng
                </span>
              </div>
            </div>

            <p className="text-[10px] text-neutral-600 dark:text-neutral-400 font-bold leading-tight">
              Build domain authority and trust with a link that truly represents
              your brand.
            </p>
          </div>

          <div className="self-end mr-6 bg-white/80 dark:bg-primary/20 backdrop-blur-md border border-neutral-200 dark:border-primary/30 px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span className="text-[10px] font-black text-primary uppercase tracking-wider">
              Live Preview
            </span>
          </div>
        </motion.div>

        {/* Feature Pillars - Less 'weird', more integrated */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-24 max-w-4xl mx-auto"
        >
          {[
            {
              title: "Your Store Link",
              desc: "Not a marketplace profile — a real brand.",
              Icon: Shop,
              color: "#FF6B6B",
              bg: "bg-red-50 dark:bg-red-950/20",
            },
            {
              title: "Instant Setup",
              desc: "No coding, no stress. Go live in minutes.",
              Icon: Flash,
              color: "#FAB005",
              bg: "bg-yellow-50 dark:bg-yellow-950/20",
            },
            {
              title: "Secure Escrow",
              desc: "Get paid safely. Buyers trust you more.",
              Icon: TrendUp,
              color: "#4DABF7",
              bg: "bg-blue-50 dark:bg-blue-950/20",
            },
            {
              title: "1.5% Per Delivery",
              desc: "Low costs, only pay when you ship.",
              Icon: ShieldTick,
              color: "#20C997",
              bg: "bg-emerald-50 dark:bg-emerald-950/20",
            },
          ].map((feature, idx) => (
            <div key={idx} className="group flex items-start gap-5 text-left">
              <div
                className={`w-12 h-12 shrink-0 rounded-sm ${feature.bg} flex items-center justify-center shadow-sm`}
              >
                <feature.Icon variant="Bold" color={feature.color} size={24} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-black text-foreground leading-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-bold mt-1">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
