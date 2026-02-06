import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useGetCartQuery } from "@/services/cartApi";
import { useGetUserProfileQuery } from "@/services/userApi";
import { useCreateOnlineOrderDirectMutation } from "@/services/ordersApi";
import type { RootState } from "@/store";
import { toast } from "sonner";
import { AddressRequiredModal } from "../components/modals/AddressRequiredModal";
import { BankAccountModal } from "../components/modals/BankAccountModal";
import { DeliveryInfo } from "../components/checkout/DeliveryInfo";
import { CheckoutSummary } from "../components/checkout/CheckoutSummary";

type RequiredModal = "address" | "bank" | null;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
  const cart = cartData?.data.cart;

  // Refetch user profile to get updated address or status
  const { refetch: refetchUser } = useGetUserProfileQuery();
  const user = useSelector((state: RootState) => state.user.currentUser);

  const [requiredModal, setRequiredModal] = useState<RequiredModal>(null);
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOnlineOrderDirectMutation();

  /* ───────── MODAL SEQUENCING & REFETCHING ───────── */
  useEffect(() => {
    if (!user) return;

    // Check for missing data
    if (!user.address) {
      setRequiredModal("address");
    } else {
      setRequiredModal(null);
    }
  }, [user]);

  const handleModalClose = () => {
    setRequiredModal(null);
    refetchUser(); // Crucial: Refetch data when user updates details
  };

  /* ───────── CALCULATIONS ───────── */
  const hasAddress = Boolean(user?.address);
  const fullName =
    user?.first_name || user?.last_name
      ? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
      : "No name provided";
  const phone = user?.phone_number ?? "No phone provided";
  const street = user?.address?.street ?? "";
  const state = user?.address?.state ?? "";
  const postalCode = user?.address?.postal_code ?? "";
  const city = user?.address?.city ?? "";

  /* ───────── HANDLE CHECKOUT ───────── */
  const handleCheckout = async () => {
    if (!hasAddress) {
      toast.error("Please add your delivery address");
      setRequiredModal("address");
      return;
    }

    if (!cart || !user) return;

    try {
      const orderItems = cart.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
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
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-20">
      {/* ───────── MODALS ───────── */}
      <AddressRequiredModal
        open={requiredModal === "address"}
        onClose={handleModalClose}
        user={user}
        mode={user?.address ? "edit" : "create"}
      />

      <BankAccountModal
        open={requiredModal === "bank"}
        onClose={handleModalClose}
      />

      {/* ───────── PAGE CONTENT ───────── */}
      <div className="max-w-7xl mx-auto px-0 sm:px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Header Section */}
        <div className="px-4 sm:px-0 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-xl h-10 w-10 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              Checkout
              <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 font-medium">
              Complete your order with secure payment
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8 items-start">
          {/* Left Column: Information */}
          <div className="space-y-6 px-1 sm:px-0">
            {/* Delivery Info Component */}
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

            {/* Note about direct payment */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                <p className="font-black text-primary">!</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-primary">
                  Direct Secure Payment
                </p>
                <p className="text-xs text-primary/70 font-medium leading-relaxed">
                  We currently support direct online payments through Paystack.
                  Escrow and other payment methods are coming soon.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="sticky top-24 px-1 sm:px-0">
            <CheckoutSummary
              items={cart.items}
              subtotal={cart.subtotal}
              shipping={cart.shipping}
              platformFee={cart.platform_fee}
              total={cart.total}
              isProcessing={isCreatingOrder}
              disabled={!hasAddress}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
