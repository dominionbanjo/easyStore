import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
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

  /* Auto redirect if logged in */
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) navigate(redirectTo, { replace: true });
  }, [navigate, redirectTo]);

  /* Redirect after success */
  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successful!");
      navigate(redirectTo, { replace: true });
    }
  }, [isSuccess, navigate, redirectTo]);

  /* Normal login */
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();
      const user = res.data.user;

      if (user && user.email_verified === false) {
        toast.warning("Please verify your email before logging in");
        navigate(
          `${AUTH_ROUTES.VERIFY_OTP}?email=${encodeURIComponent(
            user.email
          )}&reset=true`
        );
        return;
      }

      toast.success("Login successful!");
      // navigate(redirectTo, { replace: true });
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  /* Google OAuth (TS-safe) */
  useEffect(() => {
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
            await googleLogin({ token }).unwrap();
            toast.success("Logged in with Google!");
            navigate(redirectTo, { replace: true });
          } catch (err: any) {
            toast.error(err?.data?.message || "Google login failed");
          }
        },
      });

      google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: getGoogleButtonWidth(),
      });
    };

    renderGoogleButton();
    window.addEventListener("resize", renderGoogleButton);

    return () => {
      window.removeEventListener("resize", renderGoogleButton);
    };
  }, [googleLogin, navigate, redirectTo]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/easyshop.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Back */}
      <Link
        to="/"
        className="
    absolute top-4 left-4 z-20
    inline-flex items-center gap-2
    rounded-full
    bg-white/90 backdrop-blur
    text-black shadow-md
    transition hover:bg-white
    px-2.5 py-2 text-sm
    sm:px-4 sm:py-2
  "
        aria-label="Back to homepage"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back to homepage</span>
      </Link>

      {/* CARD */}
      <Card className="relative w-full max-w-md max-h-[90vh] bg-white/95 rounded-2xl shadow-xl flex flex-col overflow-hidden mt-12">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Log in to continue shopping on EasyStore.
          </CardDescription>
        </CardHeader>

        {/* Scroll container */}
        <div className="relative flex-1 overflow-y-auto px-6 pb-8">
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
                className="w-full rounded-full py-2 mt-2 bg-[#17c06e] text-black hover:bg-[#17c06e]/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Log In"}
              </Button>
            </form>
          </FormProvider>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <span className="absolute left-0 right-0 top-1/2 border-t border-border" />
            <span className="relative bg-white px-3 text-sm text-muted-foreground">
              or continue with
            </span>
          </div>

          {/* Google */}
          <div ref={googleButtonRef} className="flex justify-center" />
        </div>

        <CardFooter className="text-center text-sm text-muted-foreground">
          Don’t have an account?
          <Link
            to={AUTH_ROUTES.SIGNUP}
            className="text-black ml-1 hover:underline"
          >
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
