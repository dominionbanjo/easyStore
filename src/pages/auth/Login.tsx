"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
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
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/services/authApi";
import { AUTH_ROUTES } from "@/routes/temp";
import {
  LoginSchema,
  type LoginFormValues,
} from "@/modules/auth/validators/loginValidator";
import { FormInput } from "@/components/shared/FormInput";

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading, isSuccess }] = useLoginMutation();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  // ✅ Redirect on success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successful!");
      navigate("/");
    }
  }, [isSuccess, navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data).unwrap();
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-md">
        {/* Header */}
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Log in to continue shopping on EasyStore.
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
              />

              <div className="text-right text-sm">
                <Link
                  to={AUTH_ROUTES.FORGOT_PASSWORD}
                  className="text-primary hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-white rounded-full py-2 mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Log In"}
              </Button>
            </form>
          </FormProvider>
        </CardContent>

        {/* Footer */}
        <CardFooter className="text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link
            to={AUTH_ROUTES.SIGNUP}
            className="text-primary hover:underline ml-1 font-medium"
          >
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
