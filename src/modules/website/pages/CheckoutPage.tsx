import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  ShieldCheck,
  CreditCard,
  Truck,
  Info,
  ArrowLeft,
  MapPin,
  Landmark,
} from "lucide-react";

import { useGetCartQuery } from "@/services/cartApi";
import type { RootState } from "@/store";

import { AddressRequiredModal } from "../components/modals/AddressRequiredModal";
import { BankAccountModal } from "../components/modals/BankAccountModal";
import PaymentOption from "../components/PaymentOption";

type OrderType = "escrow" | "online" | "offline";
type RequiredModal = "address" | "bank" | null;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCartQuery();
  const cart = data?.data.cart;

  const user = useSelector((state: RootState) => state.user.currentUser);

  const [orderType, setOrderType] = useState<OrderType>("escrow");
  const [requiredModal, setRequiredModal] = useState<RequiredModal>(null);

  /* ───────── MODAL SEQUENCING LOGIC ───────── */
  useEffect(() => {
    if (!user) return;

    if (!user.address) {
      setRequiredModal("address");
      return;
    }

    if (!user.payout_verified) {
      setRequiredModal("bank");
      return;
    }

    setRequiredModal(null);
  }, [user]);

  if (isLoading || !cart) return null;

  const hasAddress = Boolean(user?.address);
  const hasBank = Boolean(user?.payout_verified);

  const fullName =
    user?.first_name || user?.last_name
      ? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
      : "";

  const phone = user?.phone_number ?? "";
  const city = user?.address?.city ?? "";
  const address = user?.address
    ? `${user.address.street}, ${user.address.state}, ${user.address.postal_code}`
    : "";

  return (
    <>
      {/* ───────── REQUIRED MODALS ───────── */}

      <AddressRequiredModal
        open={requiredModal === "address"}
        onClose={() => setRequiredModal(null)}
        user={user}
        mode={user?.address ? "edit" : "create"}
      />

      <BankAccountModal
        open={requiredModal === "bank"}
        onClose={() => setRequiredModal(null)}
      />

      {/* ───────── PAGE ───────── */}

      <section className="min-h-screen px-1 sm:px-4 lg:px-8 py-3">
        <Card className="w-full max-w-5xl mx-auto rounded-xl shadow-sm">
          {/* HEADER */}
          <CardHeader className="flex items-center gap-2 px-3 py-3 sm:px-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <CardTitle className="text-lg sm:text-2xl font-semibold">
              Checkout
            </CardTitle>
          </CardHeader>

          <CardContent className="px-3 sm:px-6 pb-4">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 lg:gap-8">
              {/* LEFT */}
              <div className="space-y-4">
                {/* DELIVERY */}
                <Card className="border rounded-lg">
                  <CardHeader className="px-4 py-3 flex justify-between items-center">
                    <CardTitle className="text-sm font-semibold">
                      Delivery Information
                    </CardTitle>

                    {hasAddress && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRequiredModal("address")}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Edit Address
                      </Button>
                    )}

                    {!hasAddress && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRequiredModal("address")}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Add Address
                      </Button>
                    )}
                  </CardHeader>

                  <CardContent className="px-4 pb-4 grid gap-3">
                    <Input value={fullName} disabled />
                    <Input value={phone} disabled />
                    <Input value={city} disabled />
                    <Input value={address} disabled />
                  </CardContent>
                </Card>

                {/* PAYMENT */}
                <Card className="border-2 border-primary/20 rounded-lg">
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      Payment Method
                      <Badge className="bg-primary text-white text-xs">
                        Recommended
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-4 pb-4 space-y-3">
                    <PaymentOption
                      active={orderType === "escrow"}
                      onClick={() => setOrderType("escrow")}
                      icon={<ShieldCheck className="h-5 w-5 text-primary" />}
                      title="Online Payment (Escrow)"
                      badge="Paystack"
                      description={`Pay ₦${cart.total.toLocaleString()} securely. Funds released after delivery.`}
                      points={[
                        "Buyer & seller protection",
                        "Refund if order fails",
                        "Escrow tracking",
                      ]}
                    />

                    <PaymentOption
                      active={orderType === "online"}
                      onClick={() => setOrderType("online")}
                      icon={<CreditCard className="h-5 w-5 text-gray-700" />}
                      title="Online Payment (No Escrow)"
                      description="Direct Paystack payment without escrow."
                    />

                    <PaymentOption
                      active={orderType === "offline"}
                      onClick={() => setOrderType("offline")}
                      icon={<Truck className="h-5 w-5 text-gray-600" />}
                      title="Pay on Delivery"
                      description="Pay when item arrives. Limited protection."
                    />
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT */}
              <Card className="border rounded-lg h-fit">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm font-semibold">
                    Order Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-4 pb-4 space-y-3 text-sm">
                  {cart.items.map((item) => (
                    <div key={item.product_id} className="flex justify-between">
                      <span className="truncate">
                        {item.name} × {item.quantity}
                      </span>
                      <span>
                        ₦
                        {(
                          (item.discount_price ?? item.price) * item.quantity
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₦{cart.total.toLocaleString()}</span>
                  </div>
                </CardContent>

                <CardFooter className="px-4 pb-4 flex flex-col gap-2">
                  <Button
                    className="w-full rounded-full bg-primary text-white"
                    disabled={!hasAddress || !hasBank}
                  >
                    {orderType === "offline"
                      ? "Place Order"
                      : "Pay with Paystack"}
                  </Button>

                  {!hasBank && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRequiredModal("bank")}
                    >
                      <Landmark className="h-4 w-4 mr-1" />
                      Add bank account to continue
                    </Button>
                  )}

                  <p className="text-[11px] text-gray-500 flex gap-1">
                    <Info className="h-3 w-3 mt-0.5" />
                    Escrow provides the highest protection.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
