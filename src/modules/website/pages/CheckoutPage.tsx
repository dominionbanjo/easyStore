import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShieldCheck,
  Heart,
  Sparkles,
  Navigation,
} from "lucide-react";
import { useGetCartQuery } from "@/services/cartApi";
import { useGetUserProfileQuery } from "@/services/userApi";
import { useCreateOnlineOrderDirectMutation } from "@/services/ordersApi";
import { toast } from "sonner";

import { AddressRequiredModal } from "../components/modals/AddressRequiredModal";
import { BankAccountModal } from "../components/modals/BankAccountModal";
import { DeliveryInfo } from "../components/checkout/DeliveryInfo";
import { CheckoutSummary } from "../components/checkout/CheckoutSummary";
import { motion } from "framer-motion";

type RequiredModal = "address" | "bank" | null;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
  const cart = cartData?.data.cart;

  // Use single source of truth from API
  const { data: userProfile, isLoading: isUserLoading } =
    useGetUserProfileQuery();
  const user = userProfile?.data?.user;

  const [requiredModal, setRequiredModal] = useState<RequiredModal>(null);
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOnlineOrderDirectMutation();

  /* ───────── MODAL SEQUENCING & REFETCHING ───────── */
  useEffect(() => {
    // Wait for initial load
    if (isUserLoading || !user) return;

    // Strict validation sequence
    if (!user.address) {
      setRequiredModal("address");
    } else if (!user.payout_verified) {
      setRequiredModal("bank");
    } else {
      setRequiredModal((prev) => (prev ? null : prev));
    }
  }, [user, isUserLoading]);

  const handleModalClose = () => {
    // When a modal closes, we temporarily clear the state.
    // The useEffect above will re-evaluate the user data (which should be refreshing/refreshed)
    // and re-open the correct modal if requirements are still strict.
    setRequiredModal(null);
  };

  /* ───────── CALCULATIONS ───────── */
  const hasAddress = Boolean(user?.address);
  const isBankVerified = user?.payout_verified ?? false;

  const fullName =
    user?.first_name || user?.last_name
      ? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
      : "No name provided";
  const phone = user?.phone_number ?? "No phone provided";
  const street = user?.address?.street ?? "";
  const state = user?.address?.state ?? "";
  const postalCode = user?.address?.postal_code ?? "";
  const city = user?.address?.city ?? "";

  const isCheckoutDisabled = !hasAddress || !isBankVerified;

  /* ───────── HANDLE CHECKOUT ───────── */
  const handleCheckout = async () => {
    if (isCheckoutDisabled) {
      // Re-trigger checks
      if (!hasAddress) setRequiredModal("address");
      else if (!isBankVerified) setRequiredModal("bank");
      return;
    }

    if (!cart || !user) return;

    try {
      const orderItems = cart.items.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id ?? undefined,
        quantity: item.quantity,
        size: item.size ?? undefined,
        color: item.color ?? undefined,
      }));

      const result = await createOrder({
        email: user.email,
        order_items: orderItems,
      }).unwrap();

      const data = result.data || result;

      if (data.success && data.payment_url) {
        window.location.href = data.payment_url;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create order");
    }
  };

  if (isCartLoading || !cart) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-20 sm:pb-32 transition-colors duration-500 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-sm pointer-events-none" />
      <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-sm pointer-events-none" />

      {/* ───────── MODALS ───────── */}
      <AddressRequiredModal
        open={requiredModal === "address"}
        onClose={handleModalClose}
        mode={user?.address ? "edit" : "create"}
      />

      <BankAccountModal
        open={requiredModal === "bank"}
        onClose={handleModalClose}
      />

      {/* ───────── PAGE CONTENT ───────── */}
      <div className="w-full mx-auto px-2 sm:px-6 py-8 sm:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10 sm:space-y-16"
        >
          {/* Header Section */}
          <div className="flex px-3 flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
            <div className="space-y-6">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="group rounded-sm h-10 px-5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-border/40 hover:bg-white dark:hover:bg-zinc-800 transition-all font-black text-[10px] tracking-widest uppercase"
              >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Return to Shopping
              </Button>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-10 bg-primary rounded-sm" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    Final Stage
                  </p>
                </div>
                <h1 className="text-4xl sm:text-7xl font-black tracking-tighter text-foreground leading-[1] sm:leading-[0.9]">
                  Checkout <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                    Succession
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex lg:flex items-center gap-6 sm:gap-8 pb-2">
              <div className="text-left md:text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Items In Cart
                </p>
                <p className="text-xl sm:text-2xl font-black text-foreground">
                  {cart.items.length}
                </p>
              </div>
              <div className="h-10 w-px bg-border/40" />
              <div className="text-left md:text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Basket Value
                </p>
                <p className="text-xl sm:text-2xl font-black text-primary">
                  ₦{(cart?.total ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4 sm:gap-12 items-start">
            {/* Left Column: Information */}
            <div className="space-y-8 sm:space-y-10">
              {/* Delivery Info Component with entrance animation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <DeliveryInfo
                  fullName={fullName}
                  phone={phone}
                  street={street}
                  state={state}
                  postalCode={postalCode}
                  city={city}
                  hasAddress={hasAddress}
                  onEditAddress={() => setRequiredModal("address")}
                />
              </motion.div>

              {/* Note about direct payment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 sm:p-8 rounded-sm sm:rounded-sm bg-background border border-border/40  overflow-hidden relative group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                  <ShieldCheck className="h-32 w-32 rotate-12" />
                </div>
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-sm sm:rounded-sm flex items-center justify-center shrink-0 ">
                    <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-foreground">
                      Security First Checkout
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">
                      We prioritize your security. Currently, we utilize{" "}
                      <span className="text-primary font-bold">Paystack's</span>{" "}
                      industry-leading encrypted tunnel for all transactions.
                      Direct escrow and crypto integrations are undergoing audit
                      and will be active shortly.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="h-1.5 w-1.5 rounded-sm bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                        Encrypted Tunnel Active
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Footer Trust Segment */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                <div className="flex items-center gap-2">
                  <Heart className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Global Shipping
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Premium Quality
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Real-time Tracking
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary with scroll follow */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:sticky lg:top-12 mt-4 lg:mt-0"
            >
              <CheckoutSummary
                items={cart.items}
                subtotal={cart?.subtotal ?? 0}
                shipping={cart?.shipping ?? 0}
                serviceCharge={cart?.platform_fee ?? 0}
                total={cart?.total ?? 0}
                isProcessing={isCreatingOrder}
                disabled={!hasAddress || !isBankVerified}
                missingAddress={!hasAddress}
                missingBankVerification={!isBankVerified}
                onCheckout={handleCheckout}
                onAddAddress={() => setRequiredModal("address")}
                onVerifyBank={() => setRequiredModal("bank")}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
