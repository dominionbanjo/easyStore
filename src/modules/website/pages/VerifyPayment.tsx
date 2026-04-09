import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

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
import SmartLink from "@/components/shared/SmartLink";

export default function VerifyPaymentPage() {
  const [searchParams] = useSearchParams();

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

            <SmartLink to="/products" className="w-full block">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Store
              </Button>
            </SmartLink>
          </CardContent>
        </Card>
      </section>
    );
  }

  /* ───────────────── LOADING ───────────────── */
  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/10 flex items-center justify-center px-4 transition-colors duration-300">
        <Card className="w-full max-w-md text-center rounded-sm border-2 border-emerald-100 dark:border-emerald-950/20  overflow-hidden bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl">
          <CardContent className="py-16 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-sm" />
              <Loader2 className="h-14 w-14 animate-spin text-primary mx-auto relative z-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-foreground">
                Verifying Payment
              </h2>
              <p className="text-muted-foreground font-medium">
                Please wait while we confirm your transaction.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-muted/50 dark:bg-neutral-800 text-xs font-mono font-bold text-muted-foreground">
              Ref: {reference}
            </div>
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

            <div className="rounded-sm bg-muted p-3 text-xs font-mono">
              Reference: {reference}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={() => verifyPayment(reference)}
              >
                Retry Verification
              </Button>

              <SmartLink to="/products" className="w-full block">
                <Button variant="outline" className="w-full">
                  Back to Store
                </Button>
              </SmartLink>
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
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/10 flex items-center justify-center px-4 transition-colors duration-300">
        <Card className="w-full max-w-md text-center rounded-sm border-2 border-emerald-100 dark:border-emerald-950/20  overflow-hidden bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl">
          <CardContent className="py-16 space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-sm" />
              <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/30 rounded-sm flex items-center justify-center mx-auto relative z-10">
                <CheckCircle className="h-14 w-14 text-emerald-600 dark:text-emerald-500" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black text-foreground">
                Payment Successful
              </h1>
              <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                Your payment has been verified. We're now processing your order.
              </p>
            </div>

            <div className="px-4 py-2 rounded-sm bg-emerald-50 dark:bg-emerald-950/20 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              Ref: {reference}
            </div>

            <SmartLink to={ACCOUNT_ROUTES.ORDERS} className="w-full block">
              <Button className="w-full h-14 rounded-sm text-lg font-bold   hover:scale-105 active:scale-95 transition-all">
                <CreditCard className="mr-2 h-5 w-5" />
                View My Orders
              </Button>
            </SmartLink>
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

          <div className="rounded-sm bg-muted p-3 text-xs font-mono">
            Reference: {reference}
          </div>

          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => verifyPayment(reference)}>
              Retry Verification
            </Button>

            <SmartLink to={ACCOUNT_ROUTES.ORDERS} className="w-full block">
              <Button variant="outline" className="w-full">
                Go to Orders
              </Button>
            </SmartLink>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
