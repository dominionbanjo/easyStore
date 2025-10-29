"use client";

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

// ✅ Validation Schema
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
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4 py-10">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 md:p-8">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email address and we’ll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center space-y-6 w-full"
            >
              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
              />

              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full bg-primary text-white rounded-full py-2 hover:bg-primary/90",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </FormProvider>
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground">
          <p>Remembered your password?</p>
          <button
            onClick={() => navigate("/auth/login")}
            className="text-primary hover:underline ml-1 font-medium"
          >
            Log in
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
