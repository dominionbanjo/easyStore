import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowRight, Package } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  onClear: () => void;
  onPreview: () => void;
  onContinueShopping: () => void;
}

export function CartSummary({
  subtotal,
  shipping,
  total,
  onClear,
  onPreview,
  onContinueShopping,
}: CartSummaryProps) {
  return (
    <Card className="h-fit rounded-2xl sm:rounded-3xl border shadow-lg bg-white border-zinc-100 dark:bg-zinc-900 dark:border-white/5">
      <CardHeader className="px-5 py-4 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-black tracking-tight text-foreground">
          Order Summary
        </CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 px-3 text-xs font-bold uppercase tracking-wider"
            >
              Clear Cart
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-3xl border-zinc-100 dark:border-zinc-800">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Shopping Cart?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove all items from your cart. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full font-bold">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onClear}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6 font-bold"
              >
                Clear Everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent className="px-5 py-4 space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>₦{shipping.toLocaleString()}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 my-2" />

        <div className="flex justify-between items-end">
          <span className="text-base font-bold text-muted-foreground">
            Total
          </span>
          <span className="text-2xl font-black text-foreground tracking-tight">
            ₦{total.toLocaleString()}
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 flex flex-col gap-3">
        <Button
          className="w-full rounded-2xl h-12 text-base font-bold shadow-lg shadow-primary/20"
          onClick={onPreview}
        >
          Preview Orders
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="w-full rounded-2xl h-12 text-base font-bold border-zinc-200 dark:border-white/10"
          onClick={onContinueShopping}
        >
          <Package className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
      </CardFooter>
    </Card>
  );
}
