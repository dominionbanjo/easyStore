import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useLoginMutation, useGoogleLoginMutation } from "@/services/authApi";
import { handleRoleRedirect, areSubdomainsDisabled } from "@/utils/subdomain";
import { AUTH_ROUTES } from "@/routes/temp";
import {
  LoginSchema,
  type LoginFormValues,
} from "@/modules/auth/validators/loginValidator";
import { FormInput } from "@/components/shared/form/FormInput";
import { AuthLayout } from "../components/AuthLayout";

/* -------------------- Google button width helper -------------------- */
const getGoogleButtonWidth = () => {
  if (window.innerWidth < 360) return 260;
  if (window.innerWidth < 480) return 280;
  if (window.innerWidth < 640) return 300;
  return 340;
};

/* -------------------- Type guard for Google -------------------- */
function hasGoogleIdentity(win: Window): win is Window & {
  google: {
    accounts: {
      id: {
        initialize: Function;
        renderButton: Function;
      };
    };
  };
} {
  return Boolean((win as any).google?.accounts?.id);
}

import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser } = useSelector(
    (state: any) => state.user,
  );
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const showGoogleButton = !areSubdomainsDisabled();

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
  });
  const { handleSubmit } = methods;

  const redirectTo =
    new URLSearchParams(location.search).get("redirect") || "/";

  /* Auto redirect if logged in */
  useEffect(() => {
    const token = Cookies.get("token");
    if (token && isAuthenticated && currentUser) {
      handleRoleRedirect(currentUser, redirectTo, navigate);
    }
  }, [navigate, redirectTo, isAuthenticated, currentUser]);

  /* Normal login */
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();
      const user = res.data.user;

      if (user && user.email_verified === false) {
        toast.warning("Please verify your email before logging in");
        navigate(
          `${AUTH_ROUTES.VERIFY_OTP}?email=${encodeURIComponent(
            user.email,
          )}&reset=true&redirect=${encodeURIComponent(redirectTo)}`,
        );
        return;
      }

      toast.success("Login successful!");
      handleRoleRedirect(user, redirectTo, navigate);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Login failed");
    }
  };

  /* Google OAuth (TS-safe) */
  useEffect(() => {
    if (!showGoogleButton) return;
    if (!googleButtonRef.current) return;

    // ✅ Type-safe guard
    if (!hasGoogleIdentity(window)) return;

    // ✅ Capture google AFTER guard (this fixes TS error)
    const google = window.google;

    const renderGoogleButton = () => {
      if (!googleButtonRef.current) return;

      googleButtonRef.current.innerHTML = "";

      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
        callback: async (response: any) => {
          try {
            const token = response.credential;
            const res: any = await googleLogin({ token }).unwrap();
            const user = res?.data?.user || res?.user;
            toast.success("Logged in with Google!");
            handleRoleRedirect(user, redirectTo, navigate);
          } catch (err: any) {
            toast.error(
              err?.data?.message || err?.message || "Google login failed",
            );
          }
        },
      });

      google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        width: getGoogleButtonWidth(),
      });
    };

    renderGoogleButton();
    window.addEventListener("resize", renderGoogleButton);

    return () => {
      window.removeEventListener("resize", renderGoogleButton);
    };
  }, [googleLogin, navigate, redirectTo, showGoogleButton]);

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="w-5 h-5" />}
          />
          <div className="space-y-2">
            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
            />
            <div className="text-right">
              <Link
                to={AUTH_ROUTES.FORGOT_PASSWORD}
                className="text-sm text-primary hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 rounded-sm text-lg font-bold   active:scale-95 transition-all"
            isLoading={isLoading}
            loadingText="Signing In..."
          >
            Sign In
          </Button>
        </form>
      </FormProvider>

      {/* Divider */}
      {showGoogleButton && (
        <div className="relative my-8 text-center">
          <span className="absolute left-0 right-0 top-1/2 border-t border-border/50" />
          <span className="relative bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
            or continue with
          </span>
        </div>
      )}

      {/* Google */}
      {showGoogleButton && (
        <div className="flex justify-center">
          <div ref={googleButtonRef} />
        </div>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <Link
          to={AUTH_ROUTES.SIGNUP}
          className="text-primary font-semibold hover:underline"
        >
          Sign up
        </Link>
      </div>
    </AuthLayout>
  );
}
