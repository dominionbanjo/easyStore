import { useNavigate } from "react-router-dom";
import { Rocket, Store, Wallet, ShieldCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  selectCurrentUser,
  setShowOnboardingModal,
} from "@/features/userSlice";
import { AUTH_ROUTES } from "@/routes";
import { getBaseDomain, areSubdomainsDisabled } from "@/utils/subdomain";

const benefits = [
  {
    icon: Store,
    title: "Free storefront",
    description: "Your own website with a custom subdomain — no fees to start.",
  },
  {
    icon: Wallet,
    title: "Payments protected",
    description: "Escrow-backed transactions keep every sale secure.",
  },
  {
    icon: ShieldCheck,
    title: "Zero technical skills",
    description: "Upload products and start selling in minutes.",
  },
  {
    icon: Rocket,
    title: "Marketplace exposure",
    description: "Thousands of shoppers discover your store every month.",
  },
];

export default function SellCtaSection() {
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
    <section className="py-16 md:py-24 px-4 bg-background dark:bg-neutral-950 transition-colors duration-300">
      <div className="w-full mx-auto max-w-6xl">
        <div className="rounded-sm bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-emerald-900/30 dark:via-emerald-900/10 border border-primary/10 dark:border-emerald-500/20 p-8 md:p-14 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-4">
            Ready to start selling?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-10">
            Join thousands of African entrepreneurs who moved their business
            online with EazyStore — in minutes, not months.
          </p>

          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-emerald-600 text-white rounded-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/25"
          >
            <Store className="w-5 h-5" />
            Create your store — it's free
          </button>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-5 rounded-sm bg-white/60 dark:bg-neutral-900/60 border border-border/50 dark:border-white/5 hover:border-primary/20 transition-colors"
              >
                <benefit.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-bold text-foreground mb-1.5">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
