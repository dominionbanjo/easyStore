import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForgotPasswordMutation } from "@/services/authApi";
import { FormInput } from "@/components/shared/FormInput";
import { cn } from "@/lib/utils";
import { AUTH_ROUTES } from "@/routes/temp";

/* ------------------------- Schema ------------------------- */
const ForgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const methods = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      const res = await forgotPassword(data).unwrap();
      toast.success(res.message || "Password reset link sent successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send password reset link");
    }
  };

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

      {/* Card wrapper */}
      <div className="relative z-10 flex items-center justify-center px-4 pt-16 sm:pt-0 h-full">
        <Card className="w-full max-w-md bg-white/95 rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email address and we’ll send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6">
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
                  disabled={isLoading}
                  className={cn(
                    "w-full rounded-full py-2 bg-[#17c06e] text-black hover:bg-[#17c06e]/90",
                    isLoading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </FormProvider>
          </CardContent>

          <CardFooter className="text-center text-sm text-muted-foreground">
            Remembered your password?
            <button
              onClick={() => navigate(AUTH_ROUTES.LOGIN)}
              className="text-black hover:underline ml-1 font-medium"
            >
              Log in
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
