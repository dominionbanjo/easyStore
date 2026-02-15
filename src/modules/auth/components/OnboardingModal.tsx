import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Store, User, FileText, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
import { useAppSelector, useAppDispatch } from "@/hooks";
import {
  selectCurrentUser,
  setShowOnboardingModal,
  selectShowOnboardingModal,
} from "@/features/userSlice";
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
  const dispatch = useAppDispatch();
  const showViaRedux = useAppSelector(selectShowOnboardingModal);

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

  // Prevent showing if user is already a vendor
  const isVendor = user?.account_type === "vendor";

  /* ───────── CHECK ELIGIBILITY ───────── */
  useEffect(() => {
    if (!user || isVendor) return;
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
  }, [user, isVendor]);

  // Sync with Redux trigger
  useEffect(() => {
    if (showViaRedux && !isVendor) {
      setIsOpen(true);
    }
  }, [showViaRedux, isVendor]);

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
    dispatch(setShowOnboardingModal(false));
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

      await createStore({
        ...data,
        user_id: user.id,
        email: user.email,
      }).unwrap();

      toast.success("Store created successfully!");
      window.location.reload();
      markAsSeen();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create store");
    }
  };

  if (!isOpen || isVendor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && markAsSeen()}>
      <DialogContent className="max-w-[95vw] sm:max-w-[550px] p-0 overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border-none shadow-2xl bg-background">
        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {step === "role-selection" ? (
                <motion.div
                  key="role-selection"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogHeader className="mb-8">
                    <DialogTitle className="text-2xl sm:text-3xl font-black text-center uppercase tracking-tight">
                      Welcome to EasyStore! 👋
                    </DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground font-medium mt-2">
                      How do you plan to use EasyStore today?
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleRoleSelection("buy")}
                      className="flex flex-col items-center justify-center gap-5 p-8 rounded-[2rem] border-2 border-muted bg-muted/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 group text-center"
                    >
                      <div className="h-16 w-16 rounded-2xl bg-white shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-black uppercase tracking-tight text-lg mb-1">
                          I want to Buy
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                          Discover amazing products from verified vendors
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleSelection("sell")}
                      className="flex flex-col items-center justify-center gap-5 p-8 rounded-[2rem] border-2 border-muted bg-muted/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 group text-center"
                    >
                      <div className="h-16 w-16 rounded-2xl bg-white shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                        <Store className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-black uppercase tracking-tight text-lg mb-1">
                          I want to Sell
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                          Create your store and start selling in minutes
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/50 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => markAsSeen()}
                      className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]"
                    >
                      Skip for now
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="store-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogHeader className="mb-8">
                    <DialogTitle className="text-2xl sm:text-3xl font-black text-center uppercase tracking-tight">
                      Setup your Store 🏪
                    </DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground font-medium mt-2">
                      Tell us about your business to get started.
                    </DialogDescription>
                  </DialogHeader>

                  <FormProvider {...form}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      <div className="relative">
                        <FormInput
                          label="Store Name"
                          name="store_name"
                          placeholder="e.g. Dominion Gadgets"
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
                              <span className="text-green-600 font-bold flex items-center gap-1">
                                Available
                              </span>
                            )}
                            {storeNameStatus === "taken" && (
                              <span className="text-destructive font-bold">
                                Taken
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <FormInput
                        label="Store Description"
                        name="description"
                        placeholder="Tell your customers what you sell..."
                        icon={<FileText className="w-5 h-5" />}
                      />

                      <FormSelect
                        name="current_sales_channel"
                        label="Current Sales Channel"
                        placeholder="Where do you sell mostly?"
                        icon={<LayoutGrid className="w-5 h-5" />}
                        options={[
                          { label: "WhatsApp", value: "whatsapp" },
                          { label: "Instagram", value: "instagram" },
                          { label: "Facebook", value: "facebook" },
                          { label: "TikTok", value: "tiktok" },
                          { label: "Other Marketplace", value: "other" },
                        ]}
                      />

                      <div className="pt-6 flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 h-12 rounded-2xl font-bold uppercase tracking-widest text-xs border-muted-foreground/20"
                          onClick={() => setStep("role-selection")}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
