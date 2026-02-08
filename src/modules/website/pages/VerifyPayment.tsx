import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { useVerifyPaymentMutation } from "@/services/ordersApi";
import { ACCOUNT_ROUTES } from "@/routes";

export default function VerifyPaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const reference = searchParams.get("reference");

  const [verifyPayment, { data, isLoading, isError, error, reset }] =
    useVerifyPaymentMutation();

  /* ───────────────── AUTO VERIFY ───────────────── */
  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    }

    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  /* ───────────────── NO REFERENCE ───────────────── */
  if (!reference) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-red-600">
              <XCircle className="h-6 w-6" />
              Missing Reference
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We couldn’t find a payment reference in the URL.
            </p>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/products")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Store
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  /* ───────────────── LOADING ───────────────── */
  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <h2 className="text-lg font-semibold">Verifying your payment</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we confirm your transaction.
            </p>

            <p className="text-xs font-mono text-muted-foreground">
              Ref: {reference}
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  /* ───────────────── ERROR ───────────────── */
  if (isError) {
    // Extract error message from RTK Query error
    const errorMessage =
      (error as any)?.data?.message ||
      (error as any)?.message ||
      "We couldn't verify this payment right now.";

    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-red-600">
              <XCircle className="h-6 w-6" />
              Verification Failed
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{errorMessage}</p>

            <div className="rounded-md bg-muted p-3 text-xs font-mono">
              Reference: {reference}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={() => verifyPayment(reference)}
              >
                Retry Verification
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/products")}
              >
                Back to Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Check if payment was successful by looking at the orders
  // Show success if at least one order has been confirmed (webhook may process asynchronously)
  const orders = data?.data?.orders;
  const isSuccess =
    orders &&
    orders.length > 0 &&
    orders.some((order: any) => order.payment_status === "success");

  /* ───────────────── SUCCESS ───────────────── */
  if (isSuccess) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12 space-y-4">
            <CheckCircle className="h-14 w-14 text-green-600 mx-auto" />

            <h1 className="text-2xl font-bold text-green-600">
              Payment Successful
            </h1>

            <p className="text-sm text-muted-foreground">
              Your payment has been verified successfully. Your order is now
              being processed.
            </p>

            <div className="rounded-md bg-muted p-3 text-xs font-mono">
              Reference: {reference}
            </div>

            <Button
              className="w-full"
              onClick={() => navigate(ACCOUNT_ROUTES.ORDERS)}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              View My Orders
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  /* ───────────────── PENDING / OTHER ───────────────── */
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-yellow-600">
            <Clock className="h-6 w-6" />
            Payment Pending
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We haven’t confirmed this payment yet. Please try again shortly.
          </p>

          <div className="rounded-md bg-muted p-3 text-xs font-mono">
            Reference: {reference}
          </div>

          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => verifyPayment(reference)}>
              Retry Verification
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(ACCOUNT_ROUTES.ORDERS)}
            >
              Go to Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
