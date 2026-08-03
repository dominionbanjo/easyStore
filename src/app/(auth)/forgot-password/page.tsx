import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useForgotPasswordMutation } from "@/services/authApi";
import { useAppDispatch } from "@/hooks";
import { clearUser } from "@/features/userSlice";
import { FormInput } from "@/components/shared/form/FormInput";
import { AUTH_ROUTES } from "@/routes/temp";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { extractErrorMessage } from "@/utils/errorHandler";

/* ------------------------- Schema ------------------------- */
const ForgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const prefilledEmail = searchParams.get("email") || "";

  const methods = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: prefilledEmail },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      const res = await forgotPassword(data).unwrap();
      toast.success(res.message || "Password reset link sent successfully");
      dispatch(clearUser());
      Cookies.remove("token");
      localStorage.clear();
      navigate(AUTH_ROUTES.LOGIN);
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to send password reset link"));
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email address and we’ll send you a link to reset your password."
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Sending..."
            className="w-full h-11 rounded-sm text-base font-semibold  active:scale-95 transition-all"
          >
            Send Reset Link
          </Button>
        </form>
      </FormProvider>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <button
          onClick={() =>
            navigate(
              `${AUTH_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectTo)}`,
            )
          }
          className="text-primary font-semibold hover:underline"
        >
          Log in
        </button>
      </div>
    </AuthLayout>
  );
}
