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
import { FormInput } from "@/components/shared/FormInput";
import { cn } from "@/lib/utils";
import { AUTH_ROUTES } from "@/routes/temp";

// ✅ Zod validation schema
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

  // 🔹 Submit handler
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

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
        <Card className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 md:p-8 text-center">
          <CardTitle className="text-xl font-semibold text-primary mb-2">
            Invalid Reset Link
          </CardTitle>
          <CardDescription className="text-gray-600">
            The password reset link is missing or has expired.
          </CardDescription>
          <Button
            className="mt-6"
            onClick={() => navigate(AUTH_ROUTES.FORGOT_PASSWORD)}
          >
            Request a New Link
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4 py-10">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 md:p-8">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your new password below to complete the reset process.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center space-y-6 w-full"
            >
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
                  "w-full bg-primary text-white rounded-full py-2 hover:bg-primary/90",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
