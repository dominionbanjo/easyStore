import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";
import PolicySection from "@/modules/vendor/components/PolicySection";

export function PrivacyPolicyContent() {
  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div
        className="text-center mb-12 sm:mb-20"
      >
        <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-primary/10 dark:bg-emerald-500/10 rounded-sm mb-6 sm:mb-8 ring-8 ring-primary/5 dark:ring-emerald-500/5 transition-all">
          <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-primary dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-foreground mb-4 sm:mb-8 tracking-tighter leading-none italic">
          Privacy Policy
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-semibold">
          Your privacy is our priority. We are committed to protecting your
          personal data with the highest security standards.
        </p>
        <div className="mt-6 sm:mt-8 inline-flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl px-4 sm:px-6 py-2 sm:py-3 rounded-sm border border-zinc-200 dark:border-white/5 mx-auto">
          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
          Last updated: February 7, 2026
        </div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 space-y-12 sm:space-y-16"
      >
        <div>
          <PolicySection title="1. Introduction">
            <p>
              Welcome to EazyStore ("we," "our," or "us"). We respect your
              privacy and are committed to protecting your personal data.
              This privacy policy will inform you as to how we look after
              your personal data when you visit our website (regardless of
              where you visit it from) and tell you about your privacy
              rights and how the law protects you.
            </p>
            <div className="mt-6 p-4 sm:p-6 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-sm border border-emerald-500/10 dark:border-emerald-500/20 text-sm text-emerald-700 dark:text-emerald-400 flex gap-3 sm:gap-4">
              <div className="shrink-0 mt-0.5">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p className="font-bold leading-relaxed">
                By using our platform, you agree to the collection and use
                of information in accordance with this policy.
              </p>
            </div>
          </PolicySection>
        </div>

        <div>
          <PolicySection title="2. Information We Collect">
            <p>
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together as
              follows:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="p-4 sm:p-6 rounded-sm bg-white/50 dark:bg-neutral-950/50 border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all group">
                <h3 className="font-black text-foreground mb-2 sm:mb-3 flex items-center gap-2 uppercase tracking-widest text-[10px] sm:text-xs">
                  Identity Data
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold">
                  includes first name, last name, username or similar
                  identifier, title, date of birth and gender.
                </p>
              </div>
              <div className="p-4 sm:p-6 rounded-sm bg-white/50 dark:bg-neutral-950/50 border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all group">
                <h3 className="font-black text-foreground mb-2 sm:mb-3 flex items-center gap-2 uppercase tracking-widest text-[10px] sm:text-xs">
                  Contact Data
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold">
                  includes billing address, delivery address, email address
                  and telephone numbers.
                </p>
              </div>
              <div className="p-4 sm:p-6 rounded-sm bg-white/50 dark:bg-neutral-950/50 border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all group">
                <h3 className="font-black text-foreground mb-2 sm:mb-3 flex items-center gap-2 uppercase tracking-widest text-[10px] sm:text-xs">
                  Financial Data
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold">
                  includes bank account and payment card details (processed
                  securely via our payment providers).
                </p>
              </div>
              <div className="p-4 sm:p-6 rounded-sm bg-white/50 dark:bg-neutral-950/50 border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all group">
                <h3 className="font-black text-foreground mb-2 sm:mb-3 flex items-center gap-2 uppercase tracking-widest text-[10px] sm:text-xs">
                  Technical Data
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold">
                  includes internet protocol (IP) address, your login data,
                  browser type and version, time zone setting and location.
                </p>
              </div>
            </div>
          </PolicySection>
        </div>

        <div>
          <PolicySection title="3. How We Use Your Data">
            <p>
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul className="list-none space-y-3 sm:space-y-4 mt-6">
              {[
                "Where we need to perform the contract we are about to enter into or have entered into with you.",
                "Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.",
                "Where we need to comply with a legal or regulatory obligation.",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex gap-3 sm:gap-4 items-start font-semibold text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-sm bg-emerald-500 mt-2.5 shrink-0" />
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </PolicySection>
        </div>

        <div>
          <PolicySection title="4. Data Security">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
              <div className="bg-emerald-500/10 p-3 sm:p-4 rounded-sm shrink-0 ring-4 ring-emerald-500/5">
                <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500 dark:text-emerald-400" />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="leading-relaxed font-medium">
                  We have put in place appropriate security measures to
                  prevent your personal data from being accidentally lost,
                  used or accessed in an unauthorized way, altered or
                  disclosed.
                </p>
                <p className="leading-relaxed font-medium">
                  In addition, we limit access to your personal data to
                  those employees, agents, contractors and other third
                  parties who have a business need to know. They will only
                  process your personal data on our instructions and they
                  are subject to a duty of confidentiality.
                </p>
              </div>
            </div>
          </PolicySection>
        </div>

        <div>
          <PolicySection title="5. Your Legal Rights">
            <p>
              Under certain circumstances, you have rights under data
              protection laws in relation to your personal data, including
              the right to request access, correction, erasure, restriction,
              transfer, to object to processing, to portability of data and
              (where the lawful ground of processing is consent) to withdraw
              consent.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
              {[
                "Request access",
                "Request correction",
                "Request erasure",
                "Object to processing",
                "Request restriction",
                "Request transfer",
                "Right to withdraw consent",
              ].map((right) => (
                <span
                  key={right}
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm bg-white dark:bg-neutral-950 text-foreground text-[10px] sm:text-xs font-black uppercase tracking-widest border border-zinc-200 dark:border-white/5 shadow-sm"
                >
                  {right}
                </span>
              ))}
            </div>
          </PolicySection>
        </div>

        <div>
          <PolicySection title="6. Contact Us">
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 rounded-sm p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 border border-emerald-500/10 dark:border-emerald-500/20">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 sm:mb-3 tracking-tight uppercase">
                  Privacy Questions?
                </h3>
                <p className="text-muted-foreground font-semibold text-xs sm:text-sm max-w-md">
                  Our dedicated data protection team is here to help you
                  understand how your data is handled.
                </p>
              </div>
              <a
                href="mailto:support@eazystore.com.ng"
                className="w-full md:w-auto inline-flex items-center justify-center px-6 sm:px-10 py-4 sm:py-5 border border-transparent text-xs sm:text-sm font-black uppercase tracking-[0.2em] rounded-sm text-white dark:text-neutral-950 bg-primary dark:bg-emerald-500 hover:scale-[1.02] transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-primary/20 dark:shadow-emerald-500/20"
              >
                Contact Privacy Team
              </a>
            </div>
          </PolicySection>
        </div>
      </div>
    </div>
  );
}
