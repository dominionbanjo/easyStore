import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Info, ArrowRight, AlertTriangle, ShieldAlert, Loader2 } from "lucide-react";

interface PaymentSecurityModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: "escrow" | "direct";
  isProcessing?: boolean;
}

export function PaymentSecurityModal({
  open,
  onClose,
  onConfirm,
  type,
  isProcessing,
}: PaymentSecurityModalProps) {
  const isEscrow = type === "escrow";

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      onClose={onClose}
      title={isEscrow ? "Secure with Escrow" : "Direct Payment Warning"}
      description={
        isEscrow
          ? "Protect your payment. Your funds are held securely and only released to the vendor after you confirm you've received your items."
          : "You are choosing to pay the vendor directly. Please note that direct payments are not protected by EasyStore's buyer protection policy."
      }
      footer={
        <div className="flex flex-col sm:flex-row gap-3 p-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 text-[10px] font-black uppercase tracking-widest h-11"
          >
            Go Back
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            variant={isEscrow ? "default" : "outline"}
            className={`flex-1 rounded-sm text-[10px] font-black uppercase tracking-widest px-6 h-11 ${
              !isEscrow ? "border-amber-500/50 text-amber-600 hover:bg-amber-50" : ""
            }`}
          >
            {isProcessing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                {isEscrow ? "I Understand, Proceed" : "Continue with Direct"}
                <ArrowRight className="ml-2 h-3 w-3" />
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 ${
            isEscrow ? "bg-primary/10" : "bg-amber-500/10"
          }`}>
            {isEscrow ? (
              <ShieldCheck className="h-6 w-6 text-primary" />
            ) : (
              <ShieldAlert className="h-6 w-6 text-amber-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-tight">
              {isEscrow ? "Buyer Protection Active" : "No Protection Policy"}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
              {isEscrow ? "Powered by EasyStore Escrow" : "Risk of Non-Delivery Applied"}
            </p>
          </div>
        </div>

        <div className="space-y-4 py-2">
          {isEscrow ? (
            <>
              <div className="p-4 rounded-sm bg-blue-500/5 border border-blue-500/10 flex gap-3">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">
                    How it works
                  </p>
                  <p className="text-xs text-blue-600/80 font-medium leading-relaxed">
                    1. You pay via Paystack.<br />
                    2. Vendor ships your order.<br />
                    3. You confirm delivery with a secure OTP.<br />
                    4. Only then is the vendor paid.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-sm bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  Escrow fee applies: 3% (capped at ₦3,000)
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-sm bg-amber-500/5 border border-amber-500/20 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-amber-700">
                    Important Risks
                  </p>
                  <p className="text-xs text-amber-700/80 font-medium leading-relaxed">
                    By paying directly, funds are transferred immediately to the vendor's account. If the vendor fails to ship your items or if they are not as described, EasyStore cannot refund your payment.
                  </p>
                </div>
              </div>
              
              <div className="p-4 rounded-sm bg-primary/5 border border-primary/10 flex gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-primary">
                    Why use Escrow?
                  </p>
                  <p className="text-xs text-primary/80 font-medium leading-relaxed">
                    Escrow is the safest way to shop. We hold your money in a secure account and only pay the vendor when you're happy with your delivery.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
