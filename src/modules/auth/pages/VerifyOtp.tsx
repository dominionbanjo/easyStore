import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/services/authApi";
import { cn } from "@/lib/utils";
import { WEBSITE_ROUTES, AUTH_ROUTES } from "@/routes/temp";
import { AuthLayout } from "../components/AuthLayout";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const isResetFlow = searchParams.get("reset") === "true";

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  /* Auto-send OTP for reset flow */
  useEffect(() => {
    if (email && isResetFlow) {
      (async () => {
        try {
          await resendOtp({ email }).unwrap();
          toast.success("Verification code sent to your email");
        } catch (error: any) {
          toast.error(error?.data?.message || "Failed to send OTP");
        }
      })();
    }
  }, [email, isResetFlow, resendOtp]);

  /* Countdown timer */
  useEffect(() => {
    if (!email) return;

    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [email]);

  /* Verify OTP */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }

    try {
      const res = await verifyOtp({ email: email!, otp }).unwrap();
      toast.success(res.message || "Verification successful!");
      navigate(WEBSITE_ROUTES.HOME);
    } catch (error: any) {
      toast.error(error?.data?.message || "OTP verification failed");
    }
  };

  /* Resend OTP */
  const handleResend = async () => {
    if (!email) return;

    try {
      await resendOtp({ email }).unwrap();
      toast.success("A new OTP has been sent to your email");
      setTimer(300);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend OTP");
    }
  };

  if (!email) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md bg-white/95 rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">
              Invalid Verification Link
            </CardTitle>
            <CardDescription className="text-gray-600">
              This verification link is missing or has expired.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8 space-y-4">
            <Button
              className="w-full rounded-full py-2"
              onClick={() => navigate(AUTH_ROUTES.LOGIN)}
            >
              Back to Login
            </Button>

            <Button
              variant="outline"
              className="w-full rounded-full py-2"
              onClick={() => navigate(AUTH_ROUTES.FORGOT_PASSWORD)}
            >
              Request New Code
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Verify Your Account"
      subtitle={`Enter the 6-digit code sent to ${email}`}
    >
      <form
        onSubmit={handleVerify}
        className="flex flex-col items-center space-y-8"
      >
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderInput={(props) => (
            <input
              {...props}
              className={cn(
                "w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-border bg-background text-foreground text-xl font-semibold text-center focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm",
                props.className,
              )}
              style={{}} // Override default styles if any
            />
          )}
          containerStyle="flex justify-center gap-2 sm:gap-3"
        />

        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Verifying..."
          className="w-full h-11 rounded-full text-base font-semibold shadow-md active:scale-95 transition-all"
        >
          Verify Account
        </Button>

        {timer > 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            You can resend in{" "}
            <span className="font-semibold text-primary">
              {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
            </span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Didn’t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-medium text-primary hover:underline disabled:opacity-60"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          </p>
        )}
      </form>
    </AuthLayout>
  );
}
