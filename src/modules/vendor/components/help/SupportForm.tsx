import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Headphones } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function SupportForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Support ticket created!", {
        description: "One of our agents will reach out within 2 hours.",
      });
    }, 1500);
  };

  return (
    <Card className="border-none  bg-card overflow-hidden h-full">
      <CardHeader className="p-8 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-sm bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Headphones className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black tracking-tight">
              Direct Support
            </CardTitle>
            <CardDescription className="font-medium">
              Can't find what you're looking for?
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                Full Name
              </label>
              <Input
                placeholder="John Doe"
                className="h-12 rounded-sm bg-muted/50 border-border/50 focus:bg-card transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                Work Email
              </label>
              <Input
                type="email"
                placeholder="john@storename.com"
                className="h-12 rounded-sm bg-muted/50 border-border/50 focus:bg-card transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Category
            </label>
            <select className="w-full h-12 rounded-sm bg-muted/50 border border-border/50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
              <option>Payment & Payouts</option>
              <option>Technical Issue</option>
              <option>Account Access</option>
              <option>Feature Request</option>
              <option>Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Message
            </label>
            <textarea
              placeholder="Describe your issue in detail..."
              rows={4}
              className="w-full rounded-sm bg-muted/50 border border-border/50 p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all resize-none"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-sm   font-black tracking-tight gap-2 text-base transition-transform active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-sm animate-spin" />
                Processing...
              </span>
            ) : (
              <>
                <Send className="w-5 h-5" /> Send Support Request
              </>
            )}
          </Button>

          <p className="text-center text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">
            Average response time: 2 hours
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
