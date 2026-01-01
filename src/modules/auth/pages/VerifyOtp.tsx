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
import { WEBSITE_ROUTES } from "@/routes/temp";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") || "";
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
  }, []);

  /* Countdown timer */
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* Verify OTP */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }

    try {
      const res = await verifyOtp({ email, otp }).unwrap();
      toast.success(res.message || "Verification successful!");
      navigate(WEBSITE_ROUTES.HOME);
    } catch (error: any) {
      toast.error(error?.data?.message || "OTP verification failed");
    }
  };

  /* Resend OTP */
  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
      toast.success("A new OTP has been sent to your email");
      setTimer(300);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend OTP");
    }
  };

  if (!email) return null;

  return (
    <div
      className="fixed inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/easyshop.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Card wrapper */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 pt-16 sm:pt-0">
        <Card className="w-full max-w-md bg-white/95 rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">
              Verify Your Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter the 6-digit code sent to
              <span className="block font-medium text-gray-800 mt-1">
                {email}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8">
            <form
              onSubmit={handleVerify}
              className="flex flex-col items-center space-y-8"
            >
              {/* OTP Input */}
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="w-3" />}
                renderInput={(props) => <input {...props} />}
                containerStyle="flex justify-center"
                inputStyle={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#f3f4f6",
                  color: "#000",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              />

              {/* Verify Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full rounded-full py-2 bg-[#17c06e] text-black hover:bg-[#17c06e]/90",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? "Verifying..." : "Verify Account"}
              </Button>

              {/* Timer / Resend */}
              {timer > 0 ? (
                <p className="text-sm text-gray-600 text-center">
                  You can resend in{" "}
                  <span className="font-semibold text-[#17c06e]">
                    {String(Math.floor(timer / 60)).padStart(2, "0")}:
                    {String(timer % 60).padStart(2, "0")}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-600 text-center">
                  Didn’t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="font-medium text-[#17c06e] hover:underline disabled:opacity-60"
                  >
                    {isResending ? "Resending..." : "Resend OTP"}
                  </button>
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
