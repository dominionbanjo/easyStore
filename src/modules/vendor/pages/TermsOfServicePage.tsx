import { motion } from "framer-motion";
import {
  Scale,
  FileCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import PolicySection from "../components/PolicySection";

export default function TermsOfServicePage() {
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
            <Scale className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our platform. They
            contain important information about your legal rights and
            obligations.
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
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-50 rounded-br-[10rem] -z-0 opacity-50" />

          <div className="relative z-10 space-y-12">
            <motion.div variants={item}>
              <PolicySection title="1. Acceptance of Terms">
                <p>
                  By accessing or using the EasyStore platform, you agree to be
                  bound by these Terms of Service and all applicable laws and
                  regulations. If you do not agree with any of these terms, you
                  are prohibited from using or accessing this site.
                </p>
                <div className="mt-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100 text-sm text-purple-700 flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <p>
                    These terms constitute a legally binding agreement between
                    you and EasyStore regarding your use of the Service.
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
                <div className="grid gap-4 mt-6">
                  <div className="flex gap-4 items-start p-4 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="p-2 bg-blue-100/50 text-blue-600 rounded-lg shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Account Security
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
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
                <ul className="list-disc pl-5 space-y-3 mt-4 marker:text-purple-500">
                  <li>
                    <strong>For Buyers:</strong> You agree to pay for items
                    purchased. You understand that your order may be subject to
                    shipping fees and taxes.
                  </li>
                  <li>
                    <strong>For Sellers:</strong> You agree to ship items
                    promptly and to accurately describe items listed for sale.
                    You are responsible for your own tax obligations.
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
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
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
                      className="flex items-center gap-3 p-3 bg-red-50/50 border border-red-100 rounded-lg text-sm text-red-800"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
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
                  remain the exclusive property of EasyStore and its licensors.
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
                <div className="bg-purple-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-100">
                  <div className="flex gap-4 items-center">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <HelpCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Questions about Terms?
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Contact our legal team for clarification.
                      </p>
                    </div>
                  </div>
                  <a
                    href="mailto:legal@easystore.com"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all active:scale-95 whitespace-nowrap"
                  >
                    Contact Legal Team
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
