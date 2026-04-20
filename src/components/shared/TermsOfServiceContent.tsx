import { motion } from "framer-motion";
import {
  Scale,
  FileCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import PolicySection from "@/modules/vendor/components/PolicySection";

export function TermsOfServiceContent() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 sm:mb-20"
      >
        <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-primary/10 dark:bg-emerald-500/10 rounded-sm mb-6 sm:mb-8 ring-8 ring-primary/5 dark:ring-emerald-500/5 transition-all">
          <Scale className="w-10 h-10 sm:w-12 sm:h-12 text-primary dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-foreground mb-4 sm:mb-8 tracking-tighter leading-none italic">
          Terms of Service
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-semibold">
          Please read these terms carefully before using our platform. They contain important information about your legal rights and obligations.
        </p>
        <div className="mt-6 sm:mt-8 inline-flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl px-4 sm:px-6 py-2 sm:py-3 rounded-sm border border-zinc-200 dark:border-white/5 mx-auto">
          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
          Last updated: February 7, 2026
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 space-y-12 sm:space-y-16"
      >
        <motion.div variants={item}>
          <PolicySection title="1. Acceptance of Terms">
            <p>
              By accessing or using the EazyStore platform, you agree to be
              bound by these Terms of Service and all applicable laws and
              regulations. If you do not agree with any of these terms, you
              are prohibited from using or accessing this site.
            </p>
            <div className="mt-6 p-4 sm:p-6 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-sm border border-emerald-500/10 dark:border-emerald-500/20 text-sm text-emerald-700 dark:text-emerald-400 flex gap-3 sm:gap-4">
              <div className="shrink-0 mt-0.5">
                <FileCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p className="font-bold leading-relaxed">
                These terms constitute a legally binding agreement between
                you and EazyStore regarding your use of the Service.
              </p>
            </div>
          </PolicySection>
        </motion.div>

        <motion.div variants={item}>
          <PolicySection title="2. User Accounts">
            <p>
              When you create an account with us, you must provide
              information that is accurate, complete, and current at all
              times. Failure to do so constitutes a breach of the Terms,
              which may result in immediate termination of your account on
              our Service.
            </p>
            <div className="grid gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="flex gap-4 sm:gap-6 items-start p-4 sm:p-6 bg-white/50 dark:bg-neutral-950/50 border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all rounded-sm group">
                <div className="p-2.5 sm:p-3 bg-primary/10 dark:bg-emerald-500/10 text-primary dark:text-emerald-400 rounded-sm shrink-0 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="font-black text-foreground text-base sm:text-lg mb-1 sm:mb-2">
                    Account Security
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold">
                    You are responsible for safeguarding the password that
                    you use to access the Service and for any activities or
                    actions under your password.
                  </p>
                </div>
              </div>
            </div>
          </PolicySection>
        </motion.div>

        <motion.div variants={item}>
          <PolicySection title="3. Buying and Selling">
            <p>
              Our platform serves as a marketplace where users can sell and
              buy goods. We are not a party to any transaction between
              buyers and sellers, although we provide the platform that
              allows such transactions to occur.
            </p>
            <ul className="list-none space-y-3 sm:space-y-4 mt-6">
              <li className="flex gap-3 sm:gap-4 items-start font-semibold text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-sm bg-emerald-500 mt-2.5 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-foreground font-black">
                    For Buyers:
                  </strong>{" "}
                  You agree to pay for items purchased. You understand that
                  your order may be subject to shipping fees and taxes.
                </span>
              </li>
              <li className="flex gap-3 sm:gap-4 items-start font-semibold text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-sm bg-emerald-500 mt-2.5 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-foreground font-black">
                    For Sellers:
                  </strong>{" "}
                  You agree to ship items promptly and to accurately
                  describe items listed for sale. You are responsible for
                  your own tax obligations.
                </span>
              </li>
            </ul>
          </PolicySection>
        </motion.div>

        <motion.div variants={item}>
          <PolicySection title="4. Prohibited Activities">
            <p>
              You agree not to engage in any of the following prohibited
              activities:
            </p>
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                "Violating laws",
                "Selling illegal goods",
                "Harassment",
                "Spamming",
                "Data mining",
                "Impersonation",
              ].map((act, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 sm:p-4 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 rounded-sm text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400 uppercase tracking-tight"
                >
                  <span className="w-1.5 h-1.5 rounded-sm bg-rose-500 shrink-0"></span>
                  {act}
                </div>
              ))}
            </div>
          </PolicySection>
        </motion.div>

        <motion.div variants={item}>
          <PolicySection title="5. Intellectual Property">
            <p>
              The Service and its original content (excluding Content
              provided by users), features and functionality are and will
              remain the exclusive property of EazyStore and its licensors.
              The Service is protected by copyright, trademark, and other
              laws.
            </p>
          </PolicySection>
        </motion.div>

        <motion.div variants={item}>
          <PolicySection title="6. Termination">
            <p>
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever,
              including without limitation if you breach the Terms. Upon
              termination, your right to use the Service will immediately
              cease.
            </p>
          </PolicySection>
        </motion.div>

        <motion.div variants={item}>
          <PolicySection title="7. Contact & Support">
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 rounded-sm p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 border border-emerald-500/10 dark:border-emerald-500/20">
              <div className="flex gap-4 sm:gap-6 items-center">
                <div className="p-3 sm:p-4 bg-white dark:bg-neutral-900 rounded-sm border border-zinc-100 dark:border-white/5 shadow-sm">
                  <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">
                    Questions about Terms?
                  </h3>
                  <p className="text-muted-foreground font-semibold text-xs sm:text-sm mt-1">
                    Contact our legal team for clarification.
                  </p>
                </div>
              </div>
              <a
                href="mailto:support@eazystore.com.ng"
                className="w-full md:w-auto inline-flex items-center justify-center px-6 sm:px-10 py-4 sm:py-5 border border-transparent text-xs sm:text-sm font-black uppercase tracking-[0.2em] rounded-sm text-white dark:text-neutral-950 bg-primary dark:bg-emerald-500 hover:scale-[1.02] transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-primary/20 dark:shadow-emerald-500/20"
              >
                Contact Legal Team
              </a>
            </div>
          </PolicySection>
        </motion.div>
      </motion.div>
    </div>
  );
}
