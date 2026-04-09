import { motion } from "framer-motion";

// Sub-components
import { HelpHeader } from "../components/help/HelpHeader";
import { HelpGrid } from "../components/help/HelpGrid";
import { FAQSection } from "../components/help/FAQSection";
import { SupportForm } from "../components/help/SupportForm";
import { TutorialList } from "../components/help/TutorialList";

export default function HelpPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1400px] mx-auto space-y-20 pb-24"
    >
      {/* ─── Hero & Search ─── */}
      <HelpHeader />

      {/* ─── Category Navigation ─── */}
      <div className="space-y-8">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black tracking-tight">
            Browse Categories
          </h2>
          <p className="text-muted-foreground font-medium">
            Quickly find help by specialized topics
          </p>
        </div>
        <HelpGrid />
      </div>

      {/* ─── FAQ & Contact Split ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-stretch">
        <FAQSection />
        <SupportForm />
      </div>

      {/* ─── Video Tutorials ─── */}
      <TutorialList />

      {/* ─── Footnote ─── */}
      <div className="pt-10 border-t border-border/50 text-center">
        <p className="text-muted-foreground text-sm font-medium">
          Still having trouble? Email us directly at{" "}
          <a
            href="mailto:support@eazystore.com.ng"
            className="text-emerald-500 font-bold hover:underline transition-all"
          >
            support@eazystore.com.ng
          </a>
        </p>
        <div className="flex items-center justify-center gap-6 mt-6 opacity-60">
          {["System Status: Online", "Documentation v2.4", "Vendor Policy"].map(
            (text) => (
              <span
                key={text}
                className="text-[10px] font-black uppercase tracking-[0.2em]"
              >
                {text}
              </span>
            ),
          )}
        </div>
      </div>

      {/* Decorative background gradients */}
      <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-sm pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-sm pointer-events-none" />
    </motion.div>
  );
}
