import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Store,
  Mail,
  Phone,
  Lock,
  UserCircle,
  FileText,
  LayoutGrid,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { useRegisterMutation } from "@/services/authApi";
import { useLazyCheckStoreNameQuery } from "@/services/storeApi";
import { useDebounce } from "@/hooks";

import {
  SignupSchema,
  type SignupFormValues,
} from "@/modules/auth/validators/signupValidator";

import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { cn } from "@/lib/utils";
import { AUTH_ROUTES } from "@/routes/temp";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { PasswordStrengthMeter } from "@/modules/auth/components/PasswordStrengthMeter";
import { useGoogleLoginMutation } from "@/services/authApi";
import { areSubdomainsDisabled, handleRoleRedirect } from "@/utils/subdomain";
import { Modal } from "@/components/shared/Modal";
import { TermsOfServiceContent } from "@/components/shared/TermsOfServiceContent";
import { PrivacyPolicyContent } from "@/components/shared/PrivacyPolicyContent";

/* -------------------- Google button width helper -------------------- */
const getGoogleButtonWidth = () => {
  if (window.innerWidth < 360) return 260;
  if (window.innerWidth < 480) return 280;
  if (window.innerWidth < 640) return 300;
  return 340;
};

/* -------------------- Type guard for Google -------------------- */
function hasGoogleIdentity(win: Window): win is Window & {
  google: { accounts: { id: { initialize: Function; renderButton: Function } } };
} {
  return Boolean((win as any).google?.accounts?.id);
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const redirectTo = searchParams.get("redirect") || "/";
  const googleButtonRef = useRef<HTMLDivElement>(null);
  // Only show Google button when subdomains ARE enabled (i.e. production)
  // Google OAuth blocks localhost origins, so we hide it there.
  const showGoogleButton = !areSubdomainsDisabled();

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      account_type: "user",
      agree_to_terms: false,
    },
  });

  const { handleSubmit, watch, setValue } = form;

  // Set role from query param
  useEffect(() => {
    if (role === "vendor") {
      setValue("account_type", "vendor");
    }
  }, [role, setValue]);

  const accountType = watch("account_type");
  const agreeToTerms = watch("agree_to_terms");
  const storeName = watch("store_name");
  const password = watch("password"); // Added for strength meter

  const debouncedStoreName = useDebounce(storeName, 500);

  /* ───────── Store name lookup ───────── */
  const [checkStoreName] = useLazyCheckStoreNameQuery();

  const [storeNameStatus, setStoreNameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  // Effect 1: Handle "Checking..." status immediately as user types
  useEffect(() => {
    if (accountType !== "vendor") return;

    if (!storeName || storeName.trim().length < 3) {
      setStoreNameStatus("idle");
      return;
    }

    // Set checking status if value is different from currently debounced value
    // This provides immediate visual feedback
    if (storeName !== debouncedStoreName) {
      setStoreNameStatus("checking");
    }
  }, [storeName, debouncedStoreName, accountType]);

  // Effect 2: Run the actual check when debounced
  useEffect(() => {
    if (
      accountType !== "vendor" ||
      !debouncedStoreName ||
      debouncedStoreName.trim().length < 3
    ) {
      return;
    }

    const checkAvailability = async () => {
      try {
        await checkStoreName({ name: debouncedStoreName }).unwrap();
        setStoreNameStatus("available");
      } catch {
        setStoreNameStatus("taken");
      }
    };

    checkAvailability();
  }, [debouncedStoreName, accountType, checkStoreName]);

  const isStoreNameInvalid =
    accountType === "vendor" && storeNameStatus === "taken";

  /* ───────── Submit ───────── */
  const onSubmit = async (data: SignupFormValues) => {
    try {
      const res = await registerUser(data).unwrap();

      toast.success(res.message || "Account created successfully!");

      navigate(
        `${AUTH_ROUTES.VERIFY_OTP}?email=${encodeURIComponent(
          res.data.user.email,
        )}&redirect=${encodeURIComponent(redirectTo)}`,
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Signup failed. Please try again.");
    }
  };

  /* Google OAuth */
  useEffect(() => {
    if (!showGoogleButton) return;
    if (!googleButtonRef.current) return;
    if (!hasGoogleIdentity(window)) return;

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
            toast.success("Signed up with Google!");
            handleRoleRedirect(user, redirectTo, navigate);
          } catch (err: any) {
            toast.error(
              err?.data?.message || err?.message || "Google sign-up failed",
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
    return () => window.removeEventListener("resize", renderGoogleButton);
  }, [googleLogin, navigate, redirectTo, showGoogleButton]);

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join EazyStore and start your journey today."
    >
      <div className="relative p-1.5 bg-muted/50 rounded-sm mb-8 flex items-center border border-border/50">
        <div
          className="absolute h-[calc(100%-12px)] top-1.5 transition-all duration-300 ease-in-out bg-white rounded-sm  z-0 border border-border/20"
          style={{
            width: "calc(50% - 12px)",
            left: accountType === "user" ? "6px" : "calc(50% + 6px)",
          }}
        />

        <button
          type="button"
          onClick={() => setValue("account_type", "user")}
          className={cn(
            "flex-1 relative z-10 flex items-center justify-center gap-2.5 py-2.5 rounded-sm text-sm font-semibold transition-colors duration-200",
            accountType === "user"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <User
            className={cn(
              "w-4 h-4",
              accountType === "user" ? "text-primary" : "text-muted-foreground",
            )}
          />
          I want to buy
        </button>

        <button
          type="button"
          onClick={() => setValue("account_type", "vendor")}
          className={cn(
            "flex-1 relative z-10 flex items-center justify-center gap-2.5 py-2.5 rounded-sm text-sm font-semibold transition-colors duration-200",
            accountType === "vendor"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Store
            className={cn(
              "w-4 h-4",
              accountType === "vendor"
                ? "text-primary"
                : "text-muted-foreground",
            )}
          />
          I want to sell
        </button>
      </div>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            <FormInput
              label="First Name"
              name="first_name"
              placeholder="e.g. John"
              icon={<UserCircle className="w-5 h-5" />}
            />
            <FormInput
              label="Last Name"
              name="last_name"
              placeholder="e.g. Doe"
              icon={<UserCircle className="w-5 h-5" />}
            />
          </div>

          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="example@mail.com"
            icon={<Mail className="w-5 h-5" />}
          />
          <FormInput
            label="Phone Number"
            name="phone_number"
            placeholder="080 1234 5678"
            icon={<Phone className="w-5 h-5" />}
          />

          <div>
            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              icon={<Lock className="w-5 h-5" />}
            />
            <PasswordStrengthMeter password={password || ""} />
          </div>

          {accountType === "vendor" && (
            <div className="space-y-4 rounded-sm border border-border/50 bg-muted/30 p-5 mt-2 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 bg-primary rounded-sm" />
                <p className="text-sm font-semibold text-foreground">
                  Store Details
                </p>
              </div>

              {/* Store name with status */}
              <div className="relative">
                <FormInput
                  label="Store Name"
                  name="store_name"
                  placeholder="Enter your store name"
                  icon={<Store className="w-5 h-5" />}
                />

                {storeNameStatus !== "idle" && (
                  <div className="absolute right-3 top-[38px] text-xs">
                    {storeNameStatus === "checking" && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <span className="h-3 w-3 animate-spin rounded-sm border-2 border-primary/20 border-t-primary" />
                        Checking...
                      </span>
                    )}

                    {storeNameStatus === "available" && (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        Available
                      </span>
                    )}

                    {storeNameStatus === "taken" && (
                      <span className="text-destructive font-medium">
                        Already taken
                      </span>
                    )}
                  </div>
                )}
              </div>

              <FormInput
                label="Store Description"
                name="description"
                placeholder="What do you sell?"
                icon={<FileText className="w-5 h-5" />}
              />

              <FormSelect
                name="current_sales_channel"
                label="Current Channel"
                placeholder="Where do you sell now?"
                icon={<LayoutGrid className="w-5 h-5" />}
                options={[
                  { label: "WhatsApp", value: "whatsapp" },
                  { label: "Instagram", value: "instagram" },
                  { label: "Facebook", value: "facebook" },
                  { label: "TikTok", value: "tiktok" },
                  { label: "Other", value: "other" },
                ]}
              />
            </div>
          )}

          <div className="pt-2">
            <div className="flex items-start gap-3 mb-6">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(v) => setValue("agree_to_terms", !!v)}
              />
              <Label
                htmlFor="terms"
                className="text-sm font-medium text-muted-foreground leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-0.5 flex-1 cursor-pointer"
              >
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="inline text-primary hover:underline font-bold transition-all p-0 h-auto bg-transparent border-none align-baseline whitespace-nowrap"
                >
                  Terms of Service
                </button>
              </Label>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!agreeToTerms || isStoreNameInvalid}
              isLoading={isLoading}
              loadingText="Creating account..."
              className={cn(
                "w-full h-12 rounded-sm text-base font-semibold  hover: disabled:opacity-50",
              )}
            >
              Create Account
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* Google OAuth — only shown in production where subdomains work */}
      {showGoogleButton && (
        <>
          <div className="relative my-6 text-center">
            <span className="absolute left-0 right-0 top-1/2 border-t border-border/50" />
            <span className="relative bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
              or continue with
            </span>
          </div>
          <div className="flex justify-center">
            <div ref={googleButtonRef} />
          </div>
        </>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to={`${AUTH_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectTo)}`}
          className="text-primary font-semibold hover:underline"
        >
          Log in
        </Link>
      </div>

      {/* Policy Modals */}
      <Modal
        open={showTermsModal}
        onOpenChange={setShowTermsModal}
        className="max-w-[95vw] sm:max-w-[800px] h-[80vh]"
      >
        <div className="p-4 sm:p-10 pt-16">
          <TermsOfServiceContent />
        </div>
      </Modal>

      <Modal
        open={showPrivacyModal}
        onOpenChange={setShowPrivacyModal}
        className="max-w-[95vw] sm:max-w-[800px] h-[80vh]"
      >
        <div className="p-4 sm:p-10 pt-16">
          <PrivacyPolicyContent />
        </div>
      </Modal>
    </AuthLayout>
  );
}
