import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Info, CreditCard, Loader2 } from "lucide-react";
import type { ICartItem } from "@/types/cart/cartTypes";

interface CheckoutSummaryProps {
  items: ICartItem[];
  total: number;
  isProcessing: boolean;
  disabled: boolean;
  onCheckout: () => void;
}

export function CheckoutSummary({
  items,
  total,
  isProcessing,
  disabled,
  onCheckout,
}: CheckoutSummaryProps) {
  return (
    <Card className="h-fit rounded-2xl sm:rounded-3xl border sm:border shadow-lg bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800">
      <CardHeader className="px-5 py-4 border-b border-zinc-50 dark:border-zinc-800">
        <CardTitle className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 py-6">
        <div className="space-y-4">
          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {items.map((item) => (
              <div key={item.product_id} className="flex gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                  <img
                    src={item.image ?? "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                    Qty: {item.quantity}{" "}
                    {item.size ? `• Size: ${item.size}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-foreground">
                    ₦
                    {(
                      (item.discount_price ?? item.price) * item.quantity
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="bg-zinc-100 dark:bg-zinc-800" />

          <div className="flex justify-between items-end pt-2">
            <span className="text-base font-bold text-muted-foreground">
              Total Order
            </span>
            <span className="text-2xl font-black text-foreground tracking-tight">
              ₦{total.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-6 flex flex-col gap-4">
        <Button
          className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
          disabled={disabled || isProcessing}
          onClick={onCheckout}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay with Paystack
              <CreditCard className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <div className="flex items-start gap-2 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
          <Info className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
            By clicking "Pay with Paystack", you agree to our terms of service.
            Secure payment powered by Paystack.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
