import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Store, Globe, CreditCard, Truck } from "lucide-react";
import { toast } from "sonner";

import {
  useUpdateStoreMutation,
  useRegisterStoreBankMutation,
} from "@/services/storeApi";
import {
  useGetNigerianBanksQuery,
  useVerifyBankAccountMutation,
} from "@/services/userApi";

import {
  useGetCloudinarySignatureQuery,
  useDeleteCloudinaryImageMutation,
  type CloudinaryConfig,
} from "@/services/cloudinaryApi";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

// Sub-components
import { SettingsHeader } from "@/modules/vendor/components/settings/SettingsHeader";
import { HorizontalStepper } from "@/modules/vendor/components/settings/HorizontalStepper";
import { StoreIdentityStep } from "@/modules/vendor/components/settings/StoreIdentityStep";
import { ContactLocationStep } from "@/modules/vendor/components/settings/ContactLocationStep";
import { PayoutSetupStep } from "@/modules/vendor/components/settings/PayoutSetupStep";
import { DeliverySetupStep } from "@/modules/vendor/components/settings/DeliverySetupStep";
import { AddressModal } from "@/modules/vendor/components/settings/AddressModal";
import { useStoreSetup } from "@/modules/vendor/hooks/useStoreSetup";
import { StoreSettingsCompleteView } from "@/modules/vendor/components/settings/StoreSettingsCompleteView";

const STEPS = [
  { id: 1, title: "Store Identity", icon: Store },
  { id: 2, title: "Contact Details", icon: Globe },
  { id: 3, title: "Payout Setup", icon: CreditCard },
  { id: 4, title: "Delivery Rates", icon: Truck },
];

export default function SettingsPage() {
  const {
    store,
    isLoading: isLoadingStore,
    progress,
    isValidated,
  } = useStoreSetup();

  const [updateStore, { isLoading: isUpdatingStore }] =
    useUpdateStoreMutation();
  const [registerBank, { isLoading: isRegisteringBank }] =
    useRegisterStoreBankMutation();
  const { data: banksResponse } = useGetNigerianBanksQuery();
  const [verifyBank, { isLoading: isVerifyingBank }] =
    useVerifyBankAccountMutation();

  /* ───────── CLOUDINARY ───────── */
  const {
    data: signature,
    isLoading: signing,
    isError: signatureError,
    refetch: refetchSignature,
  } = useGetCloudinarySignatureQuery();

  const [deleteCloudinaryImage, { isLoading: isDeletingBanner }] =
    useDeleteCloudinaryImageMutation();

  const [activeStep, setActiveStep] = useState(1);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  // Banner Upload State
  const [bannerUploadProgress, setBannerUploadProgress] = useState<
    number | null
  >(null);
  const [bannerPublicId, setBannerPublicId] = useState<string | null>(null);
  const canUpload =
    Boolean(signature?.signature) && !signing && !signatureError;

  const methods = useForm({
    defaultValues: {
      store_name: "",
      subdomain: "",
      description: "",
      email: "",
      phone_number: "",
      address_street: "",
      address_city: "",
      address_state: "",
      address_country: "Nigeria",
      address_postal_code: "",
      social_links: {} as Record<string, string>,
      bank_code: "",
      account_number: "",
      account_name: "",
    },
  });

  const { reset, watch, setValue, getValues } = methods;

  // Define setup stage logic early so handlers can use it
  const setupStage = store?.setup_stage || 1;
  const isSetupComplete = setupStage >= 5;

  // Subscriptions for internal handlers
  const bankData = {
    bank_code: watch("bank_code"),
    account_number: watch("account_number"),
    account_name: watch("account_name"),
  };

  useEffect(() => {
    if (store) {
      reset({
        store_name: store.store_name || "",
        subdomain: store.subdomain || "",
        description: store.description || "",
        email: store.email || "",
        phone_number: store.phone_number || "",
        address_street: store.address_street || "",
        address_city: store.address_city || "",
        address_state: store.address_state || "",
        address_country: store.address_country || "Nigeria",
        address_postal_code: store.address_postal_code || "",
        social_links: store.social_links || {},
        bank_code: store.bank_code || "",
        account_number: store.account_number || "",
        account_name: "",
      });
      setBannerPreview(store.cover_image || null);
      setBannerPublicId(store.cover_image_public_id || null);
    }
  }, [store, reset]);

  useEffect(() => {
    const stage = store?.setup_stage || 1;
    if (stage <= 4) {
      setActiveStep(stage);
    }
  }, [store]);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size cannot exceed 5MB");
      return;
    }

    if (!canUpload) {
      toast.error("Upload service unavailable");
      return;
    }

    try {
      const freshConfig = await refetchSignature().unwrap();
      setBannerUploadProgress(0);

      const uploaded = await uploadToCloudinary(
        file,
        freshConfig as CloudinaryConfig,
        {
          onProgress: (p) => setBannerUploadProgress(p),
          subfolder: store?.slug || "general",
        },
      );

      setBannerPreview(uploaded.url);
      setBannerPublicId(uploaded.public_id);
      toast.success("Header image uploaded");
    } catch (err) {
      toast.error("Failed to upload header image");
      console.error(err);
    } finally {
      setBannerUploadProgress(null);
      e.target.value = ""; // Reset input
    }
  };

  const handleRemoveBanner = async () => {
    if (!bannerPublicId) return;

    try {
      await deleteCloudinaryImage({ public_id: bannerPublicId }).unwrap();
      setBannerPreview(null);
      setBannerPublicId(null);
      toast.success("Header image removed");
    } catch (error) {
      console.error("Failed to delete image:", error);
      // Still clear local state if it fails? Maybe user wants to remove it from UI anyway.
      // But better to warn.
      // For now, let's force clear UI for UX, even if cloudinary fail (orphaned image is better than broken UI)
      setBannerPreview(null);
      setBannerPublicId(null);
      toast.error("Image removed from view");
    }
  };

  const handleUpdateSocials = (social_links: Record<string, string>) => {
    setValue("social_links", social_links);
  };

  const saveStoreDetails = async () => {
    if (!store?.id) return;
    try {
      const data = getValues();

      // Enforce subdomain on Step 1
      if (activeStep === 1) {
        if (!data.subdomain || data.subdomain.trim() === "") {
          toast.error("Please enter a valid store subdomain to proceed.");
          return;
        }
      }

      // Enforce store address and support hot-line on Step 2
      if (activeStep === 2) {
        if (!data.phone_number || data.phone_number.trim() === "") {
          toast.error("Support Hot-line is compulsory. Please enter your support hot-line to proceed.");
          return;
        }
        if (!data.address_street || data.address_street.trim() === "") {
          toast.error("Store address is compulsory. Please set your store address to proceed.");
          return;
        }
      }

      const formData = new FormData();

      // Fields for Store Update
      const mainFields = [
        "store_name",
        "subdomain",
        "description",
        "email",
        "phone_number",
        "address_street",
        "address_city",
        "address_state",
        "address_country",
        "address_postal_code",
      ];

      mainFields.forEach((field) => {
        formData.append(field, (data as any)[field] || "");
      });

      formData.append("social_links", JSON.stringify(data.social_links));

      let nextSetupStage = setupStage;
      if (!isSetupComplete && activeStep < 3) {
        nextSetupStage = setupStage + 1;
        formData.append("setup_stage", String(nextSetupStage));
      }

      if (bannerPreview && bannerPublicId) {
        formData.append("cover_image", bannerPreview);
        formData.append("cover_image_public_id", bannerPublicId);
      } else if (store?.cover_image && !bannerPreview) {
        formData.append("cover_image", "");
        formData.append("cover_image_public_id", "");
      }

      await updateStore({ id: store.id, data: formData }).unwrap();
      toast.success("Store details updated successfully!");
      if (!isSetupComplete && activeStep < 3) {
        setActiveStep(nextSetupStage);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to update store details");
    }
  };

  const handleVerifyBank = async () => {
    const { account_number, bank_code } = getValues();
    if (account_number.length !== 10 || !bank_code) {
      toast.error(
        "Please provide a valid 10-digit account number and select a bank",
      );
      return;
    }
    try {
      const result = await verifyBank({
        account_number,
        bank_code,
      }).unwrap();
      setValue("account_name", result.account_name);
      toast.success("Bank account verified!");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Verification failed");
    }
  };

  const handleRegisterBank = async () => {
    if (!store?.id || !bankData.bank_code || !bankData.account_number) return;
    try {
      await registerBank({
        id: store.id,
        bank_code: bankData.bank_code,
        account_number: bankData.account_number,
      }).unwrap();
      toast.success("Bank account registered successfully!");
      // Proceed to delivery setup
      setActiveStep(4);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to register bank account");
    }
  };

  if (isLoadingStore) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-center">
        <div className="space-y-4">
          <p className="text-zinc-500 font-bold tracking-tight">
            Store data not found.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-[var(--theme-primary)] hover:underline text-sm font-black"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }

  // If setup is complete, show the finalized details view
  // (Logic moved to top of component)

  if (isSetupComplete) {
    return (
      <StoreSettingsCompleteView store={store} bannerPreview={bannerPreview} />
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="max-w-[1400px] mx-auto space-y-6 pb-20 px-2 sm:px-4">
        <SettingsHeader progress={progress} isValidated={isValidated} />

        <div className="bg-muted/10 rounded-sm border border-border/40 p-1">
          <HorizontalStepper
            steps={STEPS}
            activeStep={activeStep}
            onStepClick={(id: number) => setActiveStep(id)}
          />
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <StoreIdentityStep
                  bannerPreview={bannerPreview}
                  onBannerChange={handleBannerUpload}
                  onBannerRemove={handleRemoveBanner}
                  uploadProgress={bannerUploadProgress}
                  isDeletingBanner={isDeletingBanner}
                  onSave={saveStoreDetails}
                  isSaving={isUpdatingStore}
                  isValidated={isValidated}
                  storeId={store?.id}
                />
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <ContactLocationStep
                  onUpdateSocials={handleUpdateSocials}
                  onOpenAddressModal={() => setShowAddressModal(true)}
                  onSave={saveStoreDetails}
                  isSaving={isUpdatingStore}
                  isValidated={isValidated}
                />
              </motion.div>
            )}

            {activeStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <PayoutSetupStep
                  banks={banksResponse?.data || []}
                  isVerifying={isVerifyingBank}
                  isRegistering={isRegisteringBank}
                  isValidated={isValidated}
                  onVerify={handleVerifyBank}
                  onRegister={handleRegisterBank}
                />
              </motion.div>
            )}

            {activeStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <DeliverySetupStep storeId={store.id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AddressModal
          open={showAddressModal}
          onOpenChange={setShowAddressModal}
        />
      </div>
    </FormProvider>
  );
}
