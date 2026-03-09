import { Truck, ShieldCheck } from "lucide-react";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";

interface TitanLogisticsProps {
  uiProduct: UIProduct;
}

export function TitanLogistics({ uiProduct }: TitanLogisticsProps) {
  return (
    <div className="border border-zinc-800 bg-black p-4 text-xs space-y-4">
      <div className="text-[var(--theme-primary)] mb-2 uppercase tracking-widest border-b border-zinc-800 pb-2">
        Logistics Module
      </div>
      <div className="grid grid-cols-[20px_1fr] gap-3">
        <Truck className="w-4 h-4 text-zinc-500" />
        <div>
          <span className="text-white mb-1 block uppercase">
            Dispatch Details
          </span>
          <span className="text-zinc-500">
            {uiProduct.shipping.shippingCost} from {uiProduct.shipping.location}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-[20px_1fr] gap-3">
        <ShieldCheck className="w-4 h-4 text-zinc-500" />
        <div>
          <span className="text-white mb-1 block uppercase">
            Security Integrity
          </span>
          <span className="text-zinc-500">Transaction encrypted.</span>
        </div>
      </div>
    </div>
  );
}
