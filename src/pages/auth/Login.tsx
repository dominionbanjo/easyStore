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
import { toast } from "sonner";
import { Link } from "react-router-dom";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    console.log("Login data:", data);
    setTimeout(() => {
      toast.success(`Welcome back, ${data.email}!`);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Log in to continue shopping on EasyStore.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground rounded-full py-2 mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Log In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline ml-1">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
