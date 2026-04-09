import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How long do payouts take after a sale?",
    answer:
      "Payouts are typically processed within 24 hours of successful delivery confirmation. You can track your pending and settled balances in the Analytics tab.",
  },
  {
    question: "How do I optimize my products for better visibility?",
    answer:
      "Ensure your product titles are descriptive and include keywords. Use high-quality images with clean backgrounds, and provide detailed descriptions that answer potential buyer questions.",
  },
  {
    question: "What should I do if a customer requests a refund?",
    answer:
      "You can manage refunds directly through the Order Details page. We recommend communicating with the buyer first to understand the issue and potentially offer a replacement.",
  },
  {
    question: "Can I sell on EazyStore if I don't have a physical store?",
    answer:
      "Absolutely! EazyStore is designed for both physical shop owners and digital-only vendors. Just ensure your 'Contact & Location' settings reflect your preferred business address.",
  },
  {
    question: "How are platform fees calculated?",
    answer:
      "We charge a small 2% flat fee on every successful transaction. There are no monthly subscription costs or hidden listing fees—you only pay when you make a sale.",
  },
];

export function FAQSection() {
  return (
    <Card className="border-none  bg-card overflow-hidden">
      <CardHeader className="p-8 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-sm bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <HelpCircle className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black tracking-tight">
              Common Questions
            </CardTitle>
            <CardDescription className="font-medium">
              Everything you need to know about selling on EazyStore
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="border border-border/50 rounded-sm px-6 transition-all data-[state=open]:bg-muted/30 data-[state=open]:ring-1 data-[state=open]:ring-emerald-500/20"
            >
              <AccordionTrigger className="text-base font-bold hover:no-underline hover:text-emerald-500 transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-medium pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
