import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Loader2,
  ShieldCheck,
  Tag,
  ShoppingBag,
} from "lucide-react";
import type { ICartItem } from "@/types/cart/cartTypes";
import { motion } from "framer-motion";

interface CheckoutSummaryProps {
  items: ICartItem[];
  subtotal: number;
  shipping: number;
  platformFee: number;
  total: number;
  isProcessing: boolean;
  disabled: boolean; // Retain this for generic disabled state if needed, or derive it
  missingAddress?: boolean;
  missingBankVerification?: boolean;
  onCheckout: () => void;
  onAddAddress: () => void;
  onVerifyBank: () => void;
}

export function CheckoutSummary({
  items,
  subtotal,
  shipping,
  platformFee,
  total,
  isProcessing,
  disabled,
  missingAddress,
  missingBankVerification,
  onCheckout,
  onAddAddress,
  onVerifyBank,
}: CheckoutSummaryProps) {
  const isBlocked = missingAddress || missingBankVerification;

  return (
    <Card className="h-fit rounded-[2.5rem] border-border/40 shadow-2xl shadow-black/5 bg-background border overflow-hidden">
      <CardHeader className="p-8 border-b border-border/40 bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Order Basket
          </CardTitle>
          <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {items.reduce((acc, item) => acc + item.quantity, 0)} Items
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Scrollable Items list */}
          <div className="max-h-[320px] overflow-y-auto pr-3 space-y-6 custom-scrollbar">
            {items.map((item, idx) => (
              <motion.div
                key={`${item.product_id}-${item.size}-${item.color}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-5 group"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted border border-border/40 shrink-0 relative">
                  <img
                    src={item.image ?? "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-bl-xl">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.size && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border border-border/40 px-1.5 py-0.5 rounded-md">
                        Size {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border border-border/40 px-1.5 py-0.5 rounded-md">
                        {item.color}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right py-1">
                  <p className="text-sm font-black text-foreground">
                    ₦
                    {(
                      (item.discount_price ?? item.price) * item.quantity
                    ).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-border/40">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-muted-foreground">
                Original Basket Value
              </span>
              <span className="text-foreground font-black">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium text-emerald-600">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Logistics Fee</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Standard
                </span>
              </div>
              <span className="font-black">₦{shipping.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Service Charge</span>
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                  <Tag className="h-3 w-3" />
                  <span className="text-[10px] font-black">2%</span>
                </div>
              </div>
              <span className="text-foreground font-black">
                ₦{platformFee.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="relative pt-6">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-1">
                  Grand Total
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  VAT & Taxes included
                </p>
              </div>
              <span className="text-4xl font-black text-foreground tracking-tighter">
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-8 pt-0 flex flex-col gap-6">
        {/* Missing Requirements Warnings */}
        {isBlocked && (
          <div className="w-full space-y-3">
            {missingAddress && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                      Address Required
                    </p>
                    <p className="text-[10px] text-amber-600/80 font-medium max-w-[200px] leading-tight">
                      We need your delivery details to proceed.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onAddAddress}
                  className="h-8 text-[10px] font-black uppercase tracking-widest border-amber-500/30 text-amber-700 hover:bg-amber-500/10 hover:text-amber-800 shrink-0 w-full sm:w-auto"
                >
                  Add Address
                </Button>
              </div>
            )}

            {missingBankVerification && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                      Verification Needed
                    </p>
                    <p className="text-[10px] text-blue-600/80 font-medium max-w-[200px] leading-tight">
                      Compliance requires a verified vendor account.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onVerifyBank}
                  className="h-8 text-[10px] font-black uppercase tracking-widest border-blue-500/30 text-blue-700 hover:bg-blue-500/10 hover:text-blue-800 shrink-0 w-full sm:w-auto"
                >
                  Verify Now
                </Button>
              </div>
            )}
          </div>
        )}

        <Button
          className="w-full h-16 rounded-[1.25rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90 text-primary-foreground group disabled:opacity-50 disabled:pointer-events-none"
          disabled={disabled || isProcessing || isBlocked} // Block if requirements missing
          onClick={onCheckout}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Syncing Transaction...
            </>
          ) : (
            <>
              Initialize Payment
              <CreditCard className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-6 p-4 rounded-2xl bg-muted/50 border border-border/20">
          <div className="flex flex-col items-center gap-1 opacity-60">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
              Secure SSL
            </span>
          </div>
          <Separator orientation="vertical" className="h-8 opacity-40" />
          <div className="flex flex-col items-center gap-1">
            <img
              src="/logos/paystacklogo.jpg"
              alt="Paystack"
              className="h-4 grayscale hover:grayscale-0 transition-all cursor-help"
            />
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
              Processor
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
