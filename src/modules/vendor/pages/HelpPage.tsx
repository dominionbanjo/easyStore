import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Book,
  Shield,
  LifeBuoy,
  Search,
  Send,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I add a new product to my store?",
      answer:
        "Go to the Products tab in your dashboard and click on 'Add Product'. Fill in the details such as name, price, category, and images, then save to publish.",
    },
    {
      question: "How do I manage my orders?",
      answer:
        "Navigate to the Orders page. You can view all incoming orders, update their status, and communicate with buyers directly from there.",
    },
    {
      question: "How can I edit my store information?",
      answer:
        "Visit the Settings page and open the 'Store Customization' tab to change your store banner, name, and description.",
    },
    {
      question: "How do I receive payments?",
      answer:
        "Add your payout bank details in the 'Payments & Payouts' tab under Settings. Payouts are processed based on your selected frequency.",
    },
  ];

  const policies = [
    {
      title: "Vendor Guidelines",
      description:
        "Learn about the rules and best practices for selling on the platform.",
      icon: <Book className="h-5 w-5 text-primary" />,
    },
    {
      title: "Refund Policy",
      description:
        "Understand the process for handling refunds and disputes with customers.",
      icon: <Shield className="h-5 w-5 text-primary" />,
    },
    {
      title: "Account Safety",
      description:
        "Keep your account secure by following these safety tips and verification processes.",
      icon: <LifeBuoy className="h-5 w-5 text-primary" />,
    },
  ];

  const contactSupport = () => {
    toast.success("Support request submitted successfully!");
  };

  return (
    <section className="space-y-10">
      {/* ─── Header ─── */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-foreground">Help Center</h1>
        <p className="text-muted-foreground text-sm">
          Find answers, reach out to our support team, and explore resources.
        </p>
      </div>

      {/* ─── Search Bar ─── */}
      <div className="max-w-xl mx-auto relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search help articles, FAQs, or topics..."
          className="pl-9"
        />
      </div>

      {/* ─── Tabs Layout ─── */}
      <Tabs defaultValue="faqs" className="w-full mt-6">
        <TabsList className="flex flex-wrap justify-center gap-2 sm:gap-6 bg-transparent py-3 border-b border-border/20">
          {[
            { value: "faqs", label: "FAQs" },
            { value: "contact", label: "Contact Support" },
            { value: "policies", label: "Policies" },
            { value: "tutorials", label: "Tutorials" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "px-5 py-3 text-sm font-medium rounded-full transition-all duration-200",
                "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                "data-[state=active]:bg-primary/30 data-[state=active]:text-foreground"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ───────────────────────────── */}
        {/* FAQs TAB */}
        {/* ───────────────────────────── */}
        <TabsContent value="faqs" className="pt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border border-border/30 shadow-sm">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Quick answers to the most common vendor inquiries.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-sm font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ───────────────────────────── */}
        {/* CONTACT SUPPORT TAB */}
        {/* ───────────────────────────── */}
        <TabsContent value="contact" className="pt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border border-border/30 shadow-sm">
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Need further assistance? Reach out to our support team.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="Your full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input type="email" placeholder="you@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="e.g. Payment issue, store setup..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    placeholder="Write your message here..."
                    rows={5}
                    className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <Button
                  onClick={contactSupport}
                  className="bg-primary text-white rounded-full mt-2 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" /> Submit Request
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ───────────────────────────── */}
        {/* POLICIES TAB */}
        {/* ───────────────────────────── */}
        <TabsContent value="policies" className="pt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {policies.map((policy, i) => (
              <Card
                key={i}
                className="border border-border/30 shadow-sm hover:shadow-md transition-all"
              >
                <CardHeader className="flex items-center gap-2">
                  {policy.icon}
                  <CardTitle className="text-base">{policy.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>{policy.description}</p>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    Learn more <ChevronRight className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* ───────────────────────────── */}
        {/* TUTORIALS TAB */}
        {/* ───────────────────────────── */}
        <TabsContent value="tutorials" className="pt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                title: "Getting Started as a Vendor",
                desc: "A step-by-step walkthrough on setting up your store.",
              },
              {
                title: "Managing Your Products",
                desc: "Learn how to add, edit, and track your product listings.",
              },
              {
                title: "Understanding Analytics",
                desc: "Discover insights on store performance and growth.",
              },
            ].map((tutorial, i) => (
              <Card
                key={i}
                className="border border-border/30 shadow-sm hover:shadow-md transition-all"
              >
                <CardHeader>
                  <CardTitle className="text-base">{tutorial.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>{tutorial.desc}</p>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    Watch Video <ChevronRight className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
