import { ArrowLeft } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useResetPasswordMutation } from "@/services/authApi";
import { FormInput } from "@/components/shared/form/FormInput";
import { cn } from "@/lib/utils";
import { AUTH_ROUTES } from "@/routes/temp";

/* ------------------------- Schema ------------------------- */
const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password must be less than 50 characters"),
});

type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const methods = useForm<ResetPasswordValues>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!email || !token) {
      toast.error("Invalid or missing reset link");
      return;
    }

    try {
      const res = await resetPassword({
        email,
        token,
        password: data.password,
      }).unwrap();

      toast.success(res.message || "Password reset successful!");
      navigate(AUTH_ROUTES.LOGIN);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  /* ---------------- Invalid / Expired Link ---------------- */
  if (!email || !token) {
    return (
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/easyshop.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <Card className="w-full max-w-md bg-white/95 rounded-2xl shadow-xl text-center p-6">
            <CardTitle className="text-xl font-semibold mb-2">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-gray-600">
              The password reset link is missing or has expired.
            </CardDescription>

            <Button
              className="mt-6 rounded-full bg-[#17c06e] text-black hover:bg-[#17c06e]/90"
              onClick={() => navigate(AUTH_ROUTES.FORGOT_PASSWORD)}
            >
              Request a New Link
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  /* ---------------- Normal Reset Page ---------------- */
  return (
    <div
      className="fixed inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/easyshop.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Back button */}
      <button
        onClick={() => navigate(AUTH_ROUTES.LOGIN)}
        className="
          fixed top-4 left-4 z-30
          inline-flex items-center gap-2
          rounded-full bg-white/90 backdrop-blur
          text-black shadow-md
          px-3 py-2 text-sm
          hover:bg-white transition
        "
        aria-label="Back to login"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 pt-16 sm:pt-0">
        <Card className="w-full max-w-md bg-white/95 rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your new password below to complete the reset process.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormInput
                  label="New Password"
                  name="password"
                  type="password"
                  placeholder="Enter new password"
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full rounded-full py-2 bg-[#17c06e] text-black hover:bg-[#17c06e]/90",
                    isLoading && "opacity-70 cursor-not-allowed",
                  )}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
