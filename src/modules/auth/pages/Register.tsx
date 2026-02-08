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
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { useRegisterMutation } from "@/services/authApi";
import { useLazyCheckStoreNameQuery } from "@/services/storeApi";

import {
  SignupSchema,
  type SignupFormValues,
} from "@/modules/auth/validators/signupValidator";

import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { cn } from "@/lib/utils";
import { AUTH_ROUTES } from "@/routes/temp";
import { AuthLayout } from "../components/AuthLayout";
import { PasswordStrengthMeter } from "../components/PasswordStrengthMeter";

export default function SignupPage() {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

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

  /* ───────── Store name lookup ───────── */
  const [checkStoreName] = useLazyCheckStoreNameQuery();

  const [storeNameStatus, setStoreNameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  useEffect(() => {
    if (accountType !== "vendor") return;

    if (!storeName || storeName.trim().length < 3) {
      setStoreNameStatus("idle");
      return;
    }

    setStoreNameStatus("checking");

    const timeout = setTimeout(async () => {
      try {
        // ✅ SUCCESS = AVAILABLE
        await checkStoreName({ name: storeName }).unwrap();
        setStoreNameStatus("available");
      } catch {
        // ❌ ERROR = TAKEN
        setStoreNameStatus("taken");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [storeName, accountType, checkStoreName]);

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
        )}`,
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join EasyStore and start your journey today."
    >
      <div className="relative p-1.5 bg-muted/50 rounded-2xl mb-8 flex items-center border border-border/50">
        <div
          className="absolute h-[calc(100%-12px)] top-1.5 transition-all duration-300 ease-in-out bg-white rounded-xl shadow-sm z-0 border border-border/20"
          style={{
            width: "calc(50% - 12px)",
            left: accountType === "user" ? "6px" : "calc(50% + 6px)",
          }}
        />

        <button
          type="button"
          onClick={() => setValue("account_type", "user")}
          className={cn(
            "flex-1 relative z-10 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200",
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
            "flex-1 relative z-10 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200",
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
            <div className="space-y-4 rounded-xl border border-border/50 bg-muted/30 p-5 mt-2 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 bg-primary rounded-full" />
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
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
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
                className="text-sm font-normal text-muted-foreground leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-0.5 flex-1 cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-primary hover:underline whitespace-nowrap"
                >
                  Terms of Service
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!agreeToTerms || isStoreNameInvalid}
              isLoading={isLoading}
              loadingText="Creating account..."
              className={cn(
                "w-full h-12 rounded-full text-base font-semibold shadow-lg hover:shadow-primary/25 disabled:opacity-50",
              )}
            >
              Create Account
            </Button>
          </div>
        </form>
      </FormProvider>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to={AUTH_ROUTES.LOGIN}
          className="text-primary font-semibold hover:underline"
        >
          Log in
        </Link>
      </div>
    </AuthLayout>
  );
}
