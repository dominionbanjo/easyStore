"use client";

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

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") || "";
  const isResetFlow = searchParams.get("reset") === "true"; // 🔹 check for ?reset=true

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300); // 5-minute countdown

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // 🔹 If user came from password reset flow, trigger resend immediately
  if (email && isResetFlow) {
    (async () => {
      try {
        await resendOtp({ email }).unwrap();
        toast.success("Verification code has been sent to your email");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to send OTP");
      }
    })();
  }

  // 🔹 Countdown timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Verify OTP handler
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6)
      return toast.error("Please enter the 6-digit OTP code");

    try {
      const res = await verifyOtp({ email, otp }).unwrap();
      toast.success(res.message || "Verification successful!");
      navigate("/auth/login");
    } catch (error: any) {
      toast.error(error?.data?.message || "OTP verification failed");
    }
  };

  // 🔹 Resend OTP handler
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
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4 py-10 overflow-auto">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 md:p-8">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Verify Your Account
          </CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email:
            <span className="block font-medium mt-1 text-gray-800">
              {email}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleVerify}
            className="flex flex-col items-center space-y-8"
          >
            {/* OTP Input */}
            <OtpInput
              containerStyle="w-full items-center justify-center mt-2 flex mb-10"
              inputStyle={{
                backgroundColor: "#f2f2f2",
                width: 48,
                height: 48,
                borderRadius: 5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #FFFFFF1A",
                color: "#000",
              }}
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span className="mr-3" />}
              renderInput={(props) => <input {...props} />}
            />

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full bg-primary text-white rounded-full py-2 hover:bg-primary/90",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              {isLoading ? "Verifying..." : "Verify Account"}
            </Button>

            {/* Timer / Resend Section */}
            {timer > 0 ? (
              <p className="text-sm text-gray-600 text-center">
                You can resend in{" "}
                <span className="font-semibold text-primary">
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
              </p>
            ) : (
              <div className="text-sm text-gray-600 text-center">
                Didn’t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-primary font-medium hover:underline disabled:opacity-60"
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
