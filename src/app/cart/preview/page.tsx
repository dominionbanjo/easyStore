import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShieldCheck,
  Heart,
  Sparkles,
  Navigation,
  Loader2,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { useGetCartQuery } from "@/services/cartApi";
import { useGetUserProfileQuery } from "@/services/userApi";
import {
  useCreateOnlineOrderDirectMutation,
  useCreateOnlineOrderMutation,
  useGetCheckoutSummaryMutation,
} from "@/services/ordersApi";
import {
  useGetInstallmentConfigQuery,
  useCreateInstallmentOrderMutation,
  useCreateInstallmentPlanMutation,
} from "@/services/installmentsApi";
import type { InstallmentMode } from "@/types/installment/installmentTypes";
import type { ICheckoutSummaryVendor } from "@/services/ordersApi";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { AddressRequiredModal } from "@/modules/website/components/modals/AddressRequiredModal";
import { BankAccountModal } from "@/modules/website/components/modals/BankAccountModal";
import { SelectAddressModal } from "@/modules/website/components/modals/SelectAddressModal";
import { CheckoutSummary } from "@/modules/website/components/checkout/CheckoutSummary";
import { PaymentSecurityModal } from "@/modules/website/components/modals/PaymentSecurityModal";
import { 
  useStartConversationMutation, 
  useSendDirectMessageMutation 
} from "@/services/messagingApi";
import { extractErrorMessage } from "@/utils/errorHandler";

type RequiredModal = "address" | "select-address" | "bank" | "payment-security" | null;

// ⭐ Checkout groups are keyed by store (a vendor may own multiple stores).
const storeKey = (vendor: ICheckoutSummaryVendor) =>
  vendor.store_id ?? vendor.vendor_id;

/**
 * Preset ids the vendor offers for this store group = intersection of every
 * item's installment_presets (legacy items without the list impose no limit,
 * falling back to all platform presets).
 */
const offeredPresetIds = (
  vendor: ICheckoutSummaryVendor,
  config: { presets?: { id: string }[] } | undefined,
): string[] => {
  const subsets = vendor.items
    .map((item) => item.installment_presets ?? [])
    .filter((subset) => subset.length > 0);
  if (subsets.length === 0) {
    return (config?.presets ?? []).map((p) => p.id);
  }
  return subsets.reduce(
    (acc, cur) => acc.filter((id) => cur.includes(id)),
  );
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
  const cart = cartData?.data?.cart;

  const { data: userProfile, isLoading: isUserLoading } =
    useGetUserProfileQuery();
  const user = userProfile?.data?.user;

  const [requiredModal, setRequiredModal] = useState<RequiredModal>(null);
  const [pendingCheckoutVendor, setPendingCheckoutVendor] = useState<{
    vendor: ICheckoutSummaryVendor;
    isEscrow: boolean;
  } | null>(null);

  // APIs
  const [
    getSummary,
    {
      data: summaryResponse,
      isLoading: isSummaryLoading,
      isError: isSummaryError,
      error: summaryError,
    },
  ] = useGetCheckoutSummaryMutation();
  
  const [createEscrowOrder, { isLoading: isCreatingEscrowOrder }] =
    useCreateOnlineOrderMutation();
  const [createDirectOrder, { isLoading: isCreatingDirectOrder }] =
    useCreateOnlineOrderDirectMutation();
  const [createInstallmentOrder, { isLoading: isCreatingInstallmentOrder }] =
    useCreateInstallmentOrderMutation();
  const [createInstallmentPlan, { isLoading: isCreatingInstallmentPlan }] =
    useCreateInstallmentPlanMutation();

  const { data: installmentConfig } = useGetInstallmentConfigQuery();

  const [startConversation] = useStartConversationMutation();
  const [sendMessage] = useSendDirectMessageMutation();

  // State
  const [selectedRates, setSelectedRates] = useState<Record<string, string>>(
    {},
  );
  const [activeStoreKey, setActiveStoreKey] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [escrowByStore, setEscrowByStore] = useState<Record<string, boolean>>({});
  const [installmentActiveByStore, setInstallmentActiveByStore] = useState<
    Record<string, boolean>
  >({});
  const [presetByStore, setPresetByStore] = useState<Record<string, string>>(
    {},
  );
  const [installmentModeByStore, setInstallmentModeByStore] = useState<
    Record<string, InstallmentMode>
  >({});

  /* ───────── FETCH SUMMARY ───────── */
  useEffect(() => {
    if (cart && cart.items.length > 0) {
      const orderItems = cart.items.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id ?? undefined,
        quantity: item.quantity,
        size: item.size ?? undefined,
        color: item.color ?? undefined,
      }));
      getSummary({ order_items: orderItems }).catch(() => {
        // errors are handled via the isError effect below
      });
    }
  }, [cart, getSummary]);

  /* ───────── TOAST SUMMARY ERRORS ───────── */
  useEffect(() => {
    if (isSummaryError && summaryError) {
      toast.error(
        extractErrorMessage(summaryError, "Failed to load checkout summary."),
      );
    }
  }, [isSummaryError, summaryError]);

  const summaryData: ICheckoutSummaryVendor[] = useMemo(() => {
    // Standard NestJS response structure: { status, message, data: { success, data: [] } }
    const nestedData = (
      summaryResponse as
        | { data?: { data?: ICheckoutSummaryVendor[] } }
        | undefined
    )?.data?.data;
    const rawData = nestedData ?? summaryResponse?.data ?? [];
    return Array.isArray(rawData) ? rawData : [];
  }, [summaryResponse]);

  useEffect(() => {
    // Default open first accordion item if available
    if (summaryData.length > 0 && !activeStoreKey) {
      setActiveStoreKey(storeKey(summaryData[0]));
    }
  }, [summaryData, activeStoreKey]);

  /* ───────── MODAL SEQUENCING & REFETCHING ───────── */
  useEffect(() => {
    if (isUserLoading || !user) return;

    if (!user.address) {
      setRequiredModal("address");
    } else if (!user.payout_verified) {
      setRequiredModal("bank");
    } else {
      setRequiredModal((prev) => (prev ? null : prev));
    }
  }, [user, isUserLoading]);

  const handleModalClose = () => {
    setRequiredModal(null);
    setPendingCheckoutVendor(null);
  };

  /* ───────── CALCULATIONS ───────── */
  const hasAddress = Boolean(
    user?.address || (user?.addresses && user?.addresses.length > 0),
  );
  const isBankVerified = user?.payout_verified ?? false;

  const currentActiveAddress =
    user?.addresses?.find((a) => a.id === selectedAddressId) ||
    user?.addresses?.find((a) => a.is_default) ||
    user?.addresses?.[0] ||
    user?.address;

  const isCheckoutDisabled = !hasAddress || !isBankVerified;

  /* ───────── HANDLE CHECKOUT PER VENDOR ───────── */
  const handleCheckoutVendor = async (vendor: ICheckoutSummaryVendor, isEscrow: boolean) => {
    if (isCheckoutDisabled) {
      if (!hasAddress) setRequiredModal("address");
      else if (!isBankVerified) setRequiredModal("bank");
      return;
    }

    if (!user) return;

    // Show security modal for both online paths
    setPendingCheckoutVendor({ vendor, isEscrow });
    setRequiredModal("payment-security");
  };

  const executeInstallmentCheckout = async (vendor: ICheckoutSummaryVendor) => {
    if (isCheckoutDisabled) {
      if (!hasAddress) setRequiredModal("address");
      else if (!isBankVerified) setRequiredModal("bank");
      return;
    }
    if (!user) return;

    const vendorKey = storeKey(vendor);
    const allowedIds = offeredPresetIds(vendor, installmentConfig);
    const storedPreset = presetByStore[vendorKey];
    const presetId =
      storedPreset && allowedIds.includes(storedPreset)
        ? storedPreset
        : (allowedIds[0] ?? "");
    if (!presetId) {
      toast.error("Please choose an installment plan");
      setActiveStoreKey(vendorKey);
      return;
    }

    const selectedRateId = selectedRates[vendorKey];
    if (!selectedRateId && vendor.delivery_options.length > 0) {
      toast.error(`Please select a delivery region for ${vendor.store_name}`);
      setActiveStoreKey(vendorKey);
      return;
    }

    try {
      const orderItems = vendor.items.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id ?? undefined,
        quantity: item.quantity,
        size: item.size ?? undefined,
        color: item.color ?? undefined,
      }));

      /* 1. Create the pending order (no charge) */
      const orderResult = await createInstallmentOrder({
        email: user.email,
        order_items: orderItems,
        delivery_rate_id: selectedRateId || undefined,
        delivery_address_id: currentActiveAddress?.id,
      }).unwrap();

      if (!orderResult.success || !orderResult.order_id) {
        throw new Error("Failed to create installment order");
      }

      /* 2. Create the plan — charges the deposit, returns payment_url */
      const planResult = await createInstallmentPlan({
        order_id: orderResult.order_id,
        preset_id: presetId,
        mode: installmentModeByStore[vendorKey] ?? "manual",
      }).unwrap();

      if (planResult.success && planResult.payment_url) {
        window.location.href = planResult.payment_url;
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to start installment plan"));
    }
  };

  const executeCheckout = async (vendor: ICheckoutSummaryVendor, isEscrow: boolean) => {
    const vendorKey = storeKey(vendor);
    const selectedRateId = selectedRates[vendorKey];
    if (!selectedRateId && vendor.delivery_options.length > 0) {
      toast.error(`Please select a delivery region for ${vendor.store_name}`);
      setActiveStoreKey(vendorKey);
      return;
    }

    try {
      const orderItems = vendor.items.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id ?? undefined,
        quantity: item.quantity,
        size: item.size ?? undefined,
        color: item.color ?? undefined,
      }));

      const payload = {
        email: user!.email,
        order_items: orderItems,
        delivery_rate_id: selectedRateId || undefined,
        delivery_address_id: currentActiveAddress?.id,
      };

      const mutation = isEscrow ? createEscrowOrder : createDirectOrder;
      const result = await mutation(payload).unwrap();

      // Backend returns either { data: { success, payment_url } } or { success, payment_url }
      const data = "data" in result ? result.data : result;

      if (data.success && data.payment_url) {
        window.location.href = data.payment_url;
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to create order"));
    }
  };

  const handleMessageVendor = async (vendor_id: string, store_name: string) => {
    try {
      toast.loading(`Starting conversation with ${store_name}...`);
      const res = await startConversation({ recipient_id: vendor_id }).unwrap();
      const conversationId = res.data.id;
      
      await sendMessage({
        id: conversationId,
        content: `Hi, I'm trying to order from your store "${store_name}" but no delivery region is listed for my location. Can you help with delivery details?`,
      }).unwrap();
      
      toast.dismiss();
      toast.success("Message sent! Redirecting...");
      navigate(`/account/messages?id=${conversationId}`);
    } catch (err: unknown) {
      toast.dismiss();
      toast.error(extractErrorMessage(err, "Failed to start conversation"));
    }
  };

  if (isCartLoading || !cart) return null;

  const handleRateSelection = (storeKeyId: string, rateId: string) => {
    setSelectedRates((prev) => ({ ...prev, [storeKeyId]: rateId }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-32 sm:pb-40 transition-colors duration-500 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-sm pointer-events-none" />
      <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-sm pointer-events-none" />

      {/* ───────── MODALS ───────── */}
      <SelectAddressModal
        open={requiredModal === "select-address"}
        onClose={handleModalClose}
        selectedAddressId={selectedAddressId}
        onSelect={(addr) => setSelectedAddressId(addr.id)}
        onGoToCreate={() => setRequiredModal("address")}
      />

      <AddressRequiredModal
        open={requiredModal === "address"}
        onClose={handleModalClose}
        mode="create"
      />

      <BankAccountModal
        open={requiredModal === "bank"}
        onClose={handleModalClose}
        user={user}
      />

      <PaymentSecurityModal
        open={requiredModal === "payment-security"}
        onClose={handleModalClose}
        isProcessing={
          isCreatingEscrowOrder ||
          isCreatingDirectOrder ||
          isCreatingInstallmentOrder ||
          isCreatingInstallmentPlan
        }
        type={pendingCheckoutVendor?.isEscrow ? "escrow" : "direct"}
        onConfirm={() => {
          if (pendingCheckoutVendor) {
            executeCheckout(pendingCheckoutVendor.vendor, pendingCheckoutVendor.isEscrow);
          }
        }}
      />

      {/* ───────── PAGE CONTENT ───────── */}
      <div className="w-full mx-auto px-2 sm:px-6 pt-4 pb-12 sm:py-20 relative z-10">
        <div
          className="space-y-6 sm:space-y-16"
        >
          {/* Header Section */}
          <div className="flex px-3 items-center justify-between gap-4 sm:gap-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="group rounded-sm h-10 px-4 sm:px-5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-border/40 hover:bg-white dark:hover:bg-zinc-800 transition-all font-black text-[10px] tracking-widest uppercase"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Return <span className="hidden xs:inline">to Shopping</span>
            </Button>

            <div className="flex items-center gap-6 sm:gap-8">
               <div className="text-right">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
                   In Cart
                </p>
                <p className="text-xl sm:text-2xl font-black text-foreground">
                  {cart.items.length}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 sm:gap-12 items-start max-w-6xl mx-auto">
            {/* Left Column: Order Summary with Stepper/Accordion */}
            <div
              className="lg:sticky lg:top-12 mt-4 lg:mt-0 order-1 lg:order-1"
            >
              {isSummaryLoading ? (
                <div className="h-64 flex flex-col items-center justify-center border border-border/40 bg-muted/20 rounded-sm">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                  <p className="text-sm font-bold animate-pulse text-muted-foreground text-center">
                    Generating Vendor Split Checkout...
                  </p>
                </div>
              ) : summaryData.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center border border-border/40 bg-muted/20 text-center rounded-sm p-6">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground opacity-50 mb-4" />
                  <p className="text-sm font-bold text-muted-foreground">
                    Your basket is empty or invalid.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {summaryData.length > 1 && (
                    <div className="p-3.5 rounded-sm bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 text-blue-500 shrink-0" />
                        <div>
                          <p className="text-[11px] sm:text-xs font-bold text-blue-600 uppercase tracking-wide">
                            Multi-Vendor Split
                          </p>
                          <p className="text-[9px] sm:text-[10px] text-blue-600/80 font-medium leading-tight">
                            Your basket contains items from multiple sellers. We
                            process them sequentially. Please select your
                            delivery zone & pay for each seller individually to
                            secure stock.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Accordion
                    type="single"
                    collapsible
                    value={activeStoreKey || undefined}
                    onValueChange={(val) => val && setActiveStoreKey(val)}
                  >
                    {summaryData.map((vendor, index) => {
                      const vendorKey = storeKey(vendor);
                      const selectedRateId = selectedRates[vendorKey];
                      const selectedRate = vendor.delivery_options.find(
                        (r) => r.id === selectedRateId,
                      );

                      const rawSubtotal = vendor.subtotal;

                      let shippingFee = 0;
                      if (selectedRate) {
                        shippingFee = Number(selectedRate.fee) * 100;
                      }

                      const platformFee = Math.min(
                        Math.round(rawSubtotal * 0.01),
                        200000,
                      );

                      const vendorEscrow = escrowByStore[vendorKey] ?? false;

                      let escrowFee = 0;
                      if (vendorEscrow) {
                        escrowFee = Math.min(
                          Math.round((rawSubtotal + shippingFee) * 0.03),
                          300000,
                        );
                      }

                      const totalServiceCharge = vendorEscrow ? escrowFee : platformFee;
                      const grandTotal = rawSubtotal + shippingFee + totalServiceCharge;

                      const setVendorEscrow = (val: boolean) => {
                        setEscrowByStore((prev) => ({ ...prev, [vendorKey]: val }));
                      };

                      const allItemsInstallmentEnabled =
                        vendor.items.length > 0 &&
                        vendor.items.every(
                          (item) => item.installment_enabled === true,
                        );
                      const offeredIds = offeredPresetIds(
                        vendor,
                        installmentConfig,
                      );
                      const offeredPresets = (
                        installmentConfig?.presets ?? []
                      ).filter((p) => offeredIds.includes(p.id));
                      const installmentsEnabled =
                        (vendor.installments_enabled ?? false) &&
                        allItemsInstallmentEnabled &&
                        offeredIds.length > 0 &&
                        grandTotal >= (installmentConfig?.min_order_kobo ?? Infinity);
                      const installmentActive =
                        installmentActiveByStore[vendorKey] ?? false;
                      const storedPreset = presetByStore[vendorKey];
                      const vendorPreset =
                        storedPreset && offeredIds.includes(storedPreset)
                          ? storedPreset
                          : (offeredIds[0] ?? "");
                      const vendorInstallmentMode =
                        installmentModeByStore[vendorKey] ?? "manual";

                      const setVendorInstallmentActive = (val: boolean) => {
                        setInstallmentActiveByStore((prev) => ({
                          ...prev,
                          [vendorKey]: val,
                        }));
                        if (val) {
                          setEscrowByStore((prev) => ({ ...prev, [vendorKey]: false }));
                        }
                      };

                      return (
                        <AccordionItem
                          key={vendorKey}
                          value={vendorKey}
                          className="border-none mb-4"
                        >
                          <AccordionTrigger
                            className={`px-4 py-3 rounded-sm border hover:bg-muted/30 transition-colors [&[data-state=open]]:rounded-b-none ${
                              activeStoreKey === vendorKey
                                ? "bg-muted/50 border-primary/20"
                                : "bg-card border-border/40"
                            }`}
                          >
                            <div className="flex items-center gap-3 text-left">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-black shrink-0">
                                {index + 1}
                              </div>
                              <div>
                                <span className="block text-sm font-black uppercase tracking-tight text-foreground">
                                  {vendor.store_name}
                                </span>
                                <span className="block text-[10px] text-muted-foreground font-medium">
                                  {vendor.items.length} Items • ₦
                                  {(grandTotal / 100).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-0 border border-t-0 border-border/40 rounded-b-sm bg-card">
                            <CheckoutSummary
                              storeName={vendor.store_name}
                              items={vendor.items}
                              subtotal={rawSubtotal / 100}
                              shipping={shippingFee / 100}
                              serviceCharge={totalServiceCharge / 100}
                              total={grandTotal / 100}
                              isProcessing={
                                (isCreatingEscrowOrder ||
                                  isCreatingDirectOrder ||
                                  isCreatingInstallmentOrder ||
                                  isCreatingInstallmentPlan) &&
                                activeStoreKey === vendorKey
                              }
                              disabled={!hasAddress || !isBankVerified}
                              missingAddress={!hasAddress}
                              missingBankVerification={!isBankVerified}
                              currentAddress={currentActiveAddress}
                              deliveryOptions={vendor.delivery_options}
                              selectedDeliveryRateId={selectedRateId}
                              onSelectDeliveryRate={(rateId: string) =>
                                handleRateSelection(vendorKey, rateId)
                              }
                              isEscrow={vendorEscrow}
                              setIsEscrow={setVendorEscrow}
                              escrowEnabled={vendor.escrow_enabled}
                              onCheckout={(isEscrow) => handleCheckoutVendor(vendor, isEscrow)}
                              onMessageVendor={() => handleMessageVendor(vendor.vendor_id, vendor.store_name)}
                              onAddAddress={() =>
                                setRequiredModal(
                                  hasAddress &&
                                    (user?.addresses?.length ?? 0) > 0
                                    ? "select-address"
                                    : "address",
                                )
                              }
                              onVerifyBank={() => setRequiredModal("bank")}
                              installmentsEnabled={installmentsEnabled}
                              installmentActive={installmentActive}
                              onSetInstallmentActive={setVendorInstallmentActive}
                              presets={offeredPresets}
                              selectedPreset={vendorPreset}
                              onSelectPreset={(presetId) =>
                                setPresetByStore((prev) => ({
                                  ...prev,
                                  [vendorKey]: presetId,
                                }))
                              }
                              installmentMode={vendorInstallmentMode}
                              onSetInstallmentMode={(mode) =>
                                setInstallmentModeByStore((prev) => ({
                                  ...prev,
                                  [vendorKey]: mode,
                                }))
                              }
                              onInstallmentCheckout={() => {
                                executeInstallmentCheckout(vendor);
                              }}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              )}
            </div>

            {/* Right Column: Information */}
            <div className="space-y-8 sm:space-y-10 order-2 lg:order-2">
              <div
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
              </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}
