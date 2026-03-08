import { motion } from "framer-motion";
import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";
import PolicySection from "../../vendor/components/PolicySection";

export default function PrivacyPolicyPage() {
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
    <div className="min-h-screen bg-white dark:bg-neutral-950 py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="w-full mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center p-5 bg-primary/10 dark:bg-emerald-500/10 rounded-[2rem] mb-8 ring-8 ring-primary/5 dark:ring-emerald-500/5 transition-all">
            <Shield className="w-12 h-12 text-primary dark:text-emerald-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tighter leading-none italic">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Your privacy is our priority. We are committed to protecting your
            personal data with the highest security standards.
          </p>
          <div className="mt-8 inline-flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground bg-white/50 dark:bg-neutral-900/40 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/5 mx-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Last updated: February 7, 2026
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-white/50 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-[3rem] shadow-2xl shadow-primary/5 dark:shadow-emerald-500/5 border border-zinc-200 dark:border-white/5 p-8 sm:p-12 md:p-20 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-emerald-500/10 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2 opacity-50" />

          <div className="relative z-10 space-y-16">
            <motion.div variants={item}>
              <PolicySection title="1. Introduction">
                <p>
                  Welcome to EasyStore ("we," "our," or "us"). We respect your
                  privacy and are committed to protecting your personal data.
                  This privacy policy will inform you as to how we look after
                  your personal data when you visit our website (regardless of
                  where you visit it from) and tell you about your privacy
                  rights and how the law protects you.
                </p>
                <div className="mt-6 p-6 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-[2rem] border border-emerald-500/10 dark:border-emerald-500/20 text-sm text-emerald-700 dark:text-emerald-400 flex gap-4">
                  <div className="shrink-0 mt-0.5">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="font-bold leading-relaxed">
                    By using our platform, you agree to the collection and use
                    of information in accordance with this policy.
                  </p>
                </div>
              </PolicySection>
            </motion.div>

            <motion.div variants={item}>
              <PolicySection title="2. Information We Collect">
                <p>
                  We may collect, use, store and transfer different kinds of
                  personal data about you which we have grouped together as
                  follows:
                </p>
                <div className="grid sm:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 rounded-[2rem] bg-white/50 dark:bg-neutral-950/50 border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all group">
                    <h3 className="font-black text-foreground mb-3 flex items-center gap-2 uppercase tracking-widest text-xs">
                      Identity Data
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      includes first name, last name, username or similar
                      identifier, title, date of birth and gender.
                    </p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-white/50 dark:bg-neutral-950/50 border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all group">
                    <h3 className="font-black text-foreground mb-3 flex items-center gap-2 uppercase tracking-widest text-xs">
                      Contact Data
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      includes billing address, delivery address, email address
                      and telephone numbers.
                    </p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-white/50 dark:bg-neutral-950/50 border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all group">
                    <h3 className="font-black text-foreground mb-3 flex items-center gap-2 uppercase tracking-widest text-xs">
                      Financial Data
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      includes bank account and payment card details (processed
                      securely via our payment providers).
                    </p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-white/50 dark:bg-neutral-950/50 border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all group">
                    <h3 className="font-black text-foreground mb-3 flex items-center gap-2 uppercase tracking-widest text-xs">
                      Technical Data
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      includes internet protocol (IP) address, your login data,
                      browser type and version, time zone setting and location.
                    </p>
                  </div>
                </div>
              </PolicySection>
            </motion.div>

            <motion.div variants={item}>
              <PolicySection title="3. How We Use Your Data">
                <p>
                  We will only use your personal data when the law allows us to.
                  Most commonly, we will use your personal data in the following
                  circumstances:
                </p>
                <ul className="list-none space-y-4 mt-6">
                  {[
                    "Where we need to perform the contract we are about to enter into or have entered into with you.",
                    "Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.",
                    "Where we need to comply with a legal or regulatory obligation.",
                  ].map((text, i) => (
                    <li
                      key={i}
                      className="flex gap-4 items-start font-medium text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </PolicySection>
            </motion.div>

            <motion.div variants={item}>
              <PolicySection title="4. Data Security">
                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="bg-emerald-500/10 p-4 rounded-2xl shrink-0 ring-4 ring-emerald-500/5">
                    <Lock className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-4">
                    <p className="leading-relaxed">
                      We have put in place appropriate security measures to
                      prevent your personal data from being accidentally lost,
                      used or accessed in an unauthorized way, altered or
                      disclosed.
                    </p>
                    <p className="leading-relaxed">
                      In addition, we limit access to your personal data to
                      those employees, agents, contractors and other third
                      parties who have a business need to know. They will only
                      process your personal data on our instructions and they
                      are subject to a duty of confidentiality.
                    </p>
                  </div>
                </div>
              </PolicySection>
            </motion.div>

            <motion.div variants={item}>
              <PolicySection title="5. Your Legal Rights">
                <p>
                  Under certain circumstances, you have rights under data
                  protection laws in relation to your personal data, including
                  the right to request access, correction, erasure, restriction,
                  transfer, to object to processing, to portability of data and
                  (where the lawful ground of processing is consent) to withdraw
                  consent.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
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
                      className="inline-flex items-center px-4 py-2 rounded-xl bg-white dark:bg-neutral-950 text-foreground text-xs font-black uppercase tracking-widest border border-zinc-200 dark:border-white/5 shadow-sm"
                    >
                      {right}
                    </span>
                  ))}
                </div>
              </PolicySection>
            </motion.div>

            <motion.div variants={item}>
              <PolicySection title="6. Contact Us">
                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-emerald-500/10 dark:border-emerald-500/20">
                  <div>
                    <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">
                      Have questions about your privacy?
                    </h3>
                    <p className="text-muted-foreground font-medium max-w-md">
                      Our dedicated data protection team is here to help you
                      understand how your data is handled.
                    </p>
                  </div>
                  <a
                    href="mailto:privacy@easystore.com"
                    className="inline-flex items-center justify-center px-10 py-5 border border-transparent text-sm font-black uppercase tracking-[0.2em] rounded-2xl text-white dark:text-neutral-950 bg-primary dark:bg-emerald-500 hover:scale-105 transition-all active:scale-95 whitespace-nowrap shadow-xl shadow-primary/20 dark:shadow-emerald-500/20"
                  >
                    Contact Privacy Team
                  </a>
                </div>
              </PolicySection>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
