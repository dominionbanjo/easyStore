import { motion } from "framer-motion";
import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";
import PolicySection from "../components/PolicySection";

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
    <div className="min-h-screen bg-gray-50/30 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 bg-purple-100/50 rounded-2xl mb-6 ring-1 ring-purple-100">
            <Shield className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your privacy is important to us. We are committed to protecting your
            personal data and ensuring transparency.
          </p>
          <div className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 mx-auto">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Last updated: February 7, 2026
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-white rounded-[2rem] shadow-xl shadow-purple-900/5 border border-purple-100/50 p-8 sm:p-12 md:p-16 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-bl-[10rem] -z-0 opacity-50" />

          <div className="relative z-10 space-y-12">
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
                <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-blue-700 flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <p>
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
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      Identity Data
                    </h3>
                    <p className="text-sm text-gray-600">
                      includes first name, last name, username or similar
                      identifier, title, date of birth and gender.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      Contact Data
                    </h3>
                    <p className="text-sm text-gray-600">
                      includes billing address, delivery address, email address
                      and telephone numbers.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      Financial Data
                    </h3>
                    <p className="text-sm text-gray-600">
                      includes bank account and payment card details (processed
                      securely via our payment providers).
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      Technical Data
                    </h3>
                    <p className="text-sm text-gray-600">
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
                <ul className="list-disc pl-5 space-y-3 mt-4 marker:text-purple-500">
                  <li>
                    Where we need to perform the contract we are about to enter
                    into or have entered into with you.
                  </li>
                  <li>
                    Where it is necessary for our legitimate interests (or those
                    of a third party) and your interests and fundamental rights
                    do not override those interests.
                  </li>
                  <li>
                    Where we need to comply with a legal or regulatory
                    obligation.
                  </li>
                </ul>
              </PolicySection>
            </motion.div>

            <motion.div variants={item}>
              <PolicySection title="4. Data Security">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="bg-green-50 p-3 rounded-xl shrink-0">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="mb-4">
                      We have put in place appropriate security measures to
                      prevent your personal data from being accidentally lost,
                      used or accessed in an unauthorized way, altered or
                      disclosed.
                    </p>
                    <p>
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
                <div className="mt-6 flex flex-wrap gap-3">
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
                      className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200"
                    >
                      {right}
                    </span>
                  ))}
                </div>
              </PolicySection>
            </motion.div>

            <motion.div variants={item}>
              <PolicySection title="6. Contact Us">
                <div className="bg-purple-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-100">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Have questions about your privacy?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Our dedicated data protection team is here to help you
                      understand how your data is handled.
                    </p>
                  </div>
                  <a
                    href="mailto:privacy@easystore.com"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all active:scale-95 whitespace-nowrap"
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
