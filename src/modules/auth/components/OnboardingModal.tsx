import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Store, User, FileText, LayoutGrid } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { useAppSelector } from "@/hooks";
import { selectCurrentUser } from "@/features/userSlice";
import {
  useCreateStoreMutation,
  useLazyCheckStoreNameQuery,
} from "@/services/storeApi";
// import { cn } from "@/lib/utils";

/* ───────── SCHEMA ───────── */
const CreateStoreSchema = z.object({
  store_name: z.string().min(3, "Store name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  current_sales_channel: z.string().min(1, "Please select a sales channel"),
});

type CreateStoreValues = z.infer<typeof CreateStoreSchema>;

export function OnboardingModal() {
  const user = useAppSelector(selectCurrentUser);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"role-selection" | "store-form">(
    "role-selection",
  );
  const [createStore, { isLoading }] = useCreateStoreMutation();

  // Store name availability state
  const [checkStoreName] = useLazyCheckStoreNameQuery();
  const [storeNameStatus, setStoreNameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const form = useForm<CreateStoreValues>({
    resolver: zodResolver(CreateStoreSchema),
  });

  const { watch, handleSubmit } = form;
  const storeName = watch("store_name");

  /* ───────── CHECK ELIGIBILITY ───────── */
  useEffect(() => {
    if (!user) return;
    if (user.account_type === "vendor") return;
    if (!user.email_verified) return;

    // 1. Check if user created recently (e.g., within last 5 minutes)
    const createdAt = new Date(user.created_at).getTime();
    const now = Date.now();
    const isNew = now - createdAt < 5 * 60 * 1000; // 5 minutes threshold

    // 2. Check localStorage
    const hasSeenOnboarding = localStorage.getItem("easyStore_onboarding_seen");

    // 3. If new and hasn't seen modal, show it
    if (isNew && !hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, [user]);

  /* ───────── STORE NAME CHECK ───────── */
  useEffect(() => {
    if (step !== "store-form" || !storeName || storeName.trim().length < 3) {
      setStoreNameStatus("idle");
      return;
    }

    setStoreNameStatus("checking");
    const timeout = setTimeout(async () => {
      try {
        await checkStoreName({ name: storeName }).unwrap();
        setStoreNameStatus("available");
      } catch {
        setStoreNameStatus("taken");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [storeName, step, checkStoreName]);

  /* ───────── ACTIONS ───────── */
  const markAsSeen = () => {
    localStorage.setItem("easyStore_onboarding_seen", "true");
    setIsOpen(false);
  };

  const handleRoleSelection = (role: "buy" | "sell") => {
    if (role === "buy") {
      markAsSeen();
    } else {
      setStep("store-form");
    }
  };

  const onSubmit = async (data: CreateStoreValues) => {
    try {
      if (!user) return;

      // Pass user details explicitly along with store details
      await createStore({
        ...data,
        user_id: user.id,
        email: user.email,
        // The backend controller we modified handles account_type update
      }).unwrap();

      toast.success("Store created successfully!");
      // Optionally reload the page to refresh user state (account_type -> vendor)
      // Or rely on RTK Query invalidation if configured correctly.
      // Since user object in Redux might be stale, a full refresh or re-fetch of 'me' is good.
      // For now, let's reload to be safe and ensure the dashboard redirect logic kicks in if applicable.
      window.location.reload();

      markAsSeen();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create store");
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && markAsSeen()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-center">
              {step === "role-selection"
                ? "Welcome to EasyStore! 👋"
                : "Setup your Store 🏪"}
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              {step === "role-selection"
                ? "How do you plan to use EasyStore today?"
                : "Tell us a bit about your business to get started."}
            </DialogDescription>
          </DialogHeader>

          {step === "role-selection" ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelection("buy")}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 border-muted bg-muted/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group text-center"
              >
                <div className="p-4 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">I want to Buy</h3>
                  <p className="text-xs text-muted-foreground">
                    Discover amazing products from verified vendors
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection("sell")}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 border-muted bg-muted/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group text-center"
              >
                <div className="p-4 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">I want to Sell</h3>
                  <p className="text-xs text-muted-foreground">
                    Create your store and start selling in minutes
                  </p>
                </div>
              </button>
            </div>
          ) : (
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                <div className="pt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setStep("role-selection")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    isLoading={isLoading}
                    disabled={
                      storeNameStatus === "taken" ||
                      storeNameStatus === "checking"
                    }
                  >
                    Create Store
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
