import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useResetPasswordMutation } from "@/services/authApi";
import { FormInput } from "@/components/shared/form/FormInput";
import { AUTH_ROUTES } from "@/routes/temp";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { PasswordStrengthMeter } from "@/modules/auth/components/PasswordStrengthMeter";
import { extractErrorMessage } from "@/utils/errorHandler";

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

  const { handleSubmit, watch } = methods;
  const password = watch("password");

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
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to reset password"));
    }
  };

  /* ---------------- Invalid / Expired Link ---------------- */
  if (!email || !token) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md bg-white/95 rounded-sm  text-center p-8">
          <CardTitle className="text-xl font-semibold mb-2 text-destructive">
            Invalid Reset Link
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            The password reset link is missing or has expired.
          </CardDescription>

          <Button
            className="mt-6 w-full rounded-sm"
            onClick={() => navigate(AUTH_ROUTES.FORGOT_PASSWORD)}
          >
            Request a New Link
          </Button>
        </Card>
      </div>
    );
  }

  /* ---------------- Normal Reset Page ---------------- */
  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your new password below to complete the reset process."
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <FormInput
              label="New Password"
              name="password"
              type="password"
              placeholder="Enter new password"
            />
            <PasswordStrengthMeter password={password} />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Resetting..."
            className="w-full h-11 rounded-sm text-base font-semibold  active:scale-95 transition-all"
          >
            Reset Password
          </Button>
        </form>
      </FormProvider>
    </AuthLayout>
  );
}
