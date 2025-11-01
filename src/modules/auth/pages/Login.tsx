import { useEffect, useRef } from "react";
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
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useLoginMutation, useGoogleLoginMutation } from "@/services/authApi";
import { AUTH_ROUTES } from "@/routes/temp";
import {
  LoginSchema,
  type LoginFormValues,
} from "@/modules/auth/validators/loginValidator";
import { FormInput } from "@/components/shared/FormInput";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [login, { isLoading, isSuccess }] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
  });
  const { handleSubmit } = methods;

  const redirectTo =
    new URLSearchParams(location.search).get("redirect") || "/";

  // 🔹 Auto-redirect if already logged in
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) navigate(redirectTo, { replace: true });
  }, [navigate, redirectTo]);

  // 🔹 Redirect after successful login
  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successful!");
      navigate(redirectTo, { replace: true });
    }
  }, [isSuccess, navigate, redirectTo]);

  // 🔹 Handle normal login
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();
      const user = res.user;

      // ✅ Check if user is unverified
      if (user && user.email_verified === false) {
        toast.warning("Please verify your email before logging in");
        navigate(
          `${AUTH_ROUTES.VERIFY_OTP}?email=${encodeURIComponent(
            user.email
          )}&reset=true`
        );
        return;
      }

      // ✅ Normal verified login
      toast.success("Login successful!");
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      const msg = err?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  };

  // 🔹 Google OAuth initialization
  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
        callback: async (response: any) => {
          try {
            const token = response.credential;
            await googleLogin({ token }).unwrap();

            // result is of type IAuthResponse
            toast.success("Logged in with Google!");
            navigate(redirectTo, { replace: true });
          } catch (err: any) {
            toast.error(err?.data?.message || "Google login failed");
          }
        },
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: 340,
      });
    }
  }, [googleLogin, navigate, redirectTo]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md bg-card rounded-2xl shadow-sm border">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Log in to continue shopping on EasyStore.
          </CardDescription>
        </CardHeader>

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
                className="w-full rounded-full py-2 mt-2 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Log In"}
              </Button>
            </form>
          </FormProvider>

          {/* ─────────────── OR Divider ─────────────── */}
          <div className="relative my-6 text-center">
            <span className="absolute left-0 right-0 top-1/2 border-t border-border" />
            <span className="relative bg-card px-3 text-sm text-muted-foreground">
              or continue with
            </span>
          </div>

          {/* ─────────────── GOOGLE BUTTON ─────────────── */}
          <div ref={googleButtonRef} className="flex justify-center" />
        </CardContent>

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
