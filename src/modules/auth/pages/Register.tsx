import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { AuthRoutes } from "@/routes/authRoutes";

/* ------------------------- Schema ------------------------- */
const SignupSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  accountType: z.enum(["buyer", "seller"]),
  storeName: z.string().optional(),
  storeDescription: z.string().optional(),
  storeCategory: z.string().optional(),
});

type SignupFormValues = z.infer<typeof SignupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<"buyer" | "seller">("buyer");

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { accountType: "buyer" },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success(`Welcome ${data.firstName}! 🎉`);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/easyshop.jpg')",
      }}
    >
      {/* overlay */}
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
          <CardTitle className="text-2xl font-bold">
            Create your account
          </CardTitle>
          <CardDescription>
            Join EasyStore and start your journey
          </CardDescription>

          {/* Account Type Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setAccountType("buyer");
                form.setValue("accountType", "buyer");
              }}
              className={clsx(
                "flex-1 rounded-full px-4 py-2 text-sm font-semibold border transition",
                accountType === "buyer"
                  ? "bg-[#17c06e] text-black border-[#17c06e]"
                  : "bg-white text-black border-gray-300 hover:bg-gray-50"
              )}
            >
              I want to buy
            </button>

            <button
              type="button"
              onClick={() => {
                setAccountType("seller");
                form.setValue("accountType", "seller");
              }}
              className={clsx(
                "flex-1 rounded-full px-4 py-2 text-sm font-semibold border transition",
                accountType === "seller"
                  ? "bg-[#17c06e] text-black border-[#17c06e]"
                  : "bg-white text-black border-gray-300 hover:bg-gray-50"
              )}
            >
              I want to sell
            </button>
          </div>
        </CardHeader>

        {/* SCROLLABLE CONTENT */}
        <CardContent className="overflow-y-auto px-6 pb-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>First name</Label>
                <Input {...form.register("firstName")} />
              </div>
              <div className="grid gap-2">
                <Label>Last name</Label>
                <Input {...form.register("lastName")} />
              </div>
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" {...form.register("email")} />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input type="password" {...form.register("password")} />
            </div>

            {/* Seller-only */}
            {accountType === "seller" && (
              <div className="space-y-4 rounded-xl border bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-700">
                  Store details
                </p>
                <div className="grid gap-2">
                  <Label>Store name</Label>
                  <Input {...form.register("storeName")} />
                </div>

                <div className="grid gap-2">
                  <Label>Store Description</Label>
                  <Input
                    placeholder="Give a brief description of your store"
                    {...form.register("storeDescription")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Store category</Label>
                  <Input
                    placeholder="Fashion, Food, Electronics…"
                    {...form.register("storeCategory")}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full py-2 bg-[#17c06e] text-black hover:bg-[#17c06e]/90"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground">
          Already have an account?
          <Link
            to={AuthRoutes.LOGIN}
            className="text-black ml-1 hover:underline"
          >
            Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
