import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleRoleRedirect } from "@/utils/subdomain";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Store, User, FileText, LayoutGrid } from "lucide-react";

import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import {
  useAppSelector,
  useAppDispatch,
} from "@/hooks";
import {
  selectCurrentUser,
  setShowOnboardingModal,
  selectShowOnboardingModal,
  selectOnboardingModalStep,
  setUser,
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
  const navigate = useNavigate();
  const showViaRedux = useAppSelector(selectShowOnboardingModal);
  const initialStep = useAppSelector(selectOnboardingModalStep);

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"role-selection" | "store-form">(
    initialStep || "role-selection",
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

  // Prevent showing if user is already a vendor or staff
  const isVendor = user?.account_type === "vendor";
  const isStaff = user?.account_type === "staff";

  /* ───────── CHECK ELIGIBILITY ───────── */
  useEffect(() => {
    if (!user || isVendor || isStaff) return;
    if (!user.email_verified) return;

    // 1. Check if user created recently (e.g., within last 5 minutes)
    const createdAt = new Date(user.created_at).getTime();
    const now = Date.now();
    const isNew = now - createdAt < 5 * 60 * 1000; // 5 minutes threshold

    // 2. Check localStorage
    const hasSeenOnboarding = localStorage.getItem("eazyStore_onboarding_seen");

    // 3. If new and hasn't seen modal, show it
    if (isNew && !hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, [user, isVendor]);

  // Sync with Redux trigger
  useEffect(() => {
    if (showViaRedux && !isVendor && !isStaff) {
      setIsOpen(true);
      if (initialStep) {
        setStep(initialStep);
      }
    }
  }, [showViaRedux, isVendor, initialStep]);

  /* ───────── STORE NAME CHECK ───────── */
  useEffect(() => {
    if (step !== "store-form" || !storeName || storeName.trim().length < 3) {
      setStoreNameStatus("idle");
      return;
    }

    setStoreNameStatus("checking");

    const timer = setTimeout(async () => {
      try {
        await checkStoreName({ name: storeName.trim() }).unwrap();
        setStoreNameStatus("available");
      } catch {
        setStoreNameStatus("taken");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [storeName, step, checkStoreName]);

  /* ───────── ACTIONS ───────── */
  const markAsSeen = () => {
    localStorage.setItem("eazyStore_onboarding_seen", "true");
    setIsOpen(false);
    dispatch(setShowOnboardingModal({ show: false }));
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
      markAsSeen();
      
      const updatedUser = { ...user, account_type: "vendor" as const };
      dispatch(setUser({ user: updatedUser }));

      handleRoleRedirect(
        updatedUser,
        "/",
        navigate
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create store");
    }
  };

  if (!isOpen || isVendor) return null;

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && markAsSeen()}
      className="max-w-[95vw] sm:max-w-[550px]"
      contentClassName="p-0"
    >
      <div className="p-0">
        {step === "role-selection" ? (
          <div className="p-6 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-center uppercase tracking-tight">
                Welcome to EazyStore! 👋
              </h2>
              <p className="text-center text-muted-foreground font-medium mt-2">
                How do you plan to use EazyStore today?
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleRoleSelection("sell")}
                className="flex items-center gap-4 p-4 rounded-sm border-2 border-muted bg-muted/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 group text-left"
              >
                <div className="h-12 w-12 rounded-sm bg-white shrink-0 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-sm">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-tight text-base mb-0.5">
                    I want to Sell
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium leading-tight">
                    Create your store and start selling in minutes
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection("buy")}
                className="flex items-center gap-4 p-4 rounded-sm border-2 border-muted bg-muted/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 group text-left"
              >
                <div className="h-12 w-12 rounded-sm bg-white shrink-0 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-tight text-base mb-0.5">
                    I want to Buy
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium leading-tight">
                    Discover amazing products from verified vendors
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
          </div>
        ) : (
          <div className="p-6 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-center uppercase tracking-tight">
                Setup your Store 🏪
              </h2>
              <p className="text-center text-muted-foreground font-medium mt-2">
                Tell us about your business to get started.
              </p>
            </div>

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
                          <span className="h-3 w-3 animate-spin rounded-sm border-2 border-primary/20 border-t-primary" />
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

                <div className="pt-6 grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-sm font-semibold text-sm border-muted-foreground/20"
                    onClick={() => setStep("role-selection")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="h-12 rounded-sm font-semibold text-sm  "
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
          </div>
        )}
      </div>
    </Modal>
  );
}
