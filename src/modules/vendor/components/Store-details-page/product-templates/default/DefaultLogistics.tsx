import { ShieldCheck, Truck, RotateCcw } from "lucide-react";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";

interface DefaultLogisticsProps {
  uiProduct: UIProduct;
}

export function DefaultLogistics({ uiProduct }: DefaultLogisticsProps) {
  return (
    <div className="mt-10 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
      <div className="flex items-center gap-4 text-zinc-700 dark:text-zinc-300">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm shrink-0">
          <ShieldCheck className="w-5 h-5 text-[var(--theme-primary)]" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
            Secure Checkout Guarantee
          </h4>
          <p className="text-xs mt-0.5">
            Your payment information is encrypted and secure.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-zinc-700 dark:text-zinc-300">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm shrink-0">
          <Truck className="w-5 h-5 text-[var(--theme-primary)]" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
            Reliable Dispatch
          </h4>
          <p className="text-xs mt-0.5">
            Ships promptly from {uiProduct.shipping.location}.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-zinc-700 dark:text-zinc-300">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm shrink-0">
          <RotateCcw className="w-5 h-5 text-[var(--theme-primary)]" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
            Hassle-Free Returns
          </h4>
          <p className="text-xs mt-0.5">
            {uiProduct.shipping.returns ||
              "Easy 30-day return policy on eligible orders."}
          </p>
        </div>
      </div>
    </div>
  );
}
