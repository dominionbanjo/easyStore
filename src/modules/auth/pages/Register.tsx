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
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/services/authApi";
import { SignupSchema } from "@/modules/auth/validators/signupValidator";
import { type SignupFormValues } from "@/modules/auth/validators/signupValidator";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect } from "@/components/shared/FormSelect";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { AUTH_ROUTES } from "@/routes/temp";

export default function SignupPage() {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { account_type: "user", agree_to_terms: false },
  });

  const { watch, handleSubmit } = form;
  const accountType = watch("account_type");
  const agreeToTerms = watch("agree_to_terms");

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const res = await registerUser(data).unwrap();
      toast.success(res.message || "Account created successfully!");
      navigate(
        `${AUTH_ROUTES.VERIFY_OTP}?email=${encodeURIComponent(res.user.email)}`
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4 py-10 overflow-auto">
      <Card className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6 md:p-8">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Create an Account
          </CardTitle>
          <CardDescription>
            Join EasyStore as a buyer or vendor to start your journey.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* LEFT COLUMN */}
              <div className="space-y-5">
                <FormInput
                  label="First Name"
                  name="first_name"
                  placeholder="Enter your first name"
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                />
                <FormInput
                  label="Phone Number"
                  name="phone_number"
                  type="tel"
                  placeholder="+2348012345678"
                />

                {/* Account Type */}
                <FormSelect
                  name="account_type"
                  label="Account Type"
                  placeholder="Select account type"
                  options={[
                    { label: "Buyer", value: "user" },
                    { label: "Vendor", value: "vendor" },
                  ]}
                />

                {/* Vendor-only left fields */}
                {accountType === "vendor" && (
                  <FormSelect
                    name="current_sales_channel"
                    label="Current Sales Channel"
                    placeholder="Select a sales channel"
                    options={[
                      { label: "WhatsApp", value: "WhatsApp" },
                      { label: "Instagram", value: "Instagram" },
                      { label: "Facebook", value: "Facebook" },
                      { label: "TikTok", value: "TikTok" },
                      { label: "Other", value: "Other" },
                    ]}
                  />
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-5">
                <FormInput
                  label="Last Name"
                  name="last_name"
                  placeholder="Enter your last name"
                />
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Create a secure password"
                />
                <FormInput
                  label="Referral Code"
                  name="referral_code"
                  placeholder="Optional referral code (if any)"
                />

                {accountType === "vendor" && (
                  <>
                    <FormInput
                      label="Store Name"
                      name="store_name"
                      placeholder="Enter your store name"
                    />
                    <FormInput
                      label="Username"
                      name="username"
                      placeholder="Choose a store username"
                    />
                  </>
                )}
              </div>

              {/* TERMS + BUTTON */}
              <div className="col-span-1 md:col-span-2 mt-6 flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="agree_to_terms"
                    checked={agreeToTerms}
                    onCheckedChange={(val) =>
                      form.setValue("agree_to_terms", !!val)
                    }
                    className="h-5 w-5 border-gray-400"
                  />
                  <Label htmlFor="agree_to_terms" className="text-sm">
                    I agree to the{" "}
                    <span className="text-primary hover:underline cursor-pointer">
                      Terms & Conditions
                    </span>
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !agreeToTerms}
                  className={cn(
                    "w-full md:w-1/2 bg-primary text-primary-foreground rounded-full py-2 hover:bg-primary/90",
                    (!agreeToTerms || isLoading) &&
                      "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to={AUTH_ROUTES.LOGIN}
            className="text-primary hover:underline ml-1"
          >
            Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
