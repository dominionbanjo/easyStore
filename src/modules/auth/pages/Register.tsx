import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { useRegisterMutation } from "@/services/authApi";
import { useLazyCheckStoreNameQuery } from "@/services/storeApi";

import {
  SignupSchema,
  type SignupFormValues,
} from "@/modules/auth/validators/signupValidator";

import { FormInput } from "@/components/shared/FormInput";
import { FormSelect } from "@/components/shared/FormSelect";
import { cn } from "@/lib/utils";
import { AUTH_ROUTES } from "@/routes/temp";

export default function SignupPage() {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      account_type: "user",
      agree_to_terms: false,
    },
  });

  const { handleSubmit, watch, setValue } = form;

  const accountType = watch("account_type");
  const agreeToTerms = watch("agree_to_terms");
  const storeName = watch("store_name");

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
          res.data.user.email
        )}`
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/easyshop.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Back */}
      <Link
        to="/"
        className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-sm shadow-md hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back to homepage</span>
      </Link>

      <div className="relative z-10 flex items-center justify-center h-full px-4 pt-14 sm:pt-0">
        <Card className="w-full max-w-md max-h-[90vh] bg-white/95 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-2xl font-bold">
              Create your account
            </CardTitle>
            <CardDescription>
              Join EasyStore and start your journey
            </CardDescription>

            {/* Account Type */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setValue("account_type", "user")}
                className={clsx(
                  "flex-1 rounded-full px-4 py-2 text-sm font-semibold border",
                  accountType === "user"
                    ? "bg-[#17c06e] text-black border-[#17c06e]"
                    : "bg-white border-gray-300"
                )}
              >
                I want to buy
              </button>

              <button
                type="button"
                onClick={() => setValue("account_type", "vendor")}
                className={clsx(
                  "flex-1 rounded-full px-4 py-2 text-sm font-semibold border",
                  accountType === "vendor"
                    ? "bg-[#17c06e] text-black border-[#17c06e]"
                    : "bg-white border-gray-300"
                )}
              >
                I want to sell
              </button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto px-6 pb-6">
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="First Name"
                    name="first_name"
                    placeholder="Enter your first name"
                  />
                  <FormInput
                    label="Last Name"
                    name="last_name"
                    placeholder="Enter your first name"
                  />
                </div>

                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="example@mail.com"
                />
                <FormInput
                  label="Phone Number"
                  name="phone_number"
                  placeholder="0808888888 or +23444444444"
                />
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="**********"
                />

                {accountType === "vendor" && (
                  <div className="space-y-4 rounded-xl border bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Store details
                    </p>

                    {/* Store name with status */}
                    <div className="relative">
                      <FormInput
                        label="Store Name"
                        name="store_name"
                        placeholder="Enter Your store name"
                      />

                      {storeNameStatus !== "idle" && (
                        <div className="absolute right-3 top-[38px] text-xs">
                          {storeNameStatus === "checking" && (
                            <span className="flex items-center gap-1 text-gray-500">
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-[#17c06e]" />
                              Checking…
                            </span>
                          )}

                          {storeNameStatus === "available" && (
                            <span className="text-green-600 font-medium">
                              Available
                            </span>
                          )}

                          {storeNameStatus === "taken" && (
                            <span className="text-red-500 font-medium">
                              Already taken
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <FormInput
                      label="About Store"
                      name="description"
                      placeholder="What do you sell or provide"
                    />

                    <FormSelect
                      name="current_sales_channel"
                      label="Current Sales Channel"
                      placeholder="Select channel"
                      options={[
                        { label: "WhatsApp", value: "whatsApp" },
                        { label: "Instagram", value: "instagram" },
                        { label: "Facebook", value: "facebook" },
                        { label: "TikTok", value: "tikTok" },
                        { label: "Other", value: "other" },
                      ]}
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={agreeToTerms}
                    onCheckedChange={(v) => setValue("agree_to_terms", !!v)}
                  />
                  <Label>I agree to the Terms & Conditions</Label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !agreeToTerms || isStoreNameInvalid}
                  className={cn(
                    "w-full rounded-full py-2 bg-[#17c06e] text-black",
                    (isLoading || !agreeToTerms || isStoreNameInvalid) &&
                      "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </FormProvider>
          </CardContent>

          <CardFooter className="text-center text-sm text-muted-foreground">
            Already have an account?
            <Link to={AUTH_ROUTES.LOGIN} className="ml-1 hover:underline">
              Log in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
