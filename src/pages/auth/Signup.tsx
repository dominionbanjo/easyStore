"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Link } from "react-router-dom";

/* ------------------------- ✅ Schema ------------------------- */
const SignupSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    accountType: z.enum(["buyer", "seller"]).optional(),
  })
  .refine((data) => !!data.accountType, {
    message: "Please select account type",
    path: ["accountType"],
  });

type SignupFormValues = z.infer<typeof SignupSchema>;

/* ------------------------- ✅ Component ------------------------- */
export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      accountType: "buyer",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    console.log("Signup data:", data);
    setTimeout(() => {
      toast.success(
        `Welcome, ${data.firstName}! Your ${data.accountType} account is ready 🎉`
      );
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Create an Account
          </CardTitle>
          <CardDescription>
            Join EasyStore as a buyer or seller to start your journey.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* First Name */}
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...form.register("firstName")}
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...form.register("lastName")}
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Account Type Dropdown */}
            <div className="grid gap-2">
              <Label>Account Type</Label>
              <Select
                defaultValue={form.getValues("accountType")}
                onValueChange={(val) =>
                  form.setValue("accountType", val as "buyer" | "seller")
                }
              >
                <SelectTrigger className="w-full rounded-md">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.accountType && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.accountType.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground rounded-full py-2 mt-2 hover:bg-primary/90"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline ml-1">
            Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
